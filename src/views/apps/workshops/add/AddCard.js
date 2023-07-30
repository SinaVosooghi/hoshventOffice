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
import { useQuery, useMutation } from "@apollo/client";
import { CREATE_ITEM_MUTATION, GET_ITEMS_QUERY, WORKSHOP_STATES } from "../gql";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import { hashConfig } from "../../../../utility/Utils";
import { GET_ITEMS_QUERY as GET_HALLS_ITEMS } from "../../halls/gql";
import CardAction from "@components/card-actions";
import { DateTimePicker } from "react-advance-jalaali-datepicker";

import { UserSelect } from "./UsersSelects";
import moment from "moment";

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
  const [lecturers, setLecturers] = useState([]);
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [seoDescription, setSeoDescription] = useState(
    EditorState.createEmpty()
  );

  const history = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [hallsItems, setHallsItems] = useState([]);

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });

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

  const [create] = useMutation(CREATE_ITEM_MUTATION, {
    context: {
      headers: {
        "apollo-require-preflight": true,
      },
    },
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
      history(`/apps/workshops`);
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const onSubmit = (data) => {
    setData(data);
    const rawContentState = convertToRaw(description.getCurrentContent());
    const rawContentStateSeoBody = convertToRaw(
      seoDescription.getCurrentContent()
    );

    const markup = draftToHtml(rawContentState, hashConfig, true);
    const markupSeo = draftToHtml(rawContentStateSeoBody, hashConfig, true);

    const price =
      typeof data.price === "string"
        ? parseFloat(data.price?.replaceAll(",", ""))
        : data.price;

    const lecturersItems = lecturers.map((m) => m.value);

    create({
      variables: {
        input: {
          ...data,
          image: data.image,
          body: markup,
          seobody: markupSeo,
          status: data.status?.value,
          featured: data.featured?.value,
          capacity: parseInt(data.capacity),
          price,
          hall: typeof data.hall === "object" ? data.hall?.value : null,
          state: typeof data.state === "object" ? data.state?.value : null,
          lecturers: lecturersItems,
          start_date: moment(startDate).toISOString(),
          end_date: moment(endDate).toISOString(),
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

  const handleStartDateChange = (dateValue) => {
    setStartDate(dateValue);
  };
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col xl={9} md={12} sm={12}>
            <Fragment>
              <CardAction title={t("Add new workshop")} actions="collapse">
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
                              "is-invalid": data !== null && data.hall === null,
                            })}
                            {...field}
                          />
                        )}
                      />
                      {errors.hall && (
                        <FormFeedback style={{ display: "block" }}>
                          {errors.hall.message}
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
                    <div className="divider-text">{t("Workshop details")}</div>
                  </div>

                  <Row className="mt-1 mb-1">
                    <Col md={8} xs={12}>
                      <Label className="form-label" for="lecturers">
                        {t("Lecturers")}
                      </Label>

                      <UserSelect
                        usertype={"lecturer"}
                        users={lecturers}
                        setUsers={setLecturers}
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
                        onChange={(unix) =>
                          handleStartDateChange(moment.unix(unix).toDate())
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
                        onChange={(unix) =>
                          setEndDate(moment.unix(unix).toDate())
                        }
                        containerClass="farsi-datepicker"
                      />
                    </Col>

                    <Col md={2} xs={12}>
                      <Label className="form-label" for="state">
                        {t("Workshop state")}:
                      </Label>
                      <Controller
                        name="state"
                        defaultValue={{
                          value: "not_started",
                          label: t("Not started"),
                        }}
                        control={control}
                        render={({ field }) => (
                          <Select
                            isClearable={false}
                            classNamePrefix="select"
                            defaultValue={{
                              value: "not_started",
                              label: t("Not started"),
                            }}
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
                            onChange={(hall) => {
                              onChange(hall.target.files[0]);
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
                    <Button outline onClick={handleReset}>
                      {t("Discard")}
                    </Button>
                    <Button color="success" className="mx-50" type="submit">
                      {t("Save")}
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

export default AddCard;
