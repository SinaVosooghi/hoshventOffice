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
import { t } from "i18next";
import { useQuery, useMutation } from "@apollo/client";
import {
  DELETE_IMAGE_MUTATION,
  GET_ITEMS_QUERY,
  GET_ITEM_QUERY,
  UPDATE_ITEM_MUTATION,
} from "../gql";
import classnames from "classnames";
import { useNavigate, useParams } from "react-router-dom";
import { convertHtmlToDraft, sleep } from "../../../../utility/Utils";
import moment from "jalali-moment";
import { DateTimePicker } from "react-advance-jalaali-datepicker";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import { hashConfig } from "../../../../utility/Utils";

import CardAction from "@components/card-actions";
import { fallbackHandler } from "../../contact/helpers";

const statusOptions = [
  { value: true, label: t("Active") },
  { value: false, label: t("Deactive") },
];
const options = { numeral: true, numeralThousandsGroupStyle: "thousand" };

const EditCard = () => {
  const SignupSchema = yup.object().shape({
    title: yup.string().required(`${t("Title")} ${t("field is required")}`),
  });

  const [description, setDescription] = useState(EditorState.createEmpty());

  const [data, setData] = useState(null);
  const [images, setImages] = useState(null);
  const history = useNavigate();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [preSelectedDate, setPreSelectedDate] = useState(null);
  const [preSelectedEndDate, setPreSelectedEndDate] = useState(null);

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    resetField,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });
  const { id } = useParams();

  useQuery(GET_ITEM_QUERY, {
    variables: { id: parseInt(id) },
    fetchPolicy: "network-only",
    onCompleted: async ({ service }) => {
      if (service) {
        setData(service);
        setDescription(convertHtmlToDraft(service.body));
        setImages(service.image);

        for (const [key, value] of Object.entries(service)) {
          setValue(key, value);
        }

        await sleep(100);

        setStartDate(service.start_date);
        if (service && service?.start_date) {
          setPreSelectedDate(
            momentJalali(service.start_date).format("jYYYY/jMM/jDD H:mm")
          );
        }

        setStartDate(service.end_date);
        if (service.end_date) {
          setPreSelectedEndDate(
            momentJalali(service.end_date).format("jYYYY/jMM/jDD H:mm")
          );
        }

        reset({
          ...service,
          status: service.status
            ? {
                label: t("Active"),
                value: service.status,
              }
            : {
                label: t("Deactive"),
                value: service.status,
              },
        });
      }
    },
  });

  const [update] = useMutation(UPDATE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
      history(`/apps/services`);
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const [deleteImage] = useMutation(DELETE_IMAGE_MUTATION, {
    refetchQueries: [GET_ITEM_QUERY],
    ...fallbackHandler("delete"),
  });

  const onSubmit = (data) => {
    setData(data);
    delete data.__typename;
    delete data.created;
    delete data.updated;
    const rawContentState = convertToRaw(description.getCurrentContent());
    const image = data.image;
    const markup = draftToHtml(rawContentState, hashConfig, true);

    const price =
      typeof data.price === "string"
        ? parseFloat(data.price?.replaceAll(",", ""))
        : data.price;

    delete data.image;

    const quantity =
      typeof data.quantity === "string"
        ? parseFloat(data.quantity?.replaceAll(",", ""))
        : data.quantity;

    const perperson =
      typeof data.perperson === "string"
        ? parseFloat(data.perperson?.replaceAll(",", ""))
        : data.perperson;

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
          body: markup,
          status: data.status?.value,
          price,
          quantity,
          perperson,
          ...(typeof image !== "string" && { image }),
          start_date: moment(startDate).toISOString(),
          end_date: moment(endDate).toISOString(),
        },
      },
    });
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col xl={9} md={9} sm={12}>
            <Fragment>
              <Fragment>
                <CardAction
                  title={`${t("Edit")} ${t("Service")}`}
                  actions="collapse"
                >
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
                    </Row>

                    <div className="divider divider-start">
                      <div className="divider-text">{t("Service details")}</div>
                    </div>

                    <Row className="mt-1 mb-1">
                      <Row className="mt-1 mb-1">
                        <Col md={3} xs={12} className="mb-1">
                          <Label className="form-label" for="body">
                            {t("Start date")}
                          </Label>
                          <DateTimePicker
                            placeholderStart="تاریخ شروع"
                            placeholderEnd="تاریخ پایان"
                            format="jYYYY/jMM/jDD H:mm"
                            className="form-control"
                            placeholder={preSelectedDate}
                            onChange={(unix) =>
                              setStartDate(moment.unix(unix).toDate())
                            }
                            containerClass="farsi-datepicker"
                          />
                        </Col>

                        <Col md={3} xs={12} className="mb-1">
                          <Label className="form-label" for="body">
                            {t("End date")}
                          </Label>
                          <DateTimePicker
                            placeholderStart="تاریخ پایان"
                            placeholderEnd="تاریخ پایان"
                            format="jYYYY/jMM/jDD H:mm"
                            className="form-control"
                            placeholder={preSelectedEndDate}
                            onChange={(unix) =>
                              setEndDate(moment.unix(unix).toDate())
                            }
                            containerClass="farsi-datepicker"
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
                        <Col md={2} xs={12} className="mb-1">
                          <Label className="form-label" for="quantity">
                            {t("Quantity")}
                          </Label>
                          <Controller
                            id="quantity"
                            name="quantity"
                            defaultValue=""
                            control={control}
                            render={({ field }) => (
                              <Cleave
                                className="form-control"
                                placeholder="10"
                                options={options}
                                id="numeral-formatting"
                                {...field}
                              />
                            )}
                          />
                        </Col>
                        <Col md={2} xs={12} className="mb-1">
                          <Label className="form-label" for="perperson">
                            {t("Per person")}
                          </Label>
                          <Controller
                            id="perperson"
                            name="perperson"
                            defaultValue=""
                            control={control}
                            render={({ field }) => (
                              <Cleave
                                className="form-control"
                                placeholder="10"
                                options={options}
                                id="numeral-formatting"
                                {...field}
                              />
                            )}
                          />
                        </Col>
                      </Row>

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
                              ? moment(data.created)
                                  .locale("fa")
                                  .format("YYYY/MM/D HH:mm")
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
                              ? moment(data.updated)
                                  .locale("fa")
                                  .format("YYYY/MM/D HH:mm")
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
                                deleteImage({
                                  variables: { id: parseInt(id) },
                                });
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
                    <Row>
                      <Col>
                        <Button color="success" type="submit" block>
                          {t("Update")}
                        </Button>
                      </Col>
                      <Col md={5}>
                        <Button
                          outline
                          block
                          onClick={() => history(`/apps/services`)}
                        >
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

export default EditCard;
