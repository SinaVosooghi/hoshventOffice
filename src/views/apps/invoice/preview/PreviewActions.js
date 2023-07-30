// ** React Imports
import { t } from "i18next";
import { Link } from "react-router-dom";

// ** Reactstrap Imports
import { Card, CardBody, Button } from "reactstrap";

const PreviewActions = ({ selectedInvoice, toggleSendSidebar }) => {
  return (
    <Card className="invoice-action-wrapper">
      <CardBody>
        <Button
          color="primary"
          block
          className="mb-75"
          onClick={() => toggleSendSidebar(true)}
        >
          {t("Send Invoice")}
        </Button>
        <Button
          color="secondary"
          tag={Link}
          to={`/apps/invoice/print/${selectedInvoice.id}`}
          target="_blank"
          block
          outline
          className="mb-75"
        >
          {t("Print")}
        </Button>
        <Button
          tag={Link}
          to={`/apps/invoice/edit/${selectedInvoice.id}`}
          color="secondary"
          block
          outline
          className="mb-75"
        >
          {t("Edit")}
        </Button>
      </CardBody>
    </Card>
  );
};

export default PreviewActions;
