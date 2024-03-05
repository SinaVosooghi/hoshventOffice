// ** React Imports
import { t } from "i18next";
import { Fragment, useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Link } from "react-router-dom";

// ** Reactstrap Imports
import { Card, CardBody, Button, Input } from "reactstrap";
import { getShippingsSelect } from "../../../../utility/gqlHelpers/getShippings";
import classnames from "classnames";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import moment from "jalali-moment";
import MultiLingualDatePicker from "../../../../utility/helpers/datepicker/MultiLingualDatePicker";

const EditActions = ({
  id,
  setSendSidebarOpen,
  control,
  setDonePayment,
  donePayment,
  setShipping,
  setInvoiceType,
  invoiceType,
  selectedInvoice,
}) => {
  const [shippings, setShippings] = useState([]);

  const shippingsData = getShippingsSelect();

  useEffect(() => {
    if (shippingsData.length) {
      setShippings(shippingsData);
    }
  }, [shippingsData]);

  return (
    <Fragment>
      <Card className="invoice-action-wrapper">
        <CardBody>
          <div className="mb-2">
            <div className="invoice-payment-option">
              <p className="mb-50">{t("Information")}</p>
            </div>
            <div className="invoice-terms mt-1">
              <div className="d-flex justify-content-between">
                <label className="cursor-pointer mb-0" htmlFor="payment-terms">
                  {t("Created")}:
                </label>
                <div className="form-switch">
                  {selectedInvoice?.created ? (
                    <MultiLingualDatePicker
                      date={selectedInvoice?.created}
                      withTime
                    />
                  ) : (
                    "-"
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-between py-1">
                <label className="cursor-pointer mb-0" htmlFor="payment-terms">
                  {t("Updated")}:
                </label>
                <div className="form-switch">
                  {selectedInvoice?.updated ? (
                    <MultiLingualDatePicker
                      date={selectedInvoice?.created}
                      withTime
                    />
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="invoice-payment-option">
            <p className="mb-50">{t("Select invoice type")}</p>
            <Input
              type="select"
              id="invoice-type-select"
              onChange={(e) => setInvoiceType(e.target.value)}
              defaultValue={invoiceType}
            >
              <option value="shop">{t("Product")}</option>
              <option value="course">{t("Course")}</option>
            </Input>
          </div>
          <Button
            color="primary"
            block
            className="mb-75 mt-1"
            onClick={() => setSendSidebarOpen(true)}
          >
            {t("Send Invoice")}
          </Button>
          <Button
            tag={Link}
            to={`/apps/invoice/preview/${id}`}
            color="primary"
            block
            outline
            className="mb-75"
          >
            {t("Preview")}
          </Button>
          <Button color="success" block className="mb-75" type="submit">
            {t("Save")}
          </Button>
        </CardBody>
      </Card>
      <div className="mt-2">
        {invoiceType === "shop" && (
          <div className="invoice-payment-option">
            <p className="mb-50">{t("Select shipping method")}</p>
            {shippings !== null ? (
              <>
                <Controller
                  name="shipping"
                  control={control}
                  render={({ field }) => (
                    <Select
                      classNamePrefix="select"
                      options={shippings}
                      theme={selectThemeColors}
                      placeholder={`${t("Select")} ${t("Shipping")}...`}
                      className={classnames("react-select")}
                      onChange={(e) => {
                        setShipping(e);
                      }}
                      {...field}
                    />
                  )}
                />
              </>
            ) : null}
          </div>
        )}
        <div className="invoice-payment-option mt-1">
          <p className="mb-50">{t("Select payment type")}</p>
          <Controller
            name="paymenttype"
            control={control}
            defaultValue={"online"}
            render={({ field }) => (
              <Input
                type="select"
                id="payment-select"
                disabled={donePayment}
                {...field}
              >
                <option value="online">{t("Online payment")}</option>
                <option value="delivery">{t("Cash on delivery")}</option>
              </Input>
            )}
          />
        </div>
        <div className="invoice-terms mt-1">
          <div className="d-flex justify-content-between">
            <label className="cursor-pointer mb-0" htmlFor="payment-terms">
              {t("Done payment")}
            </label>
            <div className="form-switch">
              <Input
                type="switch"
                id="payment-terms"
                onChange={(e) => {
                  setDonePayment(e.target.checked);
                }}
                checked={donePayment}
                defaultChecked={donePayment}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditActions;
