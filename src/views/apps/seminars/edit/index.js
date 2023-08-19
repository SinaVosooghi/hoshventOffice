// ** Invoice Add Components
import EditCard from "./EditCard";

// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/base/pages/app-invoice.scss";
import Attendees from "../../../extensions/import-export/Attendees";
import { GET_ITEM_QUERY } from "../gql";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

const Edit = () => {
  const { type, id } = useParams();

  useQuery(GET_ITEM_QUERY, {
    variables: { id: parseInt(id) },
    fetchPolicy: "network-only",
    onCompleted: async ({ seminar }) => {
      if (seminar) {
        console.log(seminar);
      }
    },
  });

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
