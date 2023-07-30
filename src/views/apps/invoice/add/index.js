// ** Invoice Add Components
import AddCard from "./AddCard";
import AddActions from "./AddActions";

// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/base/pages/app-invoice.scss";
import SidebarSendInvoice from "../shared-sidebar/SidebarSendInvoice";
import { useState } from "react";

const InvoiceAdd = () => {
  const [sendSidebarOpen, setSendSidebarOpen] = useState(false);
  const toggleSendSidebar = () => setSendSidebarOpen(!sendSidebarOpen);

  return (
    <div className="invoice-add-wrapper">
      <Row className="invoice-add">
        <Col xl={12} md={12} sm={12}>
          <AddCard setSendSidebarOpen={setSendSidebarOpen} />
        </Col>
      </Row>
      <SidebarSendInvoice
        toggleSidebar={toggleSendSidebar}
        open={sendSidebarOpen}
      />
    </div>
  );
};

export default InvoiceAdd;
