// ** React Imports
import { Fragment, useState } from "react";

import Select from "react-select";
import CardAction from "@components/card-actions";

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
import { GET_ITEMS_QUERY as GET_CATEGORIES_ITEMS } from "../../category/gql";

import classnames from "classnames";
import { useNavigate, useParams } from "react-router-dom";
import { convertHtmlToDraft } from "../../../../utility/Utils";

// ** Editor
import { convertToRaw } from "draft-js";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import { hashConfig } from "../../../../utility/Utils";
import QuestionsRepeater from "../Repeater";

const statusOptions = [
  { value: true, label: t("Active") },
  { value: false, label: t("Deactive") },
];

const EditCard = () => {
  const SignupSchema = yup.object().shape({
    title: yup.string().required(`${t("Title")} ${t("field is required")}`),
    type: yup.object().required(`${t("Type")} ${t("field is required")}`),
  });

  // ** State
  const [count, setCount] = useState(1);

  const [data, setData] = useState(null);
  const [items, setItems] = useState([]);

  const history = useNavigate();

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

  useQuery(GET_CATEGORIES_ITEMS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
        type: "question",
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

  const renderType = (type) => {
    switch (type) {
      case "product":
        return t("Product");
      case "course":
        return t("Course");
      case "blog":
        return t("Blog");
    }
  };

  useQuery(GET_ITEM_QUERY, {
    variables: { id: parseInt(id) },
    fetchPolicy: "network-only",
    onCompleted: async ({ question }) => {
      if (question) {
        setData(question);
        for (const [key, value] of Object.entries(question)) {
          setValue(key, value);
        }

        setItems(question.questions);
        setCount(question.questions?.length);

        reset({
          ...question,
          status: question.status
            ? {
                label: t("Active"),
                value: question.status,
              }
            : {
                label: t("Deactive"),
                value: question.status,
              },
          type: {
            label: renderType(question.type),
            value: question.type,
          },
        });
      }
    },
  });

  const [update] = useMutation(UPDATE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data updated successfully"));
      history(`/apps/questions`);
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

    update({
      variables: {
        refetchQueries: [GET_ITEM_QUERY],
        input: {
          ...data,
          status: data.status?.value,
          type: data.type?.value,
          questions: items,
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

  const deleteItem = (i) => {
    const filter = items.filter((p) => p.idx !== i);

    setItems(filter);
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col xl={9} md={8} sm={12}>
            <Fragment>
              <CardAction title={t("Add new question")} actions="collapse">
                <CardBody>
                  <Row>
                    <Col md={9} xs={12} className="mb-1">
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
                    <Col md={3}>
                      <Label className="form-label" for="type">
                        {t("Type")}
                      </Label>
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <Select
                            isClearable={false}
                            classNamePrefix="select"
                            options={[
                              { label: t("Product"), value: "product" },
                              { label: t("Blog"), value: "blog" },
                              { label: t("Course"), value: "course" },
                            ]}
                            theme={selectThemeColors}
                            placeholder={t("Select...")}
                            className={classnames("react-select", {
                              "is-invalid": data !== null && data.type === null,
                            })}
                            {...field}
                          />
                        )}
                      />
                      {errors.type && (
                        <FormFeedback style={{ display: "block" }}>
                          {errors.type.message}
                        </FormFeedback>
                      )}
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} xs={12} className="mt-1">
                      <Label className="form-label" for="slug">
                        {t("Questions")}
                      </Label>
                      <QuestionsRepeater
                        defaultCount={count}
                        handleChangeItems={handleChangeItems}
                        items={items}
                        deleteItem={deleteItem}
                      />
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
            </Row>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default EditCard;
