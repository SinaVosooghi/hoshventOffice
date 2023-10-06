// ** React Imports
import { Fragment, useState } from "react";

// ** Third Party Components
import Select from "react-select";
import Cleave from "cleave.js/react";
import { useForm, Controller } from "react-hook-form";
import "cleave.js/dist/addons/cleave-phone.us";
import classnames from "classnames";
// ** Editor
import { Editor } from "react-draft-wysiwyg";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../@core/scss/react/libs/editor/editor.scss";
import Avatar from "@components/avatar";
import { showImage } from "@utils";

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
import { selectThemeColors } from "@utils";

// ** Demo Components
import { t } from "i18next";
import SeoConfig from "./SeoConfig";
import axios from "axios";
import { GET_ITEMS_QUERY as GET_CATEGORY_ITEMS } from "../../category/gql";
import { useQuery } from "@apollo/client";
import { countryOptions, languageOptions, timeZoneOptions } from "../gql";
import { GET_ITEMS_QUERY as GET_PLANS_ITEMS } from "../../plans/gql";

const AccountTabs = ({
  control,
  errors,
  description,
  logo,
  setLogo,
  setDescription,
}) => {
  // ** States
  const [avatar, setAvatar] = useState("");
  const [plansItems, setPlansItems] = useState([]);

  const [categoriesOptions, setCategoriesOptions] = useState([
    { value: "", label: `${t("Select")} ${t("Category")}` },
  ]);

  const typeOptions = [
    { value: "internal", label: t("Internal") },
    { value: "external", label: t("External") },
  ];

  useQuery(GET_CATEGORY_ITEMS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 100,
        skip: 0,
        status: true,
        type: "site",
      },
    },
    onCompleted: ({ categories }) => {
      categories?.categories?.map((category) =>
        setCategoriesOptions((prev) => [
          ...prev,
          { value: category.id, label: category.title },
        ])
      );
    },
  });

  useQuery(GET_PLANS_ITEMS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 100,
        skip: 0,
        status: true,
      },
    },
    onCompleted: ({ plans }) => {
      plans?.plans?.map((plan) =>
        setPlansItems((prev) => [
          ...prev,
          {
            value: plan.id,
            label: plan.title,
          },
        ])
      );
    },
  });

  const onChange = (e) => {
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
        .then(({ data }) => setLogo(data[0].filename));
    }
  };

  const handleImgReset = () => {
    setLogo(null);
  };

  // ** render user img
  const renderUserImg = (type) => {
    if (logo !== null) {
      return (
        <img
          height="110"
          width="110"
          alt="user-avatar"
          src={showImage(logo)}
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
          <CardTitle tag="h4">{t("Site Information")}</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          <div className="d-flex">
            <div className="me-25">{renderUserImg("logo")}</div>
            <div className="d-flex align-items-center mt-75 ms-1">
              <div>
                <Label className="form-label" for="logo">
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
                <p className="mb-0 mt-2">
                  {t("Allowed JPG, GIF or PNG. Max size of 800kB")}
                </p>
              </div>
            </div>
          </div>
          <Row>
            <Col sm="4" className="mb-1">
              <Label className="form-label" for="title">
                {t("Title")}
                <span className="text-danger">*</span>
              </Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    id="title"
                    placeholder="digikala"
                    invalid={errors.firstName && true}
                    {...field}
                  />
                )}
              />
              {errors && errors.title && (
                <FormFeedback>
                  {t("Please enter a valid")} {t("Title")}
                </FormFeedback>
              )}
            </Col>

            <Col sm="4" className="mb-1">
              <Label className="form-label" for="email">
                {t("Email")}
              </Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="john@doe.com"
                    invalid={errors.email && true}
                    {...field}
                  />
                )}
              />
            </Col>
            <Col sm="3" className="mb-1">
              <Label className="form-label" for="company">
                {t("Company Name")}
              </Label>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <Input
                    id="company"
                    name="company"
                    placeholder={t("Company Name")}
                    invalid={errors.company && true}
                    {...field}
                  />
                )}
              />
            </Col>
            <Col sm="3" className="mb-1">
              <Label className="form-label" for="phonenumber">
                {t("Phone Number")}
              </Label>
              <Controller
                name="phonenumber"
                control={control}
                render={({ field }) => (
                  <Cleave
                    id="phonenumber"
                    name="phonenumber"
                    className="form-control"
                    placeholder="021 234 567 8900"
                    options={{ phone: true, phoneRegionCode: "IR" }}
                    {...field}
                  />
                )}
              />
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
                    id="address"
                    name="address"
                    placeholder="تهران، میدان ونک"
                    invalid={errors.address && true}
                    {...field}
                  />
                )}
              />
            </Col>
            <Col sm="2" className="mb-1">
              <Label className="form-label" for="city">
                {t("City")}
              </Label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Input
                    id="city"
                    name="city"
                    placeholder="تهران"
                    invalid={errors.city && true}
                    {...field}
                  />
                )}
              />
            </Col>
            <Col sm="2" className="mb-1">
              <Label className="form-label" for="zipcode">
                {t("Zip Code")}
              </Label>
              <Controller
                name="zipcode"
                control={control}
                render={({ field }) => (
                  <Input
                    id="zipcode"
                    name="zipcode"
                    placeholder="123456"
                    maxLength="10"
                    invalid={errors.zipcode && true}
                    {...field}
                  />
                )}
              />
            </Col>

            <Col md={12} xs={12}>
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
              <Button color="success" className="me-1" type="submit">
                {t("Update")}
              </Button>
              <Button color="secondary" outline>
                {t("Discard")}
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <SeoConfig control={control} errors={errors} />
    </Fragment>
  );
};

export default AccountTabs;
