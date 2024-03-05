// ** Invoice Add Components
import EditCard from "./EditCard";

// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/base/pages/app-invoice.scss";
import ScansList from "../../scans/list";
import { useParams } from "react-router-dom";

const Edit = () => {
  const { id } = useParams();

  return (
    <div className="invoice-add-wrapper">
      <Row className="invoice-add" style={{ paddingBottom: 150 }}>
        <Col xl={12} md={12} sm={12}>
          <Row>
            <EditCard />
          </Row>
        </Col>
        <Col xl={12} md={12} sm={12}>
          <Row>
            <ScansList service={id} />
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Edit;
