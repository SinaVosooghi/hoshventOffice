// ** React Imports
import { Fragment, useEffect, useState } from "react";

import Select from "react-select";

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
import CardAction from "@components/card-actions";

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

// ** Add item components
import { t } from "i18next";
import { useQuery, useMutation } from "@apollo/client";
import FileUploaderSingle from "../../../forms/form-elements/file-uploader/FileUploaderSingle";
import { GET_ITEMS_QUERY, GET_ITEM_QUERY, UPDATE_ITEM_MUTATION } from "../gql";
import classnames from "classnames";
import { useNavigate, useParams } from "react-router-dom";
import { GET_ITEMS_QUERY as GET_COURSES_ITEMS } from "../../course/gql";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import { convertHtmlToDraft, hashConfig } from "../../../../utility/Utils";
import { getUsersSelect } from "../../../../utility/gqlHelpers/getUsers";
import VideoOptions from "../Video";
import ConferenceOptions from "../Conference";
import moment from "jalali-moment";

export const statusOptions = [
  { value: true, label: t("Active") },
  { value: false, label: t("Deactive") },
];

const typeOptions = [
  { value: null, label: `${t("Select")} ${t("Type")}...` },
  { value: "text", label: t("Text") },
  { value: "video", label: t("Video") },
  { value: "conference", label: `${t("Conference")} (Zoom)` },
];

