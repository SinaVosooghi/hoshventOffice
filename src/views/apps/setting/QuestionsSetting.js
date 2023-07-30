// ** React Imports
import { Fragment, useEffect, useState } from "react";

import { useForm, Controller } from "react-hook-form";
import "cleave.js/dist/addons/cleave-phone.us";
// ** Custom Components
import toast from "react-hot-toast";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import classnames from "classnames";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
} from "reactstrap";

// ** Utils
import { useMutation, useQuery } from "@apollo/client";

// ** Demo Components
import { t } from "i18next";
import { GET_ITEM_QUERY, UPDATE_ITEM_MUTATION } from "./gql";
import { GET_ITEMS_QUERY } from "../questions/gql";

const QuestionsContent = ({ data }) => {
  const [courseQuestionOptions, setCourseQuestionOptions] = useState([
    { value: "", label: `${t("Select")} ${t("Question")}` },
  ]);
  const [productQuestionOptions, setProductQuestionOptions] = useState([
    { value: "", label: `${t("Select")} ${t("Question")}` },
  ]);
  const [blogQuestionOptions, setBlogQuestionOptions] = useState([
    { value: "", label: `${t("Select")} ${t("Question")}` },
  ]);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
      },
    },
    onCompleted: ({ questions }) => {
      questions?.questions?.map((question) => {
        console.log(question);
        if (question.type === "course") {
          setCourseQuestionOptions((prev) => [
            ...prev,
            { value: question.id, label: question.title },
          ]);
        }
        if (question.type === "product") {
          setProductQuestionOptions((prev) => [
            ...prev,
            { value: question.id, label: question.title },
          ]);
        }
        if (question.type === "blog") {
          setBlogQuestionOptions((prev) => [
            ...prev,
            { value: question.id, label: question.title },
          ]);
        }
      });
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

  const defaultValues = {
    title: data?.title?.split(" ")[0],
  };

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  // ** States
  const [update, { loading }] = useMutation(UPDATE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEM_QUERY],
    onCompleted: (data) => {
      toast.success(t("Data saved successfully"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        courseQuestion: {
          label: data.courseQuestion?.title,
          value: data.courseQuestion?.id,
        },
        productQuestion: {
          label: data.productQuestion?.title,
          value: data.productQuestion?.id,
        },
        blogQuestion: {
          label: data.blogQuestion?.title,
          value: data.blogQuestion?.id,
        },
      });
    }
  }, [data]);

  const onSubmit = (data) => {
    delete data.__typename;
    delete data.created;
    delete data.updated;
    delete data.id;

    update({
      variables: {
        refetchQueries: [GET_ITEM_QUERY],
        input: {
          ...data,
          courseQuestion: data.courseQuestion?.value,
          productQuestion: data.productQuestion?.value,
          blogQuestion: data.blogQuestion?.value,
        },
      },
    });
  };

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">{t("Social media setting")}</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          <Form className="mt-2 pt-50" onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={4}>
                <Label className="form-label" for="courseQuestion">
                  {t("Course")} {t("Question")}
                </Label>
                <Controller
                  name="courseQuestion"
                  control={control}
                  render={({ field }) => (
                    <Select
                      isClearable={false}
                      classNamePrefix="select"
                      options={courseQuestionOptions}
                      theme={selectThemeColors}
                      placeholder={t("Select...")}
                      {...field}
                    />
                  )}
                />
              </Col>

              <Col md={4}>
                <Label className="form-label" for="productQuestion">
                  {t("Product")} {t("Question")}
                </Label>
                <Controller
                  name="productQuestion"
                  control={control}
                  render={({ field }) => (
                    <Select
                      isClearable={false}
                      classNamePrefix="select"
                      options={productQuestionOptions}
                      theme={selectThemeColors}
                      placeholder={t("Select...")}
                      {...field}
                    />
                  )}
                />
              </Col>

              <Col md={4}>
                <Label className="form-label" for="blogQuestion">
                  {t("Blog")} {t("Question")}
                </Label>
                <Controller
                  name="blogQuestion"
                  control={control}
                  render={({ field }) => (
                    <Select
                      isClearable={false}
                      classNamePrefix="select"
                      options={blogQuestionOptions}
                      theme={selectThemeColors}
                      placeholder={t("Select...")}
                      {...field}
                    />
                  )}
                />
              </Col>

              <Col className="mt-2" sm="12">
                <Button type="submit" className="me-1" color="primary">
                  {t("Save changes")}
                </Button>
                <Button color="secondary" outline>
                  {t("Discard")}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default QuestionsContent;
