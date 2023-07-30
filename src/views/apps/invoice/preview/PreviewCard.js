// ** Reactstrap Imports
import { useEffect, useState } from "react";
import { Card, CardBody, CardText, Row, Col, Table } from "reactstrap";
import { GET_ITEM_QUERY } from "../../setting/gql";
import Avatar from "@components/avatar";
import { useQuery } from "@apollo/client";
import { showImage, thousandSeperator } from "../../../../utility/Utils";
import { t } from "i18next";
import MultiLingualDatePicker from "../../../../utility/helpers/datepicker/MultiLingualDatePicker";
import PreviewActions from "./PreviewActions";
import useGetSetting from "../../../../utility/gqlHelpers/useGetSetting";

const PreviewCard = ({ selectedInvoice, toggleSendSidebar }) => {
  const setting = useGetSetting();
  const [subTotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(null);

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

  return selectedInvoice !== null ? (
    <>
      <Col xl={9} md={8} sm={12}>
        <Card className="invoice-preview-card">
          <CardBody className="invoice-padding pb-0">
            {/* Header */}
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
              <div className="mt-md-0 mt-2">
                <h4 className="invoice-title">
                  {t("Invoice")} {` (${t(selectedInvoice.type)})`}{" "}
                  <span className="invoice-number">
                    #{selectedInvoice?.invoicenumber}
                  </span>
                </h4>
                <div className="invoice-date-wrapper">
                  <p className="invoice-date-title">{t("Issued Date")}:</p>
                  <p className="invoice-date">
                    <MultiLingualDatePicker date={selectedInvoice?.issuedate} />
                  </p>
                </div>
                <div className="invoice-date-wrapper">
                  <p className="invoice-date-title">{t("Due Date")}:</p>
                  <p className="invoice-date">
                    <MultiLingualDatePicker date={selectedInvoice?.duedate} />
                  </p>
                </div>
              </div>
            </div>
            {/* /Header */}
          </CardBody>

          <hr className="invoice-spacing" />

          {/* Address and Contact */}
          <CardBody className="invoice-padding pt-0">
            <Row className="invoice-spacing">
              <Col className="p-0" xl="8">
                <h6 className="mb-2">{t("Invoice To")}:</h6>
                <h6 className="mb-25">
                  {selectedInvoice?.user?.firstName +
                    " " +
                    selectedInvoice?.user?.lastName}
                </h6>
                <CardText className="mb-25">
                  {selectedInvoice?.user?.address}
                </CardText>
                <CardText className="mb-25">
                  {selectedInvoice?.user?.phonenumber}
                </CardText>
                <CardText className="mb-25">
                  {selectedInvoice?.user?.mobilenumber}
                </CardText>
                <CardText className="mb-0">
                  {selectedInvoice?.user?.email}
                </CardText>
              </Col>
              <Col className="p-0 mt-xl-0 mt-2" xl="4">
                <h6 className="mb-2">{t("Payment Details")}:</h6>
                <table>
                  <tbody>
                    <tr>
                      <td className="pe-1">{t("Total Due")}:</td>
                      <td>
                        <span className="fw-bold">
                          {thousandSeperator(selectedInvoice?.total)}
                        </span>
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
                    {/*   <tr>
                  <td className="pe-1">IBAN:</td>
                  <td>{selectedInvoice?.paymentDetails.iban}</td>
                </tr>
                <tr>
                  <td className="pe-1">SWIFT code:</td>
                  <td>{selectedInvoice?.paymentDetails.swiftCode}</td>
                </tr> */}
                  </tbody>
                </table>
              </Col>
            </Row>
          </CardBody>
          {/* /Address and Contact */}

          {/* Invoice Description */}
          <Table responsive>
            <thead>
              <tr>
                <th className="py-1">{t("Title")}</th>
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
          {/* /Invoice Description */}

          {/* Total & Sales Person */}
          <CardBody className="invoice-padding pb-0">
            <Row className="invoice-sales-total-wrapper">
              <Col className="mt-md-0 mt-3" md="6" order={{ md: 1, lg: 2 }}>
                <CardText className="mb-0">
                  <span className="fw-bold">{t("Salesperson")}:</span>{" "}
                  <span className="ms-75">{selectedInvoice?.salesperson}</span>
                </CardText>
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
                    <p className="invoice-total-amount">
                      {thousandSeperator(total)}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </CardBody>
          {/* /Total & Sales Person */}

          <hr className="invoice-spacing" />

          {/* Invoice Note */}
          <CardBody className="invoice-padding pt-0">
            <Row>
              <Col sm="12">
                <span className="fw-bold">{t("Note")}: </span>
                <br />
                <br />
                <span>{selectedInvoice?.note}</span>
              </Col>
            </Row>
          </CardBody>
          {/* /Invoice Note */}
        </Card>
      </Col>
      <Col xl={3} md={4} sm={12}>
        <PreviewActions
          selectedInvoice={selectedInvoice}
          toggleSendSidebar={toggleSendSidebar}
        />
      </Col>
    </>
  ) : null;
};

export default PreviewCard;
