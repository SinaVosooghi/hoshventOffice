// ** React Imports
import { Fragment, useState } from "react";

import Select from "react-select";
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
import { t, use } from "i18next";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ITEMS_QUERY,
  GET_ITEM_QUERY,
  UPDATE_ITEM_MUTATION,
  WORKSHOP_STATES,
} from "../gql";
import classnames from "classnames";
import { useNavigate, useParams } from "react-router-dom";
import { convertHtmlToDraft, sleep } from "../../../../utility/Utils";
import moment from "jalali-moment";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import { hashConfig } from "../../../../utility/Utils";

import CardAction from "@components/card-actions";

const statusOptions = [
  { value: true, label: t("Active") },
  { value: false, label: t("Deactive") },
];

const EditCard = () => {
  const SignupSchema = yup.object().shape({
    title: yup.string().required(`${t("Title")} ${t("field is required")}`),
  });

  const [description, setDescription] = useState(EditorState.createEmpty());

  const [data, setData] = useState(null);
  const [images, setImages] = useState(null);
  const history = useNavigate();

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });
  const { id } = useParams();

  useQuery(GET_ITEM_QUERY, {
    variables: { id: parseInt(id) },
    fetchPolicy: "network-only",
    onCompleted: async ({ hall }) => {
      if (hall) {
        setData(hall);
        setDescription(convertHtmlToDraft(hall.body));
        setImages(hall.image);

        for (const [key, value] of Object.entries(hall)) {
          setValue(key, value);
        }

        await sleep(100);

        reset({
          ...hall,
          status: hall.status
            ? {
                label: t("Active"),
                value: hall.status,
              }
            : {
                label: t("Deactive"),
                value: hall.status,
              },
          featured: hall.featured
            ? {
                label: t("Active"),
                value: hall.featured,
              }
            : {
                label: t("Deactive"),
                value: hall.featured,
              },
        });
      }
    },
  });

  const [update] = useMutation(UPDATE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
      history(`/apps/halls`);
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const onSubmit = (data) => {
    setData(data);
    delete data.__typename;
    delete data.created;
    delete data.updated;
    const rawContentState = convertToRaw(description.getCurrentContent());

    const image = data.image;

    const markup = draftToHtml(rawContentState, hashConfig, true);

    delete data.image;

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
          ...(typeof image !== "string" && { image }),
          body: markup,
          status: data.status?.value,
          featured: data.featured?.value,
        },
      },
    });
  };
  const handleReset = () => {
    window.history.back();
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col xl={9} md={9} sm={12}>
            <Fragment>
              <Fragment>
                <CardAction
                  title={`${t("Edit")} ${t("Hall")}`}
                  actions="collapse"
                >
                  <CardBody>
                    <Row>
                      <Col md={8} xs={12} className="mb-1">
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
                      <Col md={2} xs={12}>
                        <Label className="form-label" for="featured">
                          {t("Featured")}:
                        </Label>
                        <Controller
                          name="featured"
                          control={control}
                          defaultValue={{ value: false, label: t("Deactive") }}
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
                    </Row>

                    <div className="divider divider-start">
                      <div className="divider-text">{t("Hall details")}</div>
                    </div>

                    <Row className="mt-1 mb-1">
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
                    <div>
                      <div className="invoice-payment-option">
                        <p className="mb-50">{t("Information")}</p>
                      </div>
                      <div className="invoice-terms mt-1">
                        <div className="d-flex justify-content-between">
                          <label
                            className="cursor-pointer mb-0"
                            htmlFor="payment-terms"
                          >
                            {t("Created")}:
                          </label>
                          <div className="form-switch">
                            {data?.created
                              ? moment(data?.created).locale("fa").format("YYYY/MM/D HH:mm")
                              : "-"}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between py-1">
                          <label
                            className="cursor-pointer mb-0"
                            htmlFor="payment-terms"
                          >
                            {t("Updated")}:
                          </label>
                          <div className="form-switch">
                            {data?.updated
                              ? moment(data?.updated).locale("fa").format("YYYY/MM/D HH:mm")
                              : "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                    {images && (
                      <Row>
                        <Row>
                          <Col md={12} className="mb-50">
                            <img
                              width="100%"
                              src={`${import.meta.env.VITE_BASE_API}/${images}`}
                            />
                            <br />
                          </Col>
                          <Col>
                            <Button
                              color="danger"
                              outline
                              size="sm"
                              onClick={() => {
                                setImages(null);
                              }}
                            >
                              {t("Remove")}
                            </Button>
                          </Col>
                        </Row>
                      </Row>
                    )}
                  </CardBody>
                </Card>
              </Col>
              <Col md={12} xs={12}>
                <Card className="invoice-action-wrapper">
                  <CardBody>
                    <Button outline onClick={handleReset}>
                      {t("Discard")}
                    </Button>
                    <Button color="success" className="mx-50" type="submit">
                      {t("Update")}
                    </Button>
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

export default EditCard;
