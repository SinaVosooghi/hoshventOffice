// ** User List Component
import Table from "./Table";

// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Custom Components
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal";

// ** Icons Imports
import { User, UserPlus, UserCheck, UserX } from "react-feather";

// ** Styles
import "@styles/react/apps/app-users.scss";
import { GET_ITEMS_QUERY, ITEM_NAME } from "../gql";
import { t } from "i18next";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useParams } from "react-router-dom";

const UsersList = () => {
  const [total, setTotal] = useState(0);
  const [lecturers, setLecturers] = useState(0);
  const [judges, setJudges] = useState(0);
  const [merchants, setMerchants] = useState(0);
  const { type } = useParams();

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 5,
        skip: 0,
      },
    },
    onCompleted: ({ users }) => {
      setTotal(users.count);
    },
  });

  useQuery(GET_ITEMS_QUERY, {
    variables: {
      input: {
        skip: 0,
        usertype: "tenant",
      },
    },
    onCompleted: ({ users }) => setMerchants(users.count),
  });

  useQuery(GET_ITEMS_QUERY, {
    variables: {
      input: {
        skip: 0,
        usertype: "lecturer",
      },
    },
    onCompleted: ({ users }) => setLecturers(users.count),
  });

  useQuery(GET_ITEMS_QUERY, {
    variables: {
      input: {
        skip: 0,
        usertype: "instructor",
      },
    },
    onCompleted: ({ users }) => setJudges(users.count),
  });

  return (
    <div className="app-user-list">
      <Row>
        {type !== "teacher" && (
          <>
            <Col lg="3" sm="6">
              <StatsHorizontal
                color="primary"
                statTitle={`${t("Total")} ${t(ITEM_NAME)}`}
                icon={<User size={20} />}
                renderStats={<h3 className="fw-bolder mb-75">{total}</h3>}
              />
            </Col>
            <Col lg="3" sm="6">
              <StatsHorizontal
                color="success"
                statTitle={`${t("Total")} ${t("Instructor")}`}
                icon={<UserCheck size={20} />}
                renderStats={<h3 className="fw-bolder mb-75">{judges}</h3>}
              />
            </Col>
            <Col lg="3" sm="6">
              <StatsHorizontal
                color="warning"
                statTitle={`${t("Total")} ${t("Lecturers")}`}
                icon={<UserX size={20} />}
                renderStats={<h3 className="fw-bolder mb-75">{lecturers}</h3>}
              />
            </Col>
          </>
        )}
        <Col lg="3" sm="6">
          <StatsHorizontal
            color="danger"
            statTitle={`${t("Total")} ${t("Merchants")}`}
            icon={<UserPlus size={20} />}
            renderStats={<h3 className="fw-bolder mb-75">{merchants}</h3>}
          />
        </Col>
      </Row>
      <Table />
    </div>
  );
};

export default UsersList;
