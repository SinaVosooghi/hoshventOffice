// ** Invoice Add Components
import EditCard from "./EditCard";

// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/base/pages/app-invoice.scss";

const Edit = () => {
  return (
    <div className="invoice-add-wrapper">
      <Row className="invoice-add">
        <Col xl={12} md={12} sm={12}>
          <Row>
            <EditCard />
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Edit;
