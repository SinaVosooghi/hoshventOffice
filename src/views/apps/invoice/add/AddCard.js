// ** React Imports
import { useState, useEffect } from "react";

// ** Custom Components
import Repeater from "@components/repeater";

// ** Third Party Components
import { Plus, Hash } from "react-feather";
import Select from "react-select";
import classnames from "classnames";

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
  InputGroup,
  InputGroupText,
  FormFeedback,
} from "reactstrap";

// ** Styles
import "react-slidedown/lib/slidedown.css";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/base/pages/app-invoice.scss";
import { t } from "i18next";
import { GET_ITEM_QUERY } from "../../setting/gql";
import { useMutation, useQuery } from "@apollo/client";
import { showImage, thousandSeperator } from "../../../../utility/Utils";
import { CREATE_ITEM_MUTATION, GET_ITEMS_QUERY } from "../gql";
import { MultiDatePicker } from "../../../../utility/helpers/datepicker/MultipleDatepicker";
import { getUsersSelect } from "../../../../utility/gqlHelpers/getUsers";

// ** Third Party Components
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getProductsSelect } from "../../../../utility/gqlHelpers/getProducts";
import Item from "./Item";
import AddActions from "./AddActions";
import { getCouponsSelect } from "../../../../utility/gqlHelpers/getCoupons";
import { getCoursesSelect } from "../../../../utility/gqlHelpers/getCourses";
import Avatar from "@components/avatar";
import { useNavigate } from "react-router-dom";

