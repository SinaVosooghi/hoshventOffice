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
import { useMutation } from "@apollo/client";
import { CREATE_ITEM_MUTATION, GET_ITEMS_QUERY } from "../gql";
import classnames from "classnames";
import { useNavigate } from "react-router-dom";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import { hashConfig } from "../../../../utility/Utils";
import { getUsersSelect } from "../../../../utility/gqlHelpers/getUsers";

const typeOptions = [
  { value: null, label: `${t("Select")} ${t("Type")}...` },
  { value: "blog", label: t("Blog") },
  { value: "course", label: t("Course") },
  { value: "product", label: t("Product") },
];

const AddCard = () => {
  const SignupSchema = yup.object().shape({
    user: yup.object().required(`${t("User")} ${t("field is required")}`),
    body: yup.string().required(`${t("Body")} ${t("field is required")}`),
  });

  // ** State
  const [description, setDescription] = useState(EditorState.createEmpty());

  const [data, setData] = useState(null);
  const [type, setType] = useState(null);
  const [usersOptions, setUsersOptions] = useState(null);

  const history = useNavigate();
  const usersData = getUsersSelect();

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

  const [create] = useMutation(CREATE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
      history(`/apps/blogs`);
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
          category: data.category ? data.category?.value : null,
          body: markup,
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
          <Col xl={9} md={8} sm={12}>
            <Fragment>
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">{t("Add new comment")}</CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={3}>
                      <Label className="form-label" for="user">
                        {t("User")}
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

                    <Col md={2} xs={12}>
                      <Label className="form-label" for="status">
                        {t("Type")}:
                      </Label>

                      <Select
                        isClearable={false}
                        classNamePrefix="select"
                        options={typeOptions}
                        onChange={(v) => setType(v.value)}
                        theme={selectThemeColors}
                        placeholder={`${t("Select")} ${t("Type")}...`}
                      />
                    </Col>
                  </Row>

                  <Col md={12} xs={12} className="mt-50">
                    <Label className="form-label" for="body">
                      {t("Comment")}
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
                    <Button block outline onClick={handleReset}>
                      {t("Discard")}
                    </Button>
                    <Button
                      color="success"
                      block
                      className="mt-50"
                      type="submit"
                    >
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
