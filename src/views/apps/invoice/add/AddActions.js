// ** React Imports
import { t } from "i18next";
import { Fragment, useEffect, useState } from "react";
import classnames from "classnames";
import Select from "react-select";
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import { Card, CardBody, Button, Input } from "reactstrap";
import { getShippingsSelect } from "../../../../utility/gqlHelpers/getShippings";
import { Controller } from "react-hook-form";

const AddActions = ({
  control,
  setDonePayment,
  donePayment,
  setShipping,
  setInvoiceType,
  invoiceType,
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
          <div className="invoice-payment-option">
            <p className="mb-50">{t("Select invoice type")}</p>
            <Input
              type="select"
              id="invoice-type-select"
              onChange={(e) => setInvoiceType(e.target.value)}
              defaultValue={invoiceType}
            >
              <option value="shop">{t("Product")}</option>
              <option value="service">{t("Service")}</option>
            </Input>
          </div>
          <Button
            type="submit"
            color="primary"
            block
            outline
            onClick={() => alert(2)}
            className="mb-75 mt-1"
          >
            {t("Preview")}
          </Button>
          <Button color="primary" block outline type="submit">
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
                      {...field}
                      onChange={(e) => {
                        setShipping(e);
                      }}
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
                value={donePayment}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AddActions;
