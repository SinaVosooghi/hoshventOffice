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
import PaymentList from "./paymentList";

const UsersList = () => {
  const [total, setTotal] = useState(0);
  const [teachers, setTeachers] = useState(0);
  const [students, setStudents] = useState(0);
  const [admins, setAdmins] = useState(0);
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
      let a = 0; // Stands for admins count
      let t = 0; // Stands for Teachers count
      let s = 0; // Stands for Students count

      users?.users?.map((user) => {
        if (user.usertype === "admin") a += 1;
        if (user.usertype === "teacher") t += 1;
        if (user.usertype === "student") s += 1;
      });

      setTeachers(t);
      setStudents(s);
      setAdmins(a);
    },
  });

  return (
    <div className="app-user-list">
      <Row>
        {type !== "teacher" && (
          <>
            <Col lg="3" sm="6">
              <StatsHorizontal
                color="primary"
                statTitle={`${t("Total")} ${t("Payments")}`}
                icon={<User size={20} />}
                renderStats={<h3 className="fw-bolder mb-75">{total}</h3>}
              />
            </Col>
            <Col lg="3" sm="6">
              <StatsHorizontal
                color="success"
                statTitle={`${t("Total")} ${t("Students")}`}
                icon={<UserCheck size={20} />}
                renderStats={<h3 className="fw-bolder mb-75">{students}</h3>}
              />
            </Col>
            <Col lg="3" sm="6">
              <StatsHorizontal
                color="warning"
                statTitle={`${t("Total")} ${t("Admins")}`}
                icon={<UserX size={20} />}
                renderStats={<h3 className="fw-bolder mb-75">{admins}</h3>}
              />
            </Col>
          </>
        )}
        <Col lg="3" sm="6">
          <StatsHorizontal
            color="danger"
            statTitle={`${t("Total")} ${t("Teachers")}`}
            icon={<UserPlus size={20} />}
            renderStats={<h3 className="fw-bolder mb-75">{teachers}</h3>}
          />
        </Col>
      </Row>
      <PaymentList />
    </div>
  );
};

export default UsersList;
