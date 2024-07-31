// ** Styles
import "react-slidedown/lib/slidedown.css";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/base/pages/app-invoice.scss";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../@core/scss/react/libs/editor/editor.scss";

// ** Third Party Components
import * as yup from "yup";

import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";
import { Controller, useForm } from "react-hook-form";
// ** Editor
import { EditorState, convertToRaw } from "draft-js";
// ** React Imports
import { Fragment, useEffect, useRef, useState } from "react";
import {
  GET_ITEMS_QUERY,
  GET_ITEM_QUERY,
  UPDATE_ITEM_MUTATION,
  WORKSHOP_STATES,
} from "../gql";
import { convertHtmlToDraft, sleep } from "../../../../utility/Utils";
import { t, use } from "i18next";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

import Attendees from "../../../extensions/import-export/Attendees";
import CardAction from "@components/card-actions";
import Cleave from "cleave.js/react";
import { DateTimePicker } from "react-advance-jalaali-datepicker";
import { Editor } from "react-draft-wysiwyg";
import { GET_ATTENDEES_ITEMS } from "../../../extensions/import-export/gql";
import { GET_ITEMS_QUERY as GET_HALLS_ITEMS } from "../../halls/gql";
import PrintableCertificate from "../../workshops/PrintableCertificate";
import { Printer } from "react-feather";
import ReactToPrint from "react-to-print";
import ScansList from "../../scans/list";
import Select from "react-select";
import { ServicesSelect } from "../../workshops/add/ServiceSelect";
import { UserSelect } from "../add/UsersSelects";
import classnames from "classnames";
import draftToHtml from "draftjs-to-html";
import { hashConfig } from "../../../../utility/Utils";
import moment from "jalali-moment";
import momentJalali from "moment-jalaali";
// ** Reactstrap Imports
import { selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";

const statusOptions = [
  { value: true, label: t("Active") },
  { value: false, label: t("Deactive") },
];
const options = { numeral: true, numeralThousandsGroupStyle: "thousand" };

const EditCard = () => {
  const SignupSchema = yup.object().shape({
    title: yup.string().required(`${t("Title")} ${t("field is required")}`),
    slug: yup.string().required(`${t("Slug")} ${t("field is required")}`),
  });

  const [lecturers, setLecturers] = useState([]);
  const [services, setServices] = useState([]);
  const componentRef = useRef();

  const [description, setDescription] = useState(EditorState.createEmpty());
  const [getItems, { data: attendees }] = useLazyQuery(GET_ATTENDEES_ITEMS);

  const [seoDescription, setSeoDescription] = useState(
    EditorState.createEmpty()
  );
  const [data, setData] = useState(null);
  const [images, setImages] = useState(null);
  const history = useNavigate();
  const [hallsItems, setHallsItems] = useState([]);

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
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });
  const { type, id } = useParams();

  useQuery(GET_HALLS_ITEMS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
        status: true,
      },
    },
    onCompleted: ({ halls }) => {
      halls?.halls?.map((hall) =>
        setHallsItems((prev) => [
          ...prev,
          { value: hall.id, label: hall.title },
        ])
      );
    },
  });

  const renderStateTitle = (state) => {
    switch (state) {
      case "ended":
        return t("Ended");
      case "running":
        return t("Running");
      case "not_started":
        return t("Not started");
      case "canceled":
        return t("Canceled");
    }
  };

  useQuery(GET_ITEM_QUERY, {
    variables: { id: parseInt(id) },
    fetchPolicy: "network-only",
    onCompleted: async ({ seminar }) => {
      if (seminar) {
        setData(seminar);
        setDescription(convertHtmlToDraft(seminar.body));
        setImages(seminar.image);

        for (const [key, value] of Object.entries(seminar)) {
          setValue(key, value);
        }

        setStartDate(seminar.start_date);
        if (seminar.start_date) {
          setPreSelectedDate(
            momentJalali(seminar.start_date).format("jYYYY/jMM/jDD H:mm")
          );
        }

        setEndDate(seminar.end_date);
        if (seminar.end_date) {
          setPreSelectedEndDate(
            momentJalali(seminar.end_date).format("jYYYY/jMM/jDD H:mm")
          );
        }

        await sleep(100);

        if (seminar.lecturers.length) {
          seminar.lecturers.map((lecturer) => {
            setLecturers((oldArray) => [
              ...oldArray,
              {
                value: lecturer.id,
                label: lecturer.firstName + " " + lecturer?.lastName ?? "",
                avatar: lecturer.avatar,
              },
            ]);
          });
        }

        if (seminar.services?.length) {
          seminar.services.map((service) => {
            setServices((oldArray) => [
              ...oldArray,
              {
                value: service.id,
                label: service.title,
                avatar: `${import.meta.env.VITE_BASE_API}/${service.image}`,
              },
            ]);
          });
        }

        reset({
          ...seminar,
          hall: {
            label: seminar.hall?.title,
            value: seminar.hall?.id,
          },
          status: seminar.status
            ? {
                label: t("Active"),
                value: seminar.status,
              }
            : {
                label: t("Deactive"),
                value: seminar.status,
              },
          featured: seminar.featured
            ? {
                label: t("Active"),
                value: seminar.featured,
              }
            : {
                label: t("Deactive"),
                value: seminar.featured,
              },
          state: {
            label: renderStateTitle(seminar.state),
            value: seminar.state,
          },
        });
      }
    },
  });

  useEffect(() => {
    if (data) {
      getItems({
        variables: {
          input: {
            skip: 0,
            siteid: parseInt(data?.hall?.site?.id),
            s: parseInt(data.id),
          },
        },
      });
    }
  }, [data]);

  const [update] = useMutation(UPDATE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
      history(`/apps/seminars`);
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
    const rawContentStateSeoBody = convertToRaw(
      seoDescription.getCurrentContent()
    );
    const image = data.image;

    const markup = draftToHtml(rawContentState, hashConfig, true);
    const markupSeo = draftToHtml(rawContentStateSeoBody, hashConfig, true);

    const price =
      typeof data.price === "string"
        ? parseFloat(data.price?.replaceAll(",", ""))
        : data.price;

    const lecturersItems = lecturers.map((m) => m.value);
    const servicesItems = services.map((m) => m.value);

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
          ...(images === null && typeof image === "string" && { image: null }),
          body: markup,
          seobody: markupSeo,
          status: data.status?.value,
          featured: data.featured?.value,
          capacity: parseInt(data.capacity),
          price,
          hall: typeof data.hall === "object" ? data.hall?.value : null,
          state: typeof data.state === "object" ? data.state?.value : null,
          lecturers: lecturersItems,
          services: servicesItems,
          start_date: moment(startDate).toISOString(),
          end_date: moment(endDate).toISOString(),
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
                  title={`${t("Edit")} ${t("Seminar")}`}
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

                      <Col md={4}>
                        <Label className="form-label" for="hall">
                          {t("Hall")} <span className="text-danger">*</span>
                        </Label>
                        <Controller
                          name="hall"
                          control={control}
                          render={({ field }) => (
                            <Select
                              isClearable={false}
                              classNamePrefix="select"
                              options={hallsItems}
                              theme={selectThemeColors}
                              placeholder={t("Select...")}
                              className={classnames("react-select", {
                                "is-invalid":
                                  data !== null && data.hall === null,
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
                      <div className="divider-text">{t("Seminar details")}</div>
                    </div>

                    <Row className="mt-1 mb-1">
                      <Col md={6} xs={12}>
                        <Label className="form-label" for="lecturers">
                          {t("Lecturers")}
                        </Label>

                        <UserSelect
                          usertype={"lecturer"}
                          users={lecturers}
                          setUsers={setLecturers}
                        />
                      </Col>
                      <Col md={6} xs={12}>
                        <Label className="form-label" for="services">
                          {t("Services")}
                        </Label>

                        <ServicesSelect
                          services={services}
                          setServices={setServices}
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

                      <Col md={2} xs={6}>
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

                      <Col md={2} xs={12}>
                        <Label className="form-label" for="state">
                          {t("Seminar state")}:
                        </Label>
                        <Controller
                          name="state"
                          control={control}
                          defaultValue={{ value: false, label: t("Deactive") }}
                          render={({ field }) => (
                            <Select
                              isClearable={false}
                              classNamePrefix="select"
                              options={WORKSHOP_STATES}
                              theme={selectThemeColors}
                              placeholder={t("Select...")}
                              className={classnames("react-select", {
                                "is-invalid":
                                  data !== null && data.state === null,
                              })}
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
                <CardAction title={t("SEO configuration")} actions="collapse">
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
                      <Col md={12} xs={12}>
                        <Label className="form-label" for="seobody">
                          {t("Seo Description")}
                        </Label>
                        <div className="editor">
                          <Editor
                            editorState={seoDescription}
                            onEditorStateChange={(data) =>
                              setSeoDescription(data)
                            }
                          />
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
                              ? moment(data?.created)
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
                              ? moment(data?.updated)
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
                <Col md={12} xs={12}>
                  <Card>
                    <CardBody>
                      <Row>
                        <Col md={12} className="mb-2">
                          <ReactToPrint
                            trigger={() => (
                              <Button color="success" outline block>
                                <Printer className="mx-1" />
                                {t("Print Certificate")}
                              </Button>
                            )}
                            content={() => componentRef.current}
                          />
                        </Col>
                        <Col>
                          <Button color="success" type="submit" block>
                            {t("Update")}
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            color="danger"
                            outline
                            onClick={() => {
                              history(`/apps/seminars`);
                            }}
                            block
                          >
                            {t("Discard")}
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
      <Attendees seminar={data} type="seminar" />

      <ScansList seminar={id} />

      <div style={{ display: "none" }}>
        <div
          ref={componentRef}
          style={{
            backgroundClip: "white",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {attendees?.attendees?.attends?.map((user) => {
            const itemUser = { user: user };
            return (
              <PrintableCertificate
                itemUser={itemUser?.user}
                event={data?.title}
                type="seminar"
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default EditCard;
