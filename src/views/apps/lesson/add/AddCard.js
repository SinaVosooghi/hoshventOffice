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
import { CREATE_ITEM_MUTATION, GET_ITEMS_QUERY } from "../gql";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";
import { GET_ITEMS_QUERY as GET_COURSES_ITEMS } from "../../course/gql";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import { hashConfig } from "../../../../utility/Utils";
import { getUsersSelect } from "../../../../utility/gqlHelpers/getUsers";
import VideoOptions from "../Video";
import ConferenceOptions from "../Conference";
import moment from "moment";

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

const AddCard = () => {
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
  const [video, setVideo] = useState(null);
  const [items, setItems] = useState([]);
  const [type, setType] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);

  const history = useNavigate();
  const usersData = getUsersSelect("teacher");
  const [usersOptions, setUsersOptions] = useState(null);

  const [startDate, setStartDate] = useState(null);

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

  const [create] = useMutation(CREATE_ITEM_MUTATION, {
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
    const rawContentState = convertToRaw(description.getCurrentContent());

    const markup = draftToHtml(rawContentState, hashConfig, true);

    create({
      variables: {
        input: {
          ...data,
          image: images,
          status: data.status?.value,
          featured: data.featured?.value,
          course: data.course ? data.course?.value : null,
          body: markup,
          type,
          user: data.user ? data.user.value : null,
          public: data.public?.value,
          order: data.order ? parseFloat(data.order) : 0,
          conferenceoptions: {
            ...data?.conferenceoptions,
            startdate: moment(startDate).format("YYYY-MM-DDTHH:mm:ss[Z]"),
            weekly_days: selectedDates ? selectedDates.toString() : null,
          },
          videooptions: {
            ...data?.videooptions,
            video,
          },
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
              <CardAction title={t("Add new lesson")} actions="collapse">
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

                    <Col md={10} xs={12} className="mb-1">
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

                    <Col md={2} xs={12} className="mb-1">
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
                          {t("Save")}
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

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

export default AddCard;
