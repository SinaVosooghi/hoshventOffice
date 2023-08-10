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
import { CREATE_ITEM_MUTATION, GET_ITEMS_QUERY } from "../gql";
import classnames from "classnames";
import { useNavigate, useParams } from "react-router-dom";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";

const statusOptions = [
  { value: true, label: t("Active") },
  { value: false, label: t("Deactive") },
];

const AddCard = () => {
  const SignupSchema = yup.object().shape({
    title: yup.string().required(`${t("Title")} ${t("field is required")}`),
    link: yup.string().required(`${t("Link")} ${t("field is required")}`),
  });

  const [data, setData] = useState(null);

  const history = useNavigate();

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
      history(`/apps/menus`);
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const onSubmit = (data) => {
    setData(data);

    create({
      variables: {
        input: {
          ...data,
          status: data.status?.value,
          order: data.order ? parseFloat(data.order.replaceAll(",", "")) : null,
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
          <Col xl={6} md={12} sm={12}>
            <Fragment>
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">{t("Add new menu")}</CardTitle>
                </CardHeader>
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
                    <Col md={3} xs={12} className="mb-1">
                      <Label className="form-label" for="order">
                        {t("Order")}
                      </Label>
                      <Controller
                        id="order"
                        name="order"
                        defaultValue={0}
                        control={control}
                        render={({ field }) => (
                          <Input {...field} placeholder={t("Order")} />
                        )}
                      />
                      {errors.order && (
                        <FormFeedback>{errors.order.message}</FormFeedback>
                      )}
                    </Col>
                    <Col md={12} xs={12} className="mb-1">
                      <Label className="form-label" for="link">
                        {t("Link")} <span className="text-danger">*</span>
                      </Label>
                      <Controller
                        id="link"
                        name="link"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder={t("Link")}
                            invalid={errors.link && true}
                          />
                        )}
                      />
                      {errors.link && (
                        <FormFeedback>{errors.link.message}</FormFeedback>
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
                  </Row>
                  <Row className="mt-1">
                    <Col>
                      <Button color="success" type="submit" block>
                        {t("Save")}
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
            </Fragment>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AddCard;
