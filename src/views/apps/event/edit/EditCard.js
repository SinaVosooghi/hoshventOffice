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
  CardHeader,
  CardTitle,
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
import { GET_ITEMS_QUERY, GET_ITEM_QUERY, UPDATE_ITEM_MUTATION } from "../gql";
import { GET_ITEMS_QUERY as GET_SITES_ITEMS } from "../../site/gql";
import { GET_ITEMS_QUERY as GET_CATEGORIES_ITEMS } from "../../category/gql";

import classnames from "classnames";
import { Link, useNavigate, useParams } from "react-router-dom";
import { convertHtmlToDraft, sleep } from "../../../../utility/Utils";
import moment from "moment";
import momentJalali from "moment-jalaali";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import { hashConfig } from "../../../../utility/Utils";
import CardAction from "@components/card-actions";
import { DateTimePicker } from "react-advance-jalaali-datepicker";
import { File } from "react-feather";

const statusOptions = [
  { value: true, label: t("Active") },
  { value: false, label: t("Deactive") },
];
const options = { numeral: true, numeralThousandsGroupStyle: "thousand" };

const EditCard = () => {
  const SignupSchema = yup.object().shape({
    title: yup.string().required(`${t("Title")} ${t("field is required")}`),
    slug: yup.string().required(`${t("Slug")} ${t("field is required")}`),
    site: yup.object().required(`${t("Site")} ${t("field is required")}`),
    category: yup
      .object()
      .required(`${t("Category")} ${t("field is required")}`),
  });
  // ** State
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [seoDescription, setSeoDescription] = useState(
    EditorState.createEmpty()
  );

  const [data, setData] = useState(null);
  const [images, setImages] = useState(null);
  const [pdf, setPdf] = useState(null);

  const history = useNavigate();
  const [sitesOptions, setSitesOptions] = useState([]);
  const [categoriesOptions, setCategoriesOptions] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [preSelectedDate, setPreSelectedDate] = useState(null);
  const [preSelectedEndDate, setPreSelectedEndDate] = useState(null);

  useQuery(GET_CATEGORIES_ITEMS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
        type: "event",
        status: true,
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

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });
  const { id } = useParams();

  useQuery(GET_SITES_ITEMS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
      },
    },
    onCompleted: ({ sites }) => {
      sites?.sites?.map((site) =>
        setSitesOptions((prev) => [
          ...prev,
          { value: site.id, label: site.title },
        ])
      );
    },
  });

  useQuery(GET_ITEM_QUERY, {
    variables: { id: parseInt(id) },
    fetchPolicy: "network-only",
    onCompleted: async ({ event }) => {
      if (event) {
        setDescription(convertHtmlToDraft(event.body));
        setSeoDescription(convertHtmlToDraft(event.seobody));

        setData(event);
        for (const [key, value] of Object.entries(event)) {
          setValue(key, value);
        }
        await sleep(100);

        setImages(event.image);
        setPdf(event.pdf);

        setStartDate(event.start_date);
        if (event && event?.start_date) {
          setPreSelectedDate(
            momentJalali(event.start_date).format("jYYYY/jMM/jDD H:mm")
          );
        }

        setEndDate(event.end_date);
        if (event.end_date) {
          setPreSelectedEndDate(
            momentJalali(event.end_date).format("jYYYY/jMM/jDD H:mm")
          );
        }

        reset({
          ...event,
          status: event.status
            ? {
                label: t("Active"),
                value: event.status,
              }
            : {
                label: t("Deactive"),
                value: event.status,
              },
          featured: event.featured
            ? {
                label: t("Active"),
                value: event.featured,
              }
            : {
                label: t("Deactive"),
                value: event.status,
              },
          category: {
            label: event.category?.title,
            value: event.category?.id,
          },
          site: {
            label: event.site?.title,
            value: event.site?.id,
          },
        });
      }
    },
  });

  const [update] = useMutation(UPDATE_ITEM_MUTATION, {
    context: {
      headers: {
        "apollo-require-preflight": true,
      },
    },
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
      history(`/apps/events`);
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
    const image = data.image ?? images;

    const rawContentState = convertToRaw(description.getCurrentContent());
    const rawContentStateSeoBody = convertToRaw(
      seoDescription.getCurrentContent()
    );

    const markup = draftToHtml(rawContentState, hashConfig, true);
    const markupSeo = draftToHtml(rawContentStateSeoBody, hashConfig, true);

    delete data.image;

    const price =
      typeof data.price === "string"
        ? parseFloat(data.price?.replaceAll(",", ""))
        : data.price;

    update({
      variables: {
        refetchQueries: [GET_ITEM_QUERY],
        input: {
          ...data,
          ...(typeof image !== "string" && { image }),
          status: data.status?.value,
          featured: data.featured?.value,
          site: data.site ? data.site?.value : null,
          category: data.category ? data.category?.value : null,
          body: markup,
          seobody: markupSeo,
          start_date: moment(startDate).toISOString(),
          end_date: moment(endDate).toISOString(),
          capacity: parseInt(data.capacity),
          price,
        },
      },
    });
  };
  const handleReset = () => {
    reset({
      title: "",
      body: "",
    });
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col xl={9} md={8} sm={12}>
            <Fragment>
              <CardAction
                title={`${t("Edit")} ${t("Event")} ${data?.title ?? ""}`}
                actions="collapse"
              >
                <CardBody>
                  <Row>
                    <Col md={12} xs={12} className="mb-1">
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

                    <Col md={9} xs={12} className="mb-1">
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

                    <Col md={3}>
                      <Label className="form-label" for="site">
                        {t("Site")} <span className="text-danger">*</span>
                      </Label>
                      <Controller
                        name="site"
                        control={control}
                        render={({ field }) => (
                          <Select
                            isClearable={false}
                            classNamePrefix="select"
                            options={sitesOptions}
                            theme={selectThemeColors}
                            placeholder={t("Select...")}
                            className={classnames("react-select", {
                              "is-invalid": data !== null && data.site === null,
                            })}
                            {...field}
                          />
                        )}
                      />
                      {errors.site && (
                        <FormFeedback style={{ display: "block" }}>
                          {errors.site.message}
                        </FormFeedback>
                      )}
                    </Col>

                    <Col md={3} className="mb-1">
                      <Label className="form-label" for="category">
                        {t("Category")}
                      </Label>
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <Select
                            isClearable={false}
                            classNamePrefix="select"
                            options={categoriesOptions}
                            theme={selectThemeColors}
                            placeholder={t("Select...")}
                            className={classnames("react-select", {
                              "is-invalid":
                                data !== null && data.category === null,
                            })}
                            {...field}
                          />
                        )}
                      />
                      {errors.category && (
                        <FormFeedback style={{ display: "block" }}>
                          {errors.category.message}
                        </FormFeedback>
                      )}
                    </Col>

                    <Col md={2} xs={6} className="mb-1">
                      <Label className="form-label" for="duration">
                        {t("Duration")}
                      </Label>
                      <Controller
                        id="duration"
                        name="duration"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Input {...field} placeholder={t("Duration")} />
                        )}
                      />
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

                    <Col md={3} xs={12} className="mb-1">
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
                    <Col md={4} xs={6}>
                      <Label className="form-label" for="capacity">
                        {t("Capacity")}
                      </Label>
                      <Controller
                        id="capacity"
                        name="capacity"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Input type="number" {...field} placeholder={100} />
                        )}
                      />
                    </Col>

                    <Col md={4} xs={12} className="mb-1">
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

                    <Col md={4} xs={12} className="mb-1">
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
                  </Row>

                  <Col md={12} xs={12} className="mb-50">
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
                </CardBody>
              </CardAction>
              <CardAction
                title={`${t("Edit")} ${t("Blog")} ${data?.title ?? ""}`}
                actions="collapse"
              >
                <CardBody>
                  <Row>
                    <Col md={12} xs={12} className="mb-1">
                      <Label className="form-label" for="seotitle">
                        {t("Seo Title")}
                      </Label>
                      <Controller
                        id="seotitle"
                        name="seotitle"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder={t("Seo Title")}
                            invalid={errors.seotitle && true}
                          />
                        )}
                      />
                      {errors.seotitle && (
                        <FormFeedback>{errors.seotitle.message}</FormFeedback>
                      )}
                    </Col>
                  </Row>

                  <Col md={12} xs={12}>
                    <Label className="form-label" for="seobody">
                      {t("Seo Description")}
                    </Label>
                    <div className="editor">
                      <Editor
                        editorState={seoDescription}
                        onEditorStateChange={(data) => setSeoDescription(data)}
                      />
                    </div>
                  </Col>
                </CardBody>
              </CardAction>
            </Fragment>
          </Col>

          <Col xl={3} md={4} sm={12}>
            <Row>
              {images && (
                <Col md={12} xs={12}>
                  <Card>
                    <CardHeader>
                      <CardTitle
                        tag="h4"
                        className="d-flex justify-content-between"
                        style={{ width: "100%" }}
                      >
                        <Col md={10}>{t("Image")}</Col>
                        <Col md={2}>
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
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <img
                        width="100%"
                        src={`${import.meta.env.VITE_BASE_API}/${images}`}
                      />
                      <br />
                    </CardBody>
                  </Card>
                </Col>
              )}
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

              {pdf && (
                <Col md={12} xs={12}>
                  <Card>
                    <CardHeader>
                      <CardTitle
                        tag="h4"
                        className="d-flex justify-content-between"
                        style={{ width: "100%" }}
                      >
                        <Col md={10}>{t("PDF")}</Col>
                        <Col md={2}>
                          <Button
                            color="danger"
                            outline
                            size="sm"
                            onClick={() => {
                              setPdf(null);
                            }}
                          >
                            {t("Remove")}
                          </Button>
                        </Col>
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <a
                        href={`${
                          import.meta.env.VITE_BASE_API
                        }/documents/${pdf}`}
                        download
                      >
                        <Button block outline size="sm" type="button">
                          <File size={14} />
                          {t("PDF File")}
                        </Button>
                      </a>

                      <br />
                    </CardBody>
                  </Card>
                </Col>
              )}
              <Col md={12} xs={12}>
                <Card className="invoice-action-wrapper">
                  <CardBody>
                    <Label className="form-label" for="pdf">
                      {t("PDF")}
                    </Label>
                    <Controller
                      control={control}
                      name={"pdf"}
                      render={({ field: { value, onChange, ...field } }) => {
                        return (
                          <Input
                            {...field}
                            value={value?.fileName}
                            onChange={(event) => {
                              onChange(event.target.files[0]);
                            }}
                            accept="application/pdf,application"
                            type="file"
                            id="pdf"
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
                              ? moment(data?.created).format("H:mm  Y/MM/DD ")
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
                              ? moment(data?.updated).format("H:mm  Y/MM/DD ")
                              : "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
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
                            <Button outline onClick={handleReset} block>
                              {t("Discard")}
                            </Button>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
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
