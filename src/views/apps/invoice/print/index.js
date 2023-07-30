// ** React Imports
import { useEffect, useState } from "react";

// ** Reactstrap Imports
import { Row, Col, Table } from "reactstrap";

// ** Styles
import "@styles/base/pages/app-invoice-print.scss";
import { GET_ITEM_QUERY } from "../gql";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import useGetSetting from "../../../../utility/gqlHelpers/useGetSetting";

// ** Utils
import { showImage, thousandSeperator } from "../../../../utility/Utils";
import { t } from "i18next";
import MultiLingualDatePicker from "../../../../utility/helpers/datepicker/MultiLingualDatePicker";
import { useTranslation } from "react-i18next";

const Print = () => {
  const { id } = useParams();
  const setting = useGetSetting();
  const { i18n } = useTranslation();

  // ** Calculation states
  const [subTotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(null);

  // ** States
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // // ** Print on mount
  useEffect(() => {
    setTimeout(() => window.print(), 50);
  }, []);

  useEffect(() => {
    if (selectedInvoice) {
      let total = 0;
      setDiscount(selectedInvoice?.order?.coupon.percent);
      setShipping(selectedInvoice?.order?.shipping);

      selectedInvoice?.order?.items.map((item) => {
        total = total + item.quantity * item.price;
      });

      setSubtotal(total);

      if (discount)
        total = total - (total * selectedInvoice?.order?.coupon.percent) / 100;

      const tax = (total * setting?.tax) / 100;
      total = total + tax;

      if (shipping && shipping.cost) total = total + shipping.cost;

      setTotal(total);
    }
  }, [selectedInvoice, setting]);

  // ** Get invoice on mount based on id
  useQuery(GET_ITEM_QUERY, {
    variables: { id: parseInt(id) },
    fetchPolicy: "network-only",
    onCompleted: async ({ invoice }) => {
      if (invoice) {
        setSelectedInvoice(invoice);
      }
    },
  });

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

  return (
    <div
      className="invoice-print p-3"
      dir={i18n.language === "ir" ? "rtl" : "ltr"}
    >
      <div className="d-flex justify-content-between flex-md-row flex-column pb-2">
        <div>
          <div className="d-flex mb-1">
            {renderUserImg("logo")}
            <h3 className="text-primary fw-bold ms-1">
              {setting?.companyName}
            </h3>
          </div>
          <p className="mb-25">{setting?.address}</p>
          <p className="mb-0">{setting?.phoneNumber}</p>
        </div>
        <div className="mt-md-0 mt-2">
          <h4 className="fw-bold text-end mb-1">
            {t("Invoice")} {` (${t(selectedInvoice?.type)})`}{" "}
            <span className="invoice-number">
              #{selectedInvoice?.invoicenumber}
            </span>
          </h4>
          <div className="invoice-date-wrapper mb-50">
            <span className="invoice-date-title">{t("Issued Date")}:</span>
            <span className="fw-bold">
              <MultiLingualDatePicker date={selectedInvoice?.issuedate} />
            </span>
          </div>
          <div className="invoice-date-wrapper">
            <span className="invoice-date-title">{t("Due Date")}:</span>
            <span className="fw-bold">
              <MultiLingualDatePicker date={selectedInvoice?.duedate} />
            </span>
          </div>
        </div>
      </div>

      <hr className="my-2" />

      <Row className="pb-2">
        <Col sm="6">
          <h6 className="mb-1">{t("Invoice To")}:</h6>
          <p className="mb-25">
            {selectedInvoice?.user?.firstName +
              " " +
              selectedInvoice?.user?.lastName}
          </p>
          <p className="mb-25"> {selectedInvoice?.user?.address}</p>
          <p className="mb-25">{selectedInvoice?.user?.phonenumber}</p>
          <p className="mb-25"> {selectedInvoice?.user?.mobilenumber}</p>
          <p className="mb-0"> {selectedInvoice?.user?.email}</p>
        </Col>
        <Col className="mt-sm-0 mt-2" sm="6">
          <h6 className="mb-1">{t("Payment Details")}:</h6>
          <table>
            <tbody>
              <tr>
                <td className="pe-1">{t("Total Due")}:</td>
                <td>
                  <strong> {thousandSeperator(selectedInvoice?.total)}</strong>
                </td>
              </tr>
              <tr>
                <td className="pe-1">{t("Shipping")}:</td>
                <td>{selectedInvoice?.order?.shipping?.title}</td>
              </tr>
              <tr>
                <td className="pe-1">{t("Discount")}:</td>
                <td>{selectedInvoice?.order?.coupon?.title}</td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>

      <Table className="mt-2 mb-0" responsive>
        <thead>
          <tr>
            <th className="py-1 ps-4">{t("Title")}</th>
            <th className="py-1">{t("Unit Price")}</th>
            <th className="py-1">{t("Quantity")}</th>
            <th className="py-1">{t("Total")}</th>
          </tr>
        </thead>
        <tbody>
          {selectedInvoice &&
            selectedInvoice.order?.items?.map((item, idx) => {
              return (
                <tr key={item.id}>
                  <td className="py-1">
                    <p className="card-text fw-bold mb-25">
                      {item.product?.title}
                    </p>
                    <p className="card-text text-nowrap">
                      {thousandSeperator(item.product?.price)}
                      {item.product.offprice &&
                        ` (${thousandSeperator(item.product.offprice)})`}
                    </p>
                  </td>
                  <td className="py-1">
                    <span className="fw-bold">
                      {thousandSeperator(item.price)}
                    </span>
                  </td>
                  <td className="py-1">
                    <span className="fw-bold">{item.quantity}</span>
                  </td>
                  <td className="py-1">
                    <span className="fw-bold">
                      {thousandSeperator(item.quantity * item.price)}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>

      <Row className="invoice-sales-total-wrapper mt-3">
        <Col className="mt-md-0 mt-3" md="6" order={{ md: 1, lg: 2 }}>
          <p className="mb-0">
            <span className="fw-bold">{t("Salesperson")}:</span>{" "}
            <span className="ms-75">{selectedInvoice?.salesperson}</span>
          </p>
        </Col>
        <Col
          className="d-flex justify-content-end"
          md="6"
          order={{ md: 2, lg: 1 }}
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
              <p className="invoice-total-title">{t("Shipping cost")}:</p>
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
              <p className="invoice-total-amount">{thousandSeperator(total)}</p>
            </div>
          </div>
        </Col>
      </Row>

      <hr className="my-2" />

      <Row>
        <Col sm="12">
          <span className="fw-bold">{t("Note")}: </span>
          <span>{selectedInvoice?.note}</span>
        </Col>
      </Row>
    </div>
  );
};

export default Print;
