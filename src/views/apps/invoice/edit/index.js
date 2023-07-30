// ** React Imports
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// ** Third Party Components
import axios from "axios";

// ** Reactstrap Imports
import { Alert, Row, Col } from "reactstrap";

// ** Invoice Edit Components
import EditCard from "./EditCard";
import EditActions from "./EditActions";
import SendInvoiceSidebar from "../shared-sidebar/SidebarSendInvoice";
import AddPaymentSidebar from "../shared-sidebar/SidebarAddPayment";
import { useQuery } from "@apollo/client";
import { GET_ITEM_QUERY } from "../gql";

const InvoiceEdit = () => {
  // ** Hooks
  const { id } = useParams();

  // ** States
  const [sendSidebarOpen, setSendSidebarOpen] = useState(false);
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // ** Functions to toggle add & send sidebar
  const toggleSendSidebar = () => setSendSidebarOpen(!sendSidebarOpen);
  const toggleAddSidebar = () => setAddPaymentOpen(!addPaymentOpen);

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
    <div className="invoice-edit-wrapper">
      <Row className="invoice-edit">
        <Col xl={12} md={12} sm={12}>
          <EditCard
            selectedInvoice={selectedInvoice}
            toggleSendSidebar={toggleSendSidebar}
          />
        </Col>
      </Row>
      <SendInvoiceSidebar
        toggleSidebar={toggleSendSidebar}
        open={sendSidebarOpen}
      />
      <AddPaymentSidebar
        toggleSidebar={toggleAddSidebar}
        open={addPaymentOpen}
      />
    </div>
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Invoice not found</h4>
      <div className="alert-body">
        Invoice with id: {id} doesn't exist. Check list of all invoices:{" "}
        <Link to="/apps/invoice/list">Invoice List</Link>
      </div>
    </Alert>
  );
};

export default InvoiceEdit;
