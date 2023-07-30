// ** Reactstrap Imports
import { Card, CardBody, CardText, Button } from "reactstrap";

// ** Images
import medal from "@src/assets/images/illustration/badge.svg";
import { thousandSeperator } from '@utils'
import { t } from "i18next";
import { useEffect, useState } from "react";

const CardMedal = ({ user, invoices }) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (invoices && invoices.length > 0) {
      setTotal(invoices.reduce((n, { total }) => n + total, 0));
    }
  }, [invoices]);

  return (
    <Card className="card-congratulations-medal">
      <CardBody>
        <h5>
          {t("Congratulations")} {user?.firstName + " " + user?.lastName} 🎉
        </h5>
        <CardText className="font-small-3">
          {t("View total sales history")}
        </CardText>
        <h3 className="mb-75 mt-2 pt-50">
          <a href="/" onClick={(e) => e.preventDefault()}>
            {thousandSeperator(total)}
          </a>
        </h3>
        <Button color="primary">{t("View sales")}</Button>
        <img className="congratulation-medal" src={medal} alt="Medal Pic" />
      </CardBody>
    </Card>
  );
};

export default CardMedal;
