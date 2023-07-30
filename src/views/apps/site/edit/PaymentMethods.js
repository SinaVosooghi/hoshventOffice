// ** React Imports
import { Fragment } from "react";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
} from "reactstrap";

// ** Third Party Components
import classnames from "classnames";
import Cleave from "cleave.js/react";
import { Controller } from "react-hook-form";

import { t } from "i18next";

const PaymentMethods = ({ errors, control }) => {
  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">{t("Payment Details")}</CardTitle>
        </CardHeader>
        <CardBody className="my-1 py-25">
          <Row className="gx-4">
            <Col lg="6">
              <Row className="gx-2 gy-1">
                <Fragment>
                  <Col xs={12}>
                    <Label className="form-label" for="cardnumber">
                      {t("Card Number")}
                    </Label>
                    <Controller
                      id="cardnumber"
                      name="cardnumber"
                      control={control}
                      render={({ field }) => (
                        <Cleave
                          {...field}
                          name="cardnumber"
                          className={classnames("form-control", {
                            "is-invalid": errors.cardnumber,
                          })}
                          placeholder="1356 3215 6548 7898"
                          options={{
                            creditCard: true,
                          }}
                        />
                      )}
                    />
                  </Col>
                  <Col xs={12}>
                    <Label className="form-label" for="sheba">
                      {t("Sheba")}
                    </Label>
                    <Controller
                      id="sheba"
                      name="sheba"
                      control={control}
                      render={({ field }) => (
                        <Cleave
                          {...field}
                          name="sheba"
                          className={classnames("form-control", {
                            "is-invalid": errors.sheba,
                          })}
                          placeholder="IR12317256341562341652"
                        />
                      )}
                    />
                  </Col>

                  <Col className="mt-2 pt-1" xs={12}>
                    <Button color="success" className="me-1" type="submit">
                      {t("Update")}
                    </Button>
                    <Button color="secondary" outline>
                      {t("Discard")}
                    </Button>
                  </Col>
                </Fragment>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default PaymentMethods;