const AddCard = ({ setSendSidebarOpen }) => {
  const FormSchema = yup.object().shape({
    user: yup.object().required(`${t("User")} ${t("field is required")}`),
    invoicenumber: yup
      .number()
      .required(`${t("Invoice number")} ${t("field is required")}`),
  });
  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(FormSchema) });

  // ** Router
  const history = useNavigate();

  // ** States
  const [count, setCount] = useState(1);
  const [data, setData] = useState(null);
  const [clients, setClients] = useState(null);
  const [issueDate, setIssueDate] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [dueDatepicker, setDueDatePicker] = useState(null);
  const [setting, setSetting] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [subTotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [donePayment, setDonePayment] = useState(false);
  const [shipping, setShipping] = useState(null);
  const [invoiceType, setInvoiceType] = useState("shop");

  const [products, setProducts] = useState(null);
  const [coupons, setCoupons] = useState(null);
  const [courses, setCourses] = useState(null);

  const [items, setItems] = useState([]);

  const usersData = getUsersSelect();
  const productsData = getProductsSelect();
  const couponsData = getCouponsSelect();
  const coursesData = getCoursesSelect();

  useEffect(() => {
    document.querySelector("#repeater-wrapper")?.remove();
    setItems([]);
  }, [invoiceType]);

  useEffect(() => {
    if (coursesData.length) {
      setCourses(coursesData);
    }
  }, [coursesData]);

  useEffect(() => {
    if (couponsData.length) {
      setCoupons(couponsData);
    }
  }, [couponsData]);

  useEffect(() => {
    if (productsData.length) {
      setProducts(productsData);
    }
  }, [productsData]);

  useEffect(() => {
    if (usersData.length) {
      setClients(usersData);
    }
  }, [usersData]);

  useEffect(() => {
    let total = 0;
    items.map((item) => {
      total = total + item.quantity * item.price;
    });

    setSubtotal(total);

    if (discount) total = total - (total * discount) / 100;

    const tax = (total * setting?.tax) / 100;
    total = total + tax;

    if (shipping && shipping.cost) total = total + shipping.cost;

    setTotal(total);
  }, [items, discount, shipping]);

  useQuery(GET_ITEM_QUERY, {
    fetchPolicy: "network-only", // Used for first execution
    onCompleted: ({ getSetting }) => {
      if (getSetting) {
        setSetting(getSetting);
      }
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only", // Used for first execution
    onCompleted: ({ invoices }) => {
      if (invoices) {
        setInvoiceNumber(invoices?.invoices[0].invoicenumber);
        reset({
          invoicenumber: invoices?.invoices[0].invoicenumber + 1,
        });
      } else {
        setInvoiceNumber(0);
      }
    },
    onError: (error) => {
      setInvoiceNumber(0);
      console.log(error.message);
    },
    variables: {
      input: {
        limit: 1,
        skip: 0,
      },
    },
  });

  const [create] = useMutation(CREATE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
      history(`/apps/invoices`);
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  // ** Deletes form
  const deleteForm = (e, idx) => {
    let newArr = [...items];
    const foundedItem = newArr.findIndex((item) => item.idx === idx);
    newArr.splice(foundedItem, 1);

    setItems(newArr);
    e.preventDefault();
    e.target.closest(".repeater-wrapper").remove();
  };

  // ** render user img
  const renderUserImg = (type) => {
    if (setting?.logo !== null) {
      return (
        <img width="75" alt="user-avatar" src={showImage(setting?.logo)} />
      );
    } else {
      const stateNum = Math.floor(Math.random() * 6),
        states = [
          "light-success",
          "light-danger",
          "light-warning",
          "light-info",
          "light-primary",
          "light-secondary",
        ],
        color = states[stateNum];
      return (
        <Avatar
          initials
          color={color}
          className="rounded mt-3 mb-2"
          content="TG"
          contentStyles={{
            borderRadius: 0,
            fontSize: "calc(48px)",
            width: "100%",
            height: "100%",
          }}
          style={{
            height: "24px",
            width: "35px",
          }}
        />
      );
    }
  };

  const note = t(
    "It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!"
  );

  const handleIssueDate = (dateValue) => {
    setIssueDate(dateValue);
  };

  const handleDueDate = (dateValue) => {
    setDueDatePicker(dateValue);
  };

  const onSubmit = (data) => {
    setData(data);

    create({
      variables: {
        input: {
          ...data,
          type: invoiceType,
          user: data.user ? data.user?.value : null,
          paymenttype: data.paymenttype ? data.paymenttype : null,
          shipping: data.shipping ? data.shipping?.value : null,
          coupon: selectedDiscount ?? null,
          issuedate: issueDate,
          duedate: dueDatepicker,
          donepayment: donePayment,
          items,
        },
      },
    });
  };

  const handleChangeItems = (item) => {
    if (!item.price) return false;
    const foundItem = items.findIndex((p) => p.idx === item.idx);

    if (foundItem === -1) {
      setItems([...items, item]);
    } else {
      let newArr = [...items];
      newArr[foundItem] = item;

      setItems(newArr);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row className="invoice-add">
        <Col xl={9} md={8} sm={12}>
          <Card className="invoice-preview-card">
            {/* Header */}
            <CardBody className="invoice-padding pb-0">
              <div className="d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0">
                <div>
                  <div className="logo-wrapper">
                    {renderUserImg("logo")}
                    <h3 className="text-primary invoice-logo">
                      {setting?.companyName}
                    </h3>
                  </div>
                  <p className="card-text mb-25">{setting?.address}</p>
                  <p className="card-text mb-0">{setting?.phoneNumber}</p>
                </div>
                <div className="invoice-number-date mt-md-0 mt-2">
                  <div className="d-flex align-items-center justify-content-md-end mb-1">
                    <h4 className="title">{t("Invoice")}</h4>
                    <InputGroup className="input-group-merge invoice-edit-input-group">
                      <InputGroupText>
                        <Hash size={15} />
                      </InputGroupText>
                      <Controller
                        name="invoicenumber"
                        control={control}
                        defaultValue={invoiceNumber}
                        render={({ field }) => (
                          <Input type="number" placeholder="53634" {...field} />
                        )}
                      />
                      {errors.invoicenumber && (
                        <FormFeedback style={{ display: "block" }}>
                          {errors.invoicenumber.message}
                        </FormFeedback>
                      )}
                    </InputGroup>
                  </div>
                  <div className="d-flex align-items-center mb-1">
                    <span className="title">{t("Date")}:</span>
                    <MultiDatePicker
                      handleDateChange={handleIssueDate}
                      picker={issueDate}
                      preSelect={issueDate}
                    />
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="title">{t("Due Date")}:</span>
                    <MultiDatePicker
                      handleDateChange={handleDueDate}
                      picker={dueDatepicker}
                      preSelect={dueDatepicker}
                    />
                  </div>
                </div>
              </div>
            </CardBody>
            {/* /Header */}

            <hr className="invoice-spacing" />

            {/* Address and Contact */}
            <CardBody className="invoice-padding pt-0">
              <Row className="row-bill-to invoice-spacing">
                <Col className="col-bill-to ps-0" xl="6">
                  <h6 className="invoice-to-title">{t("Invoice To")}:</h6>
                  <div className="invoice-customer">
                    {clients !== null ? (
                      <>
                        <Controller
                          name="user"
                          control={control}
                          render={({ field }) => (
                            <Select
                              classNamePrefix="select"
                              options={clients}
                              theme={selectThemeColors}
                              placeholder={`${t("Select")} ${t("User")}...`}
                              className={classnames("react-select", {
                                "is-invalid":
                                  data !== null && data.user === null,
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
                      </>
                    ) : null}
                  </div>
                </Col>
                <Col className="col-bill-to ps-0" xl="6">
                  <h6 className="invoice-to-title">{t("Discount")}:</h6>
                  <div className="invoice-customer">
                    {coupons !== null ? (
                      <>
                        <Select
                          classNamePrefix="select"
                          options={coupons}
                          theme={selectThemeColors}
                          placeholder={`${t("Select")} ${t("Discount")}...`}
                          className={classnames("react-select", {
                            "is-invalid":
                              data !== null && data.discount === null,
                          })}
                          onChange={(e) => {
                            setSelectedDiscount(e.value);
                            setDiscount(e.data);
                          }}
                        />
                      </>
                    ) : null}
                  </div>
                </Col>
              </Row>
            </CardBody>
            {/* /Address and Contact */}

            {/* Product Details */}
            <CardBody className="invoice-padding invoice-product-details">
              <Repeater count={count}>
                {(i) => {
                  return (
                    <Item
                      i={i}
                      key={i}
                      products={invoiceType === "shop" ? products : courses}
                      control={control}
                      errors={errors}
                      deleteForm={deleteForm}
                      handleChangeItems={handleChangeItems}
                    />
                  );
                }}
              </Repeater>

              <Row className="mt-1">
                <Col sm="12" className="px-0">
                  <Button
                    color="primary"
                    size="sm"
                    className="btn-add-new"
                    onClick={() => setCount(count + 1)}
                  >
                    <Plus size={14} className="me-25"></Plus>{" "}
                    <span className="align-middle">{t("Add Item")}</span>
                  </Button>
                </Col>
              </Row>
            </CardBody>

            {/* /Product Details */}

            {/* Invoice Total */}
            <CardBody className="invoice-padding">
              <Row className="invoice-sales-total-wrapper">
                <Col
                  className="mt-md-0 mt-3"
                  md={{ size: "6", order: 1 }}
                  xs={{ size: 12, order: 2 }}
                >
                  <div className="d-flex align-items-center mb-1">
                    <Label for="salesperson" className="form-label">
                      {t("Salesperson")}:
                    </Label>
                    <Controller
                      name="salesperson"
                      defaultValue=""
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          className="ms-50"
                          id="salesperson"
                          placeholder={t("Salesperson")}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </Col>
                <Col
                  className="d-flex justify-content-end"
                  md={{ size: 6, order: 2 }}
                  xs={{ size: 12, order: 1 }}
                >
                  <div className="invoice-total-wrapper">
                    <div className="invoice-total-item">
                      <p className="invoice-total-title">{t("Subtotal")}:</p>
                      <p className="invoice-total-amount">
                        {thousandSeperator(subTotal)}
                      </p>
                    </div>
                    <div className="invoice-total-item">
                      <p className="invoice-total-title">{t("Discount")}:</p>
                      <p className="invoice-total-amount">
                        {discount ? discount + "%" : t("No discount")}
                      </p>
                    </div>

                    <div className="invoice-total-item">
                      <p className="invoice-total-title">
                        {t("Shipping cost")}:
                      </p>
                      <p className="invoice-total-amount">
                        {shipping && shipping.cost
                          ? t(thousandSeperator(shipping.cost))
                          : t("No Shipping")}
                      </p>
                    </div>

                    <div className="invoice-total-item">
                      <p className="invoice-total-title">{t("Tax")}:</p>
                      <p className="invoice-total-amount">{setting?.tax}%</p>
                    </div>
                    <hr className="my-50" />
                    <div className="invoice-total-item">
                      <p className="invoice-total-title">{t("Total")}:</p>
                      <p className="invoice-total-amount">
                        {thousandSeperator(total)}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
            {/* /Invoice Total */}

            <hr className="invoice-spacing mt-0" />

            {/* Invoice Note */}
            <CardBody className="invoice-padding py-0">
              <Row>
                <Col>
                  <div className="mb-2">
                    <Label for="note" className="form-label fw-bold">
                      {t("Note")}:
                    </Label>
                    <Controller
                      name="note"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="textarea"
                          rows="2"
                          defaultValue={t(note)}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </Col>
              </Row>
            </CardBody>
            {/* /Invoice Note */}
          </Card>
        </Col>
        <Col xl={3} md={4} sm={12}>
          <AddActions
            setSendSidebarOpen={setSendSidebarOpen}
            control={control}
            setDonePayment={setDonePayment}
            donePayment={donePayment}
            setShipping={setShipping}
            setInvoiceType={setInvoiceType}
            invoiceType={invoiceType}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default AddCard;
