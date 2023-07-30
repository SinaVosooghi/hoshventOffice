// ** User List Component
import Table from "./Table";

// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Custom Components
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal";

// ** Icons Imports
import { User, UserPlus, UserCheck, UserX, Image } from "react-feather";
import { useQuery } from "@apollo/client";
import { FA_ITEM_NAME, GET_ITEMS_QUERY } from "../gql";

// ** Styles
import "@styles/react/apps/app-users.scss";
import { useParams } from "react-router-dom";
import { t } from "i18next";

const Sliders = () => {
  const { type } = useParams();
  const { data: getContacts } = useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: { skip: 0, type },
    },
  });

  return (
    <div className="app-user-list">
      <Row>
        <Col lg="3" sm="6">
          <StatsHorizontal
            color="primary"
            statTitle={t("Contacts")}
            icon={<Image size={20} />}
            renderStats={
              <h3 className="fw-bolder mb-75">
                {getContacts?.contacts.count}
              </h3>
            }
          />
        </Col>
      </Row>
      <Table />
    </div>
  );
};

export default Sliders;
