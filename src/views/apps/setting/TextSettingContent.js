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

const TextSettingTab = ({ data }) => {
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
    delete data.logo;


    const rawContentState = convertToRaw(description.getCurrentContent());
    const markup = draftToHtml(rawContentState, hashConfig, true);

    update({
      variables: {
        refetchQueries: [GET_ITEM_QUERY],
        input: {
          ...data,
          description: markup,
        },
      },
    });
  };

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">{t("Text settings")}</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          <Form className="mt-2 pt-50" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="workinghours">
                  {t("Working Hours")}
                </Label>
                <Controller
                  name="workinghours"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="workinghours"
                      placeholder={t("Working Hours")}
                      invalid={errors.workinghours && true}
                      {...field}
                    />
                  )}
                />
                {errors && errors.workinghours && (
                  <FormFeedback>{errors.workinghours.message}</FormFeedback>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" for="address">
                  {t("Address")}
                </Label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      name="address"
                      placeholder={t("Address")}
                      {...field}
                    />
                  )}
                />
                {errors && errors.address && (
                  <FormFeedback>{errors.address.message}</FormFeedback>
                )}
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="keywords">
                  {t("Keywords")}
                </Label>
                <Controller
                  name="keywords"
                  control={control}
                  render={({ field }) => (
                    <Input
                      name="keywords"
                      placeholder={t("Keywords")}
                      {...field}
                    />
                  )}
                />
                {errors && errors.keywords && (
                  <FormFeedback>{errors.keywords.message}</FormFeedback>
                )}
              </Col>

              <Col md={12} xs={12}>
                <Label className="form-label" for="seodescription">
                  {t("Seo Description")}
                </Label>
                <div className="editor">
                  <Controller
                    id="seodescription"
                    name="seodescription"
                    defaultValue=""
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="textarea"
                        {...field}
                        placeholder={t("Seo Description")}
                        invalid={errors.seodescription && true}
                      />
                    )}
                  />
                </div>
              </Col>
              <Col md={12}>
                <Label className="form-label" for="body">
                  {t("Description")}
                </Label>
                <div className="editor">
                  <Editor
                    editorState={description}
                    onEditorStateChange={(data) => setDescription(data)}
                  />
                  {errors.body && (
                    <FormFeedback>{errors.body.message}</FormFeedback>
                  )}
                </div>
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

export default TextSettingTab;
