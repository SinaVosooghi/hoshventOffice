// ** React Imports
import { useState } from "react";
import { useParams, Link } from "react-router-dom";

// ** Reactstrap Imports
import { Row, Col, Alert } from "reactstrap";

// ** User View Components
import UserTabs from "./Tabs";
import PlanCard from "./PlanCard";
import UserInfoCard from "./UserInfoCard";

// ** Styles
import "@styles/react/apps/app-users.scss";

import { useQuery } from "@apollo/client";

import { GET_ITEM_QUERY } from "../gql.js";
import { t } from "i18next";

const UserView = () => {
  // ** Store Vars
  const [selectedUser, setSelectedUser] = useState(null);

  // ** Hooks
  const { id } = useParams();

  const [active, setActive] = useState("1");

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  useQuery(GET_ITEM_QUERY, {
    variables: { id: parseInt(id) },
    fetchPolicy: "network-only",
    onCompleted: async ({ user }) => {
      if (user) {
        setSelectedUser(user);
      }
    },
  });

  return selectedUser !== null && selectedUser !== undefined ? (
    <div className="app-user-view">
      <Row>
        <Col xl="4" lg="5" xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <UserInfoCard selectedUser={selectedUser} />
        </Col>
        {/* <Col xl="8" lg="7" xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
          <UserTabs active={active} toggleTab={toggleTab} />
        </Col> */}
      </Row>
    </div>
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">{t("User not found")}</h4>
      <div className="alert-body">
        {t("User with id:")} {id} {t("doesn't exist. Check list of all Users:")}{" "}
        <Link to="/apps/user/list">{t("Users List")}</Link>
      </div>
    </Alert>
  );
};
export default UserView;
