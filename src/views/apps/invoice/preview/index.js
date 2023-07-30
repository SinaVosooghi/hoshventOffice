// ** React Imports
import { useState } from "react";
import { useParams, Link } from "react-router-dom";

// ** Reactstrap Imports
import { Row, Col, Alert } from "reactstrap";

// ** Invoice Preview Components
import PreviewCard from "./PreviewCard";
import SendInvoiceSidebar from "../shared-sidebar/SidebarSendInvoice";

// ** Styles
import "@styles/base/pages/app-invoice.scss";
import { useQuery } from "@apollo/client";
import { GET_ITEM_QUERY } from "../gql";
import { t } from "i18next";

const InvoicePreview = () => {
  // ** HooksVars
  const { id } = useParams();

  // ** Store Vars
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // ** States
  const [sendSidebarOpen, setSendSidebarOpen] = useState(false);

  // ** Functions to toggle add & send sidebar
  const toggleSendSidebar = () => setSendSidebarOpen(!sendSidebarOpen);

  // ** Get invoice on mount based on id
  useQuery(GET_ITEM_QUERY, {
    variables: { id: parseInt(id), read: true },
    fetchPolicy: "network-only",
    onCompleted: async ({ invoice }) => {
      if (invoice) {
        setSelectedInvoice(invoice);
      }
    },
  });

  return selectedInvoice !== null && selectedInvoice !== undefined ? (
    <div className="invoice-preview-wrapper">
      <Row className="invoice-preview">
        <Col xl={12} md={12} sm={12}>
          <Row>
            <PreviewCard
              selectedInvoice={selectedInvoice}
              toggleSendSidebar={toggleSendSidebar}
            />
          </Row>
        </Col>
      </Row>
      <SendInvoiceSidebar
        selectedInvoice={selectedInvoice}
        toggleSidebar={toggleSendSidebar}
        open={sendSidebarOpen}
      />
    </div>
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">{t("Invoice not found")}</h4>
      <div className="alert-body">
        {t("Invoice with id:")} {id}{" "}
        {t("doesn't exist. Check list of all invoices:")}{" "}
        <Link to="/apps/invoices">{t("Invoice List")}</Link>
      </div>
    </Alert>
  );
};

export default InvoicePreview;
