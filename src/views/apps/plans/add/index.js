// ** Invoice Add Components
import AddCard from "./AddCard";
import AddActions from "./AddActions";

// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/base/pages/app-invoice.scss";

const InvoiceAdd = () => {
  return (
    <div className="invoice-add-wrapper">
      <Row className="invoice-add">
        <Col xl={12} md={12} sm={12}>
          <Row>
            <AddCard />
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default InvoiceAdd;
