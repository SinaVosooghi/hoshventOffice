// ** React Imports
import { Fragment, useEffect, useState } from "react";

import Select from "react-select";
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
import { GET_ITEMS_QUERY, GET_ITEM_QUERY, UPDATE_ITEM_MUTATION } from "../gql";
import classnames from "classnames";
import { useNavigate, useParams } from "react-router-dom";
import { convertHtmlToDraft, sleep } from "../../../../utility/Utils";

import moment from "moment";
import momentJalali from "moment-jalaali";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import { hashConfig } from "../../../../utility/Utils";
import { MultiDatePicker } from "../../../../utility/helpers/datepicker/MultipleDatepicker";
import { useTranslation } from "react-i18next";

const statusOptions = [
  { value: true, label: t("Active") },
  { value: false, label: t("Deactive") },
];

const options = { numeral: true, numeralThousandsGroupStyle: "thousand" };

const EditCard = () => {
  const SignupSchema = yup.object().shape({
    title: yup.string().required(`${t("Title")} ${t("field is required")}`),
  });
  const { type } = useParams();

  const [description, setDescription] = useState(EditorState.createEmpty());
  const [startDate, setStartDate] = useState();
  const [expireDate, setExpireDate] = useState();
  const [data, setData] = useState(null);
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  useEffect(() => {
    setLang(i18n.language);
  }, [i18n.language]);

  const history = useNavigate();
  const handleStartDateChange = (dateValue) => {
    setStartDate(dateValue);
  };

  const handleExpireDateChange = (dateValue) => {
    setExpireDate(dateValue);
  };

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });
  const { id } = useParams();

  useQuery(GET_ITEM_QUERY, {
    variables: { id: parseInt(id) },
    fetchPolicy: "network-only",
    onCompleted: async ({ coupon }) => {
      if (coupon) {
        setData(coupon);
        setDescription(convertHtmlToDraft(coupon.body));

        for (const [key, value] of Object.entries(coupon)) {
          setValue(key, value);
        }
        await sleep(100);

        reset({
          ...coupon,
          status: coupon.status
            ? {
                label: t("Active"),
                value: coupon.status,
              }
            : {
                label: t("Deactive"),
                value: coupon.status,
              },
        });
      }
    },
  });

  const [update] = useMutation(UPDATE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
      history(`/apps/coupons/${type}`);
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const onSubmit = (data) => {
    delete data.__typename;
    delete data.created;
    delete data.updated;
    setData(data);
    const rawContentState = convertToRaw(description.getCurrentContent());
    const markup = draftToHtml(rawContentState, hashConfig, true);

    const percent =
      typeof data.percent === "string"
        ? parseFloat(data.percent?.replaceAll(",", ""))
        : data.percent;

    const limit =
      typeof data.limit === "string"
        ? parseFloat(data.limit?.replaceAll(",", ""))
        : data.limit;

    setData(data);
    update({
      variables: {
        input: {
          ...data,
          body: markup,
          status: data.status?.value,
          limit,
          percent,
          type,
          expiredate: expireDate,
          startdate: startDate,
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
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">
                    {t("Add new coupon")}{" "}
                    {type && <Badge className="ms-1">{t(type)}</Badge>}
                  </CardTitle>
                </CardHeader>
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

                    <Col md={4} xs={12}>
                      <Label className="form-label" for="code">
                        {t("Code")} <span className="text-danger">*</span>
                      </Label>
                      <Controller
                        id="code"
                        name="code"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder={t("Code")}
                            invalid={errors.code && true}
                          />
                        )}
                      />
                      {errors.code && (
                        <FormFeedback>{errors.code.message}</FormFeedback>
                      )}
                    </Col>

                    <Col md={2} xs={12}>
                      <Label className="form-label" for="percent">
                        {t("Percent")} <span className="text-danger">*</span>
                      </Label>
                      <Controller
                        id="percent"
                        name="percent"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder={t("Percent")}
                            invalid={errors.percent && true}
                          />
                        )}
                      />
                      {errors.percent && (
                        <FormFeedback>{errors.percent.message}</FormFeedback>
                      )}
                    </Col>

                    <Col md={2} xs={6}>
                      <Label className="form-label" for="limit">
                        {t("Limit")}
                      </Label>
                      <Controller
                        id="limit"
                        name="limit"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                          <Cleave
                            className="form-control"
                            placeholder="10"
                            options={options}
                            id="numeral-formatting"
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

                    <Col md={3}>
                      <Label className="form-label" for="startdate">
                        {t("Start date")}:
                        <span className="customBadge ms-50">
                          {lang === "ir"
                            ? momentJalali(data?.startdate).format(
                                "jYYYY/jMM/jDD"
                              )
                            : moment(data?.startdate).format("YYYY/MM/DD")}
                        </span>
                      </Label>
                      <MultiDatePicker
                        handleDateChange={handleStartDateChange}
                        picker={startDate}
                        preSelect={data?.startdate}
                      />
                    </Col>

                    <Col md={3}>
                      <Label className="form-label" for="expiredate">
                        {t("Expire date")}:
                        <span className="customBadge ms-50">
                          {lang === "ir"
                            ? momentJalali(data?.expiredate).format(
                                "jYYYY/jMM/jDD"
                              )
                            : moment(data?.expiredate).format("YYYY/MM/DD")}
                        </span>
                      </Label>
                      <MultiDatePicker
                        handleDateChange={handleExpireDateChange}
                        picker={expireDate}
                        preSelect={data?.expiredate}
                      />
                    </Col>
                  </Row>

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
                </CardBody>
              </Card>
            </Fragment>
          </Col>

          <Col xl={3} md={4} sm={12}>
            <Row>
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

export default EditCard;
