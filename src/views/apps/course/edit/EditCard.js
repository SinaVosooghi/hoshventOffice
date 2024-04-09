// ** React Imports
import { Fragment, useEffect, useState } from "react";

import Select from "react-select";
import CardAction from "@components/card-actions";
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
import FileUploaderSingle from "../../../forms/form-elements/file-uploader/FileUploaderSingle";
import { GET_ITEMS_QUERY, GET_ITEM_QUERY, UPDATE_ITEM_MUTATION } from "../gql";
import { GET_ITEMS_QUERY as GET_CATEGORIES_ITEMS } from "../../category/gql";

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
import { getUsersSelect } from "../../../../utility/gqlHelpers/getUsers";
import PrerequisiteRepeater from "../Repeater";
import LessonRepeater from "../LessonRepeater";
import { useGetLessons } from "../../../../utility/gqlHelpers/useGetLessons";
import Attendees from "./Attendees";

const statusOptions = [
  { value: true, label: t("Active") },
  { value: false, label: t("Deactive") },
];
const options = { numeral: true, numeralThousandsGroupStyle: "thousand" };

const defaultValues = {
  section: [
    {
      name: "useFieldArray1",
      lesson: [{ field1: "field1", field2: "field2" }],
    },
    {
      name: "useFieldArray2",
      lesson: [{ field1: "field1", field2: "field2" }],
    },
  ],
};