const EditCard = () => {
  const { id } = useParams();

  const SignupSchema = yup.object().shape({
    title: yup.string().required(`${t("Title")} ${t("field is required")}`),
    slug: yup.string().required(`${t("Slug")} ${t("field is required")}`),
    excerpt: yup.string().required(`${t("Excerpt")} ${t("field is required")}`),
    user: yup.object().required(`${t("User")} ${t("field is required")}`),
  });

  // ** State
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [seoDescription, setSeoDescription] = useState(
    EditorState.createEmpty()
  );

  const [data, setData] = useState(null);
  const [images, setImages] = useState(null);
  const [items, setItems] = useState([]);
  const [type, setType] = useState(null);
  const [video, setVideo] = useState(null);

  const history = useNavigate();
  const usersData = getUsersSelect("teacher");
  const [usersOptions, setUsersOptions] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);

  const [coursesOptions, setCoursesOptions] = useState([
    { value: "", label: `${t("Select")} ${t("Category")}` },
  ]);

  useEffect(() => {
    if (usersData.length) {
      setUsersOptions(usersData);
    }
  }, [usersData]);

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });

  useQuery(GET_COURSES_ITEMS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
      },
    },
    onCompleted: ({ courses }) => {
      courses?.courses?.map((course) =>
        setCoursesOptions((prev) => [
          ...prev,
          { value: course.id, label: course.title },
        ])
      );
    },
  });

  const [update] = useMutation(UPDATE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
      history(`/apps/lessons`);
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
    const markup = draftToHtml(rawContentState, hashConfig, true);

    const variables = {
      ...data,
      image: images,
      status: data.status?.value,
      featured: data.featured?.value,
      course: data.course ? data.course?.value : null,
      body: markup,
      type,
      user: data.user ? data.user.value : null,
      public: data.public?.value,
      order: parseFloat(data.order),
    };

    if (type === "conference") {
      delete variables.videooptions;

      variables.conferenceoptions = {
        ...data?.conferenceoptions,
        startdate: startDate ?? data.conferenceoptions.startdate,
        host:
          typeof data.conferenceoptions.host === "boolean"
            ? data.conferenceoptions.host
            : data.conferenceoptions.host.value,
        joinanytime:
          typeof data.conferenceoptions.joinanytime === "boolean"
            ? data.conferenceoptions.joinanytime
            : data.conferenceoptions.joinanytime.value,
        requireauth:
          typeof data.conferenceoptions.requireauth === "boolean"
            ? data.conferenceoptions.requireauth
            : data.conferenceoptions.requireauth.value,
      };
    }

    if (type === "video") {
      delete variables.conferenceoptions;
      variables.videooptions = {
        type: data.videooptions.type ? data.videooptions.type.value : null,
        link: data.videooptions.link ?? null,
        video: video ?? null,
        width: parseFloat(data.videooptions.width) ?? null,
      };
    }

    update({
      variables: {
        input: variables,
      },
    });
  };

  useQuery(GET_ITEM_QUERY, {
    variables: { id: parseInt(id) },
    fetchPolicy: "network-only",
    onCompleted: async ({ lesson }) => {
      if (lesson) {
        if (lesson.body) setDescription(convertHtmlToDraft(lesson.body));
        setData(lesson);
        for (const [key, value] of Object.entries(lesson)) {
          setValue(key, value);
        }

        setImages(lesson.image);
        setType(lesson.type);
        const rstObj = {
          ...lesson,
          status: lesson.status
            ? {
                label: t("Active"),
                value: lesson.status,
              }
            : {
                label: t("Deactive"),
                value: lesson.status,
              },
          public: lesson.public
            ? {
                label: t("Active"),
                value: lesson.public,
              }
            : {
                label: t("Deactive"),
                value: lesson.public,
              },
          featured: lesson.featured
            ? {
                label: t("Active"),
                value: lesson.featured,
              }
            : {
                label: t("Deactive"),
                value: lesson.featured,
              },
          course: {
            label: lesson.course?.title,
            value: lesson.course?.id,
          },
          type: {
            label: typeOptions.filter((t) => t.value === lesson.type)[0].label,
            value: lesson.type,
          },
          user: {
            label: lesson.user
              ? lesson.user.firstName + " " + lesson.user.lastName
              : null,
            value: lesson.user?.id,
          },
        };

        if (lesson.type === "video") {
          setVideo(lesson.videooptions?.video);
          rstObj.videooptions = {
            type: {
              label: lesson.videooptions?.type,
              value: lesson.videooptions?.type,
            },
            link: lesson.videooptions?.link,
            width: lesson.videooptions?.width,
          };
          delete rstObj.conferenceoptions;
        }

        if (lesson.type === "conference") {
          delete rstObj.videooptions;
          setStartDate(lesson.conferenceoptions?.startdate);
          setSelectedDates(lesson.conferenceoptions?.weekly_days.split(","));

          rstObj.conferenceoptions = {
            joinanytime: {
              label: t("Active"),
              value: lesson.conferenceoptions?.joinanytime,
            },
            host: lesson.conferenceoptions?.host
              ? {
                  label: t("Active"),
                  value: lesson.conferenceoptions?.host,
                }
              : {
                  label: t("Deactive"),
                  value: lesson.conferenceoptions?.host,
                },
            requireauth: lesson.conferenceoptions?.requireauth
              ? {
                  label: t("Active"),
                  value: lesson.conferenceoptions?.requireauth,
                }
              : {
                  label: t("Deactive"),
                  value: lesson.conferenceoptions?.requireauth,
                },
            startdate: moment(lesson.conferenceoptions?.startdate).format(
              "YYYY/MM/DD hh:mm"
            ),
            enddate: lesson.conferenceoptions?.enddate,
            schedule_for: lesson.conferenceoptions?.schedule_for,
            joinlink: lesson.conferenceoptions?.joinlink,
            password: lesson.conferenceoptions?.password,
            repeat_interval: lesson.conferenceoptions?.repeat_interval,
          };
        }

        reset(rstObj);
      }
    },
  });

  const handleReset = () => {
    window.history.back();
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col xl={9} md={8} sm={12}>
            <Fragment>
              <CardAction title={t("Update lesson")} actions="collapse">
                <CardBody>
                  <Row>
                    <Col md={11} xs={12} className="mb-1">
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

                    <Col md={1} xs={12} className="mb-1">
                      <Label className="form-label" for="order">
                        {t("Order")}
                      </Label>
                      <Controller
                        id="order"
                        name="order"
                        defaultValue={0}
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            placeholder={t("Order")}
                          />
                        )}
                      />
                    </Col>

                    <Col md={12} xs={12} className="mb-1">
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

                    <Col md={12} xs={12}>
                      <Label className="form-label" for="excerpt">
                        {t("Excerpt")} <span className="text-danger">*</span>
                      </Label>
                      <Controller
                        id="excerpt"
                        name="excerpt"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="textarea"
                            placeholder={t("Excerpt")}
                            invalid={errors.excerpt && true}
                            rows={5}
                            {...field}
                          />
                        )}
                      />
                      {errors.excerpt && (
                        <FormFeedback>{errors.excerpt.message}</FormFeedback>
                      )}
                    </Col>

                    <Col md={12} xs={12} className="mt-1">
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

                    <div className="divider divider-start">
                      <div className="divider-text">{t("Lesson details")}</div>
                    </div>

                    <Col md={3} xs={12}>
                      <Label className="form-label" for="type">
                        {t("Type")}:
                      </Label>

                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <Select
                            classNamePrefix="select"
                            options={typeOptions}
                            theme={selectThemeColors}
                            placeholder={t("Select...")}
                            className={classnames("react-select")}
                            {...field}
                            onChange={(v) => setType(v.value)}
                          />
                        )}
                      />
                    </Col>

                    <Col md={3}>
                      <Label className="form-label" for="user">
                        {t("User")} <span className="text-danger">*</span>
                      </Label>
                      <Controller
                        name="user"
                        control={control}
                        render={({ field }) => (
                          <Select
                            isClearable={false}
                            classNamePrefix="select"
                            options={usersOptions}
                            theme={selectThemeColors}
                            placeholder={`${t("Select")} ${t("User")}...`}
                            className={classnames("react-select", {
                              "is-invalid": data !== null && data.user === null,
                            })}
                            {...field}
                          />
                        )}
                      />
                      {errors.user && (
                        <FormFeedback style={{ display: "block" }}>
                          {errors.user.message}
                        </FormFeedback>
                      )}
                    </Col>

                    <Col md={3} xs={6} className="mb-1">
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

                    {type === "video" && (
                      <VideoOptions
                        control={control}
                        errors={errors}
                        video={video}
                        setVideo={setVideo}
                      />
                    )}

                    {type === "conference" && (
                      <ConferenceOptions
                        control={control}
                        errors={errors}
                        setStartDate={setStartDate}
                        startDate={setStartDate}
                        starttime={startDate}
                        selectedDates={selectedDates}
                        setSelectedDates={setSelectedDates}
                      />
                    )}
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
                  </Row>

                  <Col md={12} xs={12}>
                    <Label className="form-label" for="seobody">
                      {t("Seo Description")}
                    </Label>
                    <div className="editor">
                      <Controller
                        id="seobody"
                        name="seobody"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="textarea"
                            {...field}
                            placeholder={t("Seo Description")}
                            invalid={errors.seobody && true}
                          />
                        )}
                      />
                    </div>
                  </Col>
                </CardBody>
              </CardAction>
            </Fragment>
          </Col>
          <Col xl={3} md={4} sm={12}>
            <Row>
              <Col md={12} xs={12}>
                <Card className="invoice-action-wrapper">
                  <CardHeader>{t("Visibility options")}</CardHeader>
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
                              ? moment(data?.created).locale("fa").format("H:mm  Y/MM/DD ")
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
                              ? moment(data?.updated).locale("fa").format("H:mm  Y/MM/DD ")
                              : "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Row>
                      <Col md={12} xs={12}>
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
                      <Col md={12} xs={12} className="mt-50">
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

                      <Col md={12} xs={12} className="mt-50">
                        <Label className="form-label" for="public">
                          {t("Public to everyone")}:
                        </Label>
                        <Controller
                          name="public"
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
                      <Col md={12}>
                        <Button
                          block
                          outline
                          onClick={handleReset}
                          className="mt-2"
                        >
                          {t("Discard")}
                        </Button>
                      </Col>
                      <Col md={12}>
                        <Button
                          color="success"
                          block
                          className="mt-50"
                          type="submit"
                        >
                          {t("Update")}
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              {images && (
                <Col md={12} xs={12}>
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">{t("Image")} </CardTitle>
                    </CardHeader>
                    <CardBody>
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
                    </CardBody>
                  </Card>
                </Col>
              )}

              <Col md={12} xs={12}>
                <FileUploaderSingle
                  title={t("Upload image")}
                  setImages={setImages}
                  isMultiple={false}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default EditCard;
