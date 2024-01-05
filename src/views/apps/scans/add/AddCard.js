// ** React Imports
import { Fragment, useState } from "react";

import Select from "react-select"; // eslint-disable-line
import Cleave from "cleave.js/react";

// ** Reactstrap Imports
import { selectThemeColors } from "@utils";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Label,
  Button,
  CardBody,
  FormFeedback,
} from "reactstrap";

// ** Third Party Components
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Styles
import "react-slidedown/lib/slidedown.css";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/base/pages/app-invoice.scss";
import { t } from "i18next";
import { useMutation } from "@apollo/client";
import { CREATE_ITEM_MUTATION, GET_ITEMS_QUERY } from "../gql";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import { hashConfig } from "../../../../utility/Utils";
import CardAction from "@components/card-actions";
import { ServicesMultiSelect } from "./ServicesMultiSelect";

const statusOptions = [
  { value: true, label: t("Active") },
  { value: false, label: t("Deactive") },
];
const options = { numeral: true, numeralThousandsGroupStyle: "thousand" };

const AddCard = () => {
  const SignupSchema = yup.object().shape({
    title: yup.string().required(`${t("Title")} ${t("field is required")}`),
    slug: yup.string().required(`${t("Slug")} ${t("field is required")}`),
  });

  const [data, setData] = useState(null);
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [servicesItems, setServicesItems] = useState([]);

  const history = useNavigate();

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });

  const [create] = useMutation(CREATE_ITEM_MUTATION, {
    context: {
      headers: {
        "apollo-require-preflight": true,
      },
    },
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
      history(`/apps/plans`);
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const onSubmit = (data) => {
    setData(data);
    const rawContentState = convertToRaw(description.getCurrentContent());

    const markup = draftToHtml(rawContentState, hashConfig, true);
    const serviceFiltered = servicesItems.map((m) => m.value);

    const price =
      typeof data.price === "string"
        ? parseFloat(data.price?.replaceAll(",", ""))
        : data.price;

    const sms =
      typeof data.sms === "string"
        ? parseFloat(data.sms?.replaceAll(",", ""))
        : data.sms;

    create({
      variables: {
        input: {
          ...data,
          image: data.image,
          body: markup,
          status: data.status?.value,
          price,
          services: serviceFiltered,
          sms,
        },
      },
    });
  };

  const handleReset = () => {
    reset({
      title: "",
      body: "",
      price: "",
      sms: "",
      image: "",
    });
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col xl={9} md={12} sm={12}>
            <Fragment>
              <CardAction title={t("Add new plan")} actions="collapse">
                <CardBody>
                  <Row>
                    <Col md={10} xs={12} className="mb-1">
                      <Label className="form-label" for="title">
                        {t("Title")} <span className="text-danger">*</span>
                      </Label>
                      <Controller
                        id="title"
                        name="title"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder={t("Title")}
                            invalid={errors.title && true}
                          />
                        )}
                      />
                      {errors.title && (
                        <FormFeedback>{errors.title.message}</FormFeedback>
                      )}
                    </Col>

                    <Col md={2} xs={12}>
                      <Label className="form-label" for="status">
                        {t("Status")}:
                      </Label>
                      <Controller
                        name="status"
                        control={control}
                        defaultValue={{ value: true, label: t("Active") }}
                        render={({ field }) => (
                          <Select
                            isClearable={false}
                            classNamePrefix="select"
                            options={statusOptions}
                            theme={selectThemeColors}
                            placeholder={t("Select...")}
                            className={classnames("react-select", {
                              "is-invalid":
                                data !== null && data.status === null,
                            })}
                            {...field}
                          />
                        )}
                      />
                    </Col>

                    <Col md={8} xs={12} className="mb-1">
                      <Label className="form-label" for="slug">
                        {t("Slug")} <span className="text-danger">*</span>
                      </Label>
                      <Controller
                        id="slug"
                        name="slug"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder={t("Slug")}
                            invalid={errors.slug && true}
                          />
                        )}
                      />
                      {errors.slug && (
                        <FormFeedback>{errors.slug.message}</FormFeedback>
                      )}
                    </Col>
                    <Col md={4} xs={12} className="mb-1">
                      <Label className="form-label" for="subtitle">
                        {t("Subtitle")}
                      </Label>
                      <Controller
                        id="subtitle"
                        name="subtitle"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder={t("Subtitle")}
                            invalid={errors.subtitle && true}
                          />
                        )}
                      />
                      {errors.subtitle && (
                        <FormFeedback>{errors.subtitle.message}</FormFeedback>
                      )}
                    </Col>
                    <Col md={12} xs={12}>
                      <Label className="form-label" for="services">
                        {t("Services")}
                      </Label>

                      <ServicesMultiSelect
                        items={servicesItems}
                        setItems={setServicesItems}
                      />
                    </Col>
                  </Row>

                  <div className="divider divider-start">
                    <div className="divider-text">{t("Service details")}</div>
                  </div>

                  <Row className="mt-1 mb-1">
                    <Col md={2} xs={12} className="mb-1">
                      <Label className="form-label" for="sms">
                        {t("SMS")} (تعداد)
                      </Label>
                      <Controller
                        id="sms"
                        name="sms"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Cleave
                            className="form-control"
                            placeholder="10,000"
                            options={options}
                            id="numeral-formatting"
                            {...field}
                          />
                        )}
                      />
                    </Col>

                    <Col md={2} xs={12} className="mb-1">
                      <Label className="form-label" for="price">
                        {t("Price")} (تومان)
                      </Label>
                      <Controller
                        id="price"
                        name="price"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Cleave
                            className="form-control"
                            placeholder="10,000"
                            options={options}
                            id="numeral-formatting"
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
                  </Row>
                </CardBody>
              </CardAction>
            </Fragment>
          </Col>
          <Col xl={3} md={4} sm={12}>
            <Row>
              <Col md={12} xs={12}>
                <Card className="invoice-action-wrapper">
                  <CardBody>
                    <Label className="form-label" for="image">
                      {t("Image")}
                    </Label>
                    <Controller
                      control={control}
                      name={"image"}
                      render={({ field: { value, onChange, ...field } }) => {
                        return (
                          <Input
                            {...field}
                            value={value?.fileName}
                            onChange={(event) => {
                              onChange(event.target.files[0]);
                            }}
                            type="file"
                            accept="image/png, image/gif, image/jpeg"
                            id="image"
                          />
                        );
                      }}
                    />
                  </CardBody>
                </Card>
              </Col>
              <Col md={12} xs={12}>
                <Card className="invoice-action-wrapper">
                  <CardBody>
                    <Row>
                      <Col>
                        <Button color="success" type="submit" block>
                          {t("Save")}
                        </Button>
                      </Col>
                      <Col md={5}>
                        <Button outline onClick={handleReset} block>
                          {t("Discard")}
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AddCard;