const EditCard = () => {
  const SignupSchema = yup.object().shape({
    title: yup.string().required(`${t("Title")} ${t("field is required")}`),
    slug: yup.string().required(`${t("Slug")} ${t("field is required")}`),
  });

  // ** State
  const [description, setDescription] = useState(EditorState.createEmpty());

  const [count, setCount] = useState(1);
  const [sectionCount, setSectionCount] = useState(1);

  const [data, setData] = useState(null);
  const [images, setImages] = useState(null);
  const [items, setItems] = useState([]);
  const [sections, setSections] = useState([]);
  const [attendees, setAttendees] = useState([]);

  const history = useNavigate();
  const [categoriesOptions, setCategoriesOptions] = useState([
    { value: "", label: `${t("Select")} ${t("Category")}` },
  ]);

  // ** Hooks
  const {
    control,
    register,
    handleSubmit,
    getValues,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });
  const { id } = useParams();
  const usersData = getUsersSelect("teacher");
  const [usersOptions, setUsersOptions] = useState(null);

  const { lessons } = useGetLessons();

  useEffect(() => {
    if (usersData.length) {
      setUsersOptions(usersData);
    }
  }, [usersData]);

  useQuery(GET_CATEGORIES_ITEMS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
        type: "course",
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

  useQuery(GET_ITEM_QUERY, {
    variables: { id: parseInt(id) },
    fetchPolicy: "network-only",
    onCompleted: async ({ course }) => {
      if (course) {
        if (course.body) setDescription(convertHtmlToDraft(course.body));
        setData(course);
        for (const [key, value] of Object.entries(course)) {
          setValue(key, value);
        }

        setImages(course.image);
        setItems(course.prerequisite);
        setCount(course.prerequisite?.length);
        setSections(course.sections);
        setSectionCount(course.sections?.length);
        setAttendees(course.attendees?.map((c) => c.user));

        reset({
          ...course,
          status: course.status
            ? {
                label: t("Active"),
                value: course.status,
              }
            : {
                label: t("Deactive"),
                value: course.status,
              },
          featured: course.featured
            ? {
                label: t("Active"),
                value: course.featured,
              }
            : {
                label: t("Deactive"),
                value: course.status,
              },
          category: {
            label: course.category?.title,
            value: course.category?.id,
          },
          organizer: {
            label: course.organizer
              ? course.organizer.firstName + " " + course.organizer.lastName
              : null,
            value: course.organizer?.id,
          },
          section: course.sections,
        });
      }
    },
  });

  const [update] = useMutation(UPDATE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data updated successfully"));
      history(`/apps/courses`);
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
    delete data.sections;
    delete data.attendees;

    const rawContentState = convertToRaw(description.getCurrentContent());
    const markup = draftToHtml(rawContentState, hashConfig, true);

    const offprice =
      typeof data.offprice === "string"
        ? parseFloat(data.offprice?.replaceAll(",", ""))
        : data.offprice;

    const price =
      typeof data.price === "string"
        ? parseFloat(data.price?.replaceAll(",", ""))
        : data.price;

    const mapAttendees = attendees.map((a) => a.id);

    update({
      variables: {
        refetchQueries: [GET_ITEM_QUERY],
        input: {
          ...data,
          image: images,
          status: data.status?.value,
          featured: data.featured?.value,
          category: data.category ? data.category?.value : null,
          body: markup,
          capacity: parseInt(data.capacity),
          offprice,
          price,
          organizer: data.organizer ? data.organizer.value : null,
          prerequisite: items,
          attendees: mapAttendees,
        },
      },
    });
  };

  const handleReset = () => {
    window.history.back();
  };

  const handleChangeItems = (item) => {
    const foundItem = items.findIndex((p) => p.idx === item.idx);
    delete foundItem.__typename;

    if (foundItem === -1) {
      setItems([...items, item]);
    } else {
      let newArr = [...items];
      newArr[foundItem] = item;

      setItems(newArr);
    }
  };

  const deleteSection = (i) => {
    const filter = sections.filter((p) => p.idx !== i);
    setSections(filter);
  };

  const deleteLessonItem = (lessonIndex, sectionId) => {
    const array = [...sections];
    const filtered = array
      .filter((a, idx) => idx === sectionId)
      .map((e) => {
        return {
          ...e,
          lessons: e.lessons.filter((l, i) => i !== lessonIndex),
        };
      });

    setSections(filtered);
  };

  const deleteItem = (i) => {
    const filter = items.filter((p) => p.idx !== i);

    setItems(filter);
  };

  const handleAddAttendees = (user) => {
    const array = [...attendees];
    setAttendees([...array, user]);
  };

  const handleDeleteAttendee = (e) => {
    const array = [...attendees]; // make a separate copy of the array
    if (e !== -1) {
      array.splice(e, 1);
      setAttendees(array);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col xl={9} md={8} sm={12}>
            <Fragment>
              <CardAction title={t("Add new course")} actions="collapse">
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

                    <Col md={6} xs={12} className="mb-1">
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

                    <Col md={3}>
                      <Label className="form-label" for="organizer">
                        {t("User")}
                      </Label>
                      <Controller
                        name="organizer"
                        control={control}
                        render={({ field }) => (
                          <Select
                            isClearable={false}
                            classNamePrefix="select"
                            options={usersOptions}
                            theme={selectThemeColors}
                            placeholder={`${t("Select")} ${t("User")}...`}
                            className={classnames("react-select", {
                              "is-invalid":
                                data !== null && data.organizer === null,
                            })}
                            {...field}
                          />
                        )}
                      />
                      {errors.organizer && (
                        <FormFeedback style={{ display: "block" }}>
                          {errors.organizer.message}
                        </FormFeedback>
                      )}
                    </Col>
                  </Row>

                  <div className="divider divider-start">
                    <div className="divider-text">{t("Course details")}</div>
                  </div>

                  <Row>
                    <Col md={3} xs={6}>
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
                          <Input {...field} placeholder={t("Capacity")} />
                        )}
                      />
                    </Col>

                    <Col md={7} xs={12}>
                      <Label className="form-label" for="video">
                        {t("Video link")}
                      </Label>
                      <Controller
                        id="video"
                        name="video"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Input {...field} placeholder={t("Video link")} />
                        )}
                      />
                    </Col>

                    <Col md={3} xs={6} className="mt-50">
                      <Label className="form-label" for="price">
                        {t("Price")}
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
                    <Col md={3} xs={6} className="mt-50">
                      <Label className="form-label" for="offprice">
                        {t("Off Price")}
                      </Label>
                      <Controller
                        id="offprice"
                        name="offprice"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Cleave
                            className="form-control"
                            placeholder="5,000"
                            options={options}
                            id="offprice"
                            {...field}
                          />
                        )}
                      />
                    </Col>
                    <Col md={6} xs={12} className="mt-50">
                      <Label className="form-label" for="classlink">
                        {t("Class link")}
                      </Label>
                      <Controller
                        id="classlink"
                        name="classlink"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Input {...field} placeholder={t("Class link")} />
                        )}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} xs={12} className="mt-1">
                      <Label className="form-label" for="slug">
                        {t("Prerequisites")}
                      </Label>
                      <PrerequisiteRepeater
                        defaultCount={count}
                        handleChangeItems={handleChangeItems}
                        items={items}
                        deleteItem={deleteItem}
                      />
                    </Col>
                  </Row>

                  <Col md={12} xs={12} className="mt-3">
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
              <CardAction title={t("Curriculum")} actions="collapse">
                <CardBody>
                  <Row>
                    <Col md={12} xs={12} className="mb-1">
                      <LessonRepeater
                        defaultCount={sectionCount}
                        lessons={lessons}
                        items={sections}
                        {...{
                          control,
                          register,
                          defaultValues,
                          getValues,
                          setValue,
                          errors,
                        }}
                        deleteLesson={deleteLessonItem}
                        deleteSection={deleteSection}
                      />
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

              <div className="invoice-list-wrapper">
                <CardAction title={t("Attendees")} actions="collapse">
                  <CardBody>
                    <Attendees
                      attendees={attendees}
                      handleAddAttendees={handleAddAttendees}
                      handleDeleteAttendee={handleDeleteAttendee}
                    />
                  </CardBody>
                </CardAction>
              </div>
            </Fragment>
          </Col>
          <Col xl={3} md={4} sm={12}>
            <Row>
              <Col md={12} xs={12}>
                <Card className="invoice-action-wrapper">
                  <CardHeader>{t("Visibility options")}</CardHeader>
                  <CardBody>
                    <div>
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
