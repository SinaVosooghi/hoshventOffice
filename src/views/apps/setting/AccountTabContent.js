// ** React Imports
import { Fragment, useEffect, useState } from "react";

import { useForm, Controller } from "react-hook-form";
import "cleave.js/dist/addons/cleave-phone.us";
// ** Custom Components
import Avatar from "@components/avatar";
import { showImage } from "@utils";
import toast from "react-hot-toast";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  FormFeedback,
} from "reactstrap";

// ** Utils
import { useMutation } from "@apollo/client";

// ** Demo Components
import { t } from "i18next";
import { GET_ITEM_QUERY, UPDATE_ITEM_MUTATION } from "./gql";
import axios from "axios";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import { hashConfig } from "../../../utility/Utils";
import { convertHtmlToDraft, sleep } from "../../../utility/Utils";

const AccountTabs = ({ data }) => {
  // ** Hooks
  const defaultValues = {
    title: data?.title?.split(" ")[0],
  };

  const [description, setDescription] = useState(EditorState.createEmpty());

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    if (data) {
      data.description && setDescription(convertHtmlToDraft(data.description));
      for (const [key, value] of Object.entries(data)) {
        setValue(key, value);
      }
    }
  }, [data]);

  // ** States
  const [avatar, setAvatar] = useState(data?.avatar ? data?.avatar : "");
  const [update, { loading }] = useMutation(UPDATE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEM_QUERY],
    onCompleted: (data) => {
      toast.success(t("Data saved successfully"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onChange = (e, type) => {
    if (e === null) {
      update({
        refetchQueries: [GET_ITEM_QUERY],
        variables: { input: { [type]: null } },
      });
    } else {
      const reader = new FileReader(),
        files = e.target.files;
      reader.onload = function () {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(files[0]);

      const formData = new FormData();

      formData.append("image", files[0]);

      axios
        .post(import.meta.env.VITE_UPLOAD_MULTIPLE_API, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(({ data }) =>
          update({
            refetchQueries: [GET_ITEM_QUERY],
            variables: { input: { [type]: data[0].filename } },
          })
        );
    }
  };

  const onSubmit = (data) => {
    delete data.__typename;
    delete data.created;
    delete data.updated;
    delete data.id;

    const logo = data.logo;

    const rawContentState = convertToRaw(description.getCurrentContent());
    const markup = draftToHtml(rawContentState, hashConfig, true);
    delete data.logo;

    update({
      context: {
        headers: {
          "apollo-require-preflight": true,
        },
      },
      variables: {
        refetchQueries: [GET_ITEM_QUERY],
        input: {
          ...data,
          description: markup,
          ...(typeof logo !== "string" && { logo }),
          tax: data.tax ? parseFloat(data.tax) : null,
        },
      },
    });
  };

  const handleImgReset = () => {
    setAvatar("@src/assets/images/avatars/avatar-blank.png");
  };

  // ** render user img
  const renderUserImg = (type) => {
    if (data?.logo !== null) {
      return (
        <img
          height="110"
          width="110"
          alt="user-avatar"
          src={showImage(data?.logo)}
          className="img-fluid rounded mt-3 mb-2"
        />
      );
    } else {
      const stateNum = Math.floor(Math.random() * 6),
        states = [
          "light-success",
          "light-danger",
          "light-warning",
          "light-info",
          "light-primary",
          "light-secondary",
        ],
        color = states[stateNum];
      return (
        <Avatar
          initials
          color={color}
          className="rounded mt-3 mb-2"
          content="TG"
          contentStyles={{
            borderRadius: 0,
            fontSize: "calc(48px)",
            width: "100%",
            height: "100%",
          }}
          style={{
            height: "110px",
            width: "110px",
          }}
        />
      );
    }
  };

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">{t("Website details")}</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          <div className="d-flex">
            <div className="me-25">{renderUserImg("logo")}</div>
            <div className="d-flex align-items-end mt-75 ms-1">
              <div>
                <Label className="form-label" for="image">
                  {t("Logo")}
                </Label>
                <Controller
                  control={control}
                  name={"logo"}
                  render={({ field: { value, onChange, ...field } }) => {
                    return (
                      <Input
                        {...field}
                        value={value?.fileName}
                        onChange={(event) => {
                          onChange(event.target.files[0]);
                        }}
                        type="file"
                        id="logo"
                      />
                    );
                  }}
                />
                <p className="mb-0">
                  {t("Allowed JPG, GIF or PNG. Max size of 800kB")}
                </p>
              </div>
            </div>
          </div>
          <Form className="mt-2 pt-50" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="title">
                  {t("Title")}
                </Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="title"
                      placeholder={t("Title")}
                      invalid={errors.title && true}
                      {...field}
                    />
                  )}
                />
                {errors && errors.title && (
                  <FormFeedback>{errors.title.message}</FormFeedback>
                )}
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="companyName">
                  {t("Company name")}
                </Label>
                <Controller
                  name="companyName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="companyName"
                      placeholder={t("Company name")}
                      invalid={errors.title && true}
                      {...field}
                    />
                  )}
                />
                {errors && errors.companyName && (
                  <FormFeedback>{errors.companyName.message}</FormFeedback>
                )}
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="email">
                  {t("Email")}
                </Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      placeholder={t("Email")}
                      invalid={errors.email && true}
                      {...field}
                    />
                  )}
                />
                {errors && errors.email && (
                  <FormFeedback>{errors.email.message}</FormFeedback>
                )}
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="phoneNumber">
                  {t("Phone number")}
                </Label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      name="phoneNumber"
                      placeholder={t("Phone number")}
                      {...field}
                    />
                  )}
                />
                {errors && errors.phoneNumber && (
                  <FormFeedback>{errors.phoneNumber.message}</FormFeedback>
                )}
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="support">
                  {t("Support")}
                </Label>
                <Controller
                  name="support"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      name="support"
                      placeholder={t("Support")}
                      {...field}
                    />
                  )}
                />
                {errors && errors.support && (
                  <FormFeedback>{errors.support.message}</FormFeedback>
                )}
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="whatsapp">
                  {t("Whatsapp")}
                </Label>
                <Controller
                  name="whatsapp"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      name="whatsapp"
                      placeholder={t("Whatsapp")}
                      {...field}
                    />
                  )}
                />
                {errors && errors.phoneNumber && (
                  <FormFeedback>{errors.phoneNumber.message}</FormFeedback>
                )}
              </Col>

              <Col className="mt-2" sm="12">
                <Button type="submit" className="me-1" color="primary">
                  {t("Save changes")}
                </Button>
                <Button color="secondary" outline>
                  {t("Discard")}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default AccountTabs;
