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
import moment from "jalali-moment";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import { hashConfig } from "../../../../utility/Utils";

const statusOptions = [
  { value: true, label: t("Active") },
  { value: false, label: t("Deactive") },
];

const EditCard = () => {
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
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });
  const { type, id } = useParams();

  useQuery(GET_ITEM_QUERY, {
    variables: { id: parseInt(id) },
    fetchPolicy: "network-only",
    onCompleted: async ({ menu }) => {
      if (menu) {
        setData(menu);

        for (const [key, value] of Object.entries(menu)) {
          setValue(key, value);
        }
        await sleep(100);

        reset({
          ...menu,
          status: menu.status
            ? {
                label: t("Active"),
                value: menu.status,
              }
            : {
                label: t("Deactive"),
                value: menu.status,
              },
        });
      }
    },
  });

  const [update] = useMutation(UPDATE_ITEM_MUTATION, {
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
    delete data.__typename;
    delete data.created;
    delete data.updated;

    update({
      variables: {
        refetchQueries: [GET_ITEM_QUERY],
        input: {
          ...data,
          status: data.status?.value,
          order: data.order,
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
            </Fragment>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default EditCard;
