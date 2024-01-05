// ** React Imports
import { Fragment, useState } from "react";

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
  Badge,
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
import classnames from "classnames";
import { useNavigate, useParams } from "react-router-dom";
import { convertHtmlToDraft, sleep } from "../../../../utility/Utils";
import moment from "moment";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import { hashConfig } from "../../../../utility/Utils";
import { ServicesMultiSelect } from "../../user/list/ServiceMultiSelect";
import { WorkshopMultiSelect } from "../../user/list/WorkshopMultiSelect";
import { SeminarMultiSelect } from "../../user/list/SeminarMultiSelect";

const statusOptions = [
  { value: true, label: t("Active") },
  { value: false, label: t("Deactive") },
];

const EditCard = () => {
  const SignupSchema = yup.object().shape({
    title: yup.string().required(`${t("Title")} ${t("field is required")}`),
    slug: yup.string().required(`${t("Slug")} ${t("field is required")}`),
  });

  const [serviceItems, setServiceItems] = useState([]);
  const [seminarItems, setSeminarItems] = useState([]);
  const [workshopItems, setWorkshopItems] = useState([]);

  const [description, setDescription] = useState(EditorState.createEmpty());
  const [data, setData] = useState(null);
  const [images, setImages] = useState(null);
  const history = useNavigate();
  const [categoriesOptions, setCategoriesOptions] = useState([
    { value: "", label: `${t("Select")} ${t("Category")}` },
  ]);

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });
  const { type, id } = useParams();

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
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
    onCompleted: async ({ category }) => {
      if (category) {
        setData(category);
        setDescription(convertHtmlToDraft(category.body));

        for (const [key, value] of Object.entries(category)) {
          setValue(key, value);
        }
        await sleep(100);

        setImages(category.image);

        reset({
          ...category,
          status: category.status
            ? {
                label: t("Active"),
                value: category.status,
              }
            : {
                label: t("Deactive"),
                value: category.status,
              },
          featured: category.featured
            ? {
                label: t("Active"),
                value: category.featured,
              }
            : {
                label: t("Deactive"),
                value: category.status,
              },
          category: {
            label: category.category?.title,
            value: category.category?.id,
          },
          type: {
            label: t(category?.type),
            value: category?.type,
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
      history(`/apps/categories/${type}`);
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
    const image = data.image;

    delete data.image;

    const workshopFiltered = workshopItems.map((m) => m.value);
    const seminarFiltered = seminarItems.map((m) => m.value);
    const servicesFiltered = serviceItems.map((m) => m.value);

    update({
      variables: {
        refetchQueries: [GET_ITEM_QUERY],
        input: {
          ...data,
          ...(typeof image !== "string" && { image }),
          ...(images === null && typeof image === "string" && { image: null }),
          body: markup,
          status: data.status?.value,
          featured: data.featured?.value,
          category: data.category ? data.category?.value : null,
          type,
          services: servicesFiltered,
          seminars: seminarFiltered,
          workshops: workshopFiltered,
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
          <Col xl={9} md={9} sm={12}>
            <Fragment>
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">
                    {t("Edit")} {t("Category")} {data?.title ?? ""}
                    {type && <Badge className="ms-1">{t(type)}</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6} xs={12} className="mb-1">
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
                      <Label className="form-label" for="titleen">
                        {t("Title")} {t("English")}
                      </Label>
                      <Controller
                        id="titleen"
                        name="titleen"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder={t("Title")}
                            invalid={errors.titleen && true}
                          />
                        )}
                      />
                      {errors.titleen && (
                        <FormFeedback>{errors.titleen.message}</FormFeedback>
                      )}
                    </Col>

                    <Col md={2}>
                      <Label className="form-label" for="category">
                        {t("Parent category")}
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
                            {...field}
                          />
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
                                data !== null && data.featured === null,
                            })}
                            {...field}
                          />
                        )}
                      />
                    </Col>

                    <Col md={4} xs={12} className="mb-1">
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

                    {type === "user" && (
                      <>
                        <Col md={8} xs={12}>
                          <Label className="form-label" for="services">
                            {t("Services")}:
                          </Label>
                          <Controller
                            name="services"
                            control={control}
                            render={({ field }) => (
                              <ServicesMultiSelect
                                items={serviceItems}
                                setItems={setServiceItems}
                                field={field}
                              />
                            )}
                          />
                        </Col>
                        <Col md={8} xs={12}>
                          <Label className="form-label" for="workshops">
                            {t("Workshops")}:
                          </Label>
                          <Controller
                            name="workshops"
                            control={control}
                            render={({ field }) => (
                              <WorkshopMultiSelect
                                items={workshopItems}
                                setItems={setWorkshopItems}
                                field={field}
                              />
                            )}
                          />
                        </Col>
                        <Col md={8} xs={12}>
                          <Label className="form-label" for="seminars">
                            {t("Seminars")}:
                          </Label>
                          <Controller
                            name="seminars"
                            control={control}
                            render={({ field }) => (
                              <SeminarMultiSelect
                                items={seminarItems}
                                setItems={setSeminarItems}
                                field={field}
                              />
                            )}
                          />
                        </Col>
                      </>
                    )}
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
                </CardBody>
              </Card>
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
            </Row>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default EditCard;
