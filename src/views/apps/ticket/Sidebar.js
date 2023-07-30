// ** React Imports
import { Link, useParams } from "react-router-dom";
import { useState } from "react";

// ** Third Party Components
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Mail, Plus, ChevronUp, ChevronDown, Minus } from "react-feather";

// ** Reactstrap Imports
import { Button, ListGroup, ListGroupItem, Badge } from "reactstrap";
import { t } from "i18next";

import { GET_ITEMS_QUERY } from "../department/gql";
import { useLazyQuery, useQuery } from "@apollo/client";

const Sidebar = (props) => {
  // ** Props
  const {
    store,
    chats,
    sidebarOpen,
    toggleCompose,
    dispatch,
    getMails,
    resetSelectedMail,
    setSidebarOpen,
    setOpenMail,
    setPriority,
    setDepartment,
  } = props;

  // ** Vars
  const params = useParams();
  const [departments, setDepartments] = useState(null);

  // ** Functions To Handle Folder, Label & Compose
  const handleFolder = (folder) => {
    setOpenMail(false);
    dispatch(getMails({ ...store.params, folder }));
    dispatch(resetSelectedMail());
  };

  const handleLabel = (label) => {
    setOpenMail(false);
    dispatch(getMails({ ...store.params, label }));
    dispatch(resetSelectedMail());
  };

  const handleComposeClick = () => {
    toggleCompose();
    setSidebarOpen(false);
  };

  // ** Functions To Active List Item
  const handleActiveItem = (value) => {
    if (
      (params.folder && params.folder === value) ||
      (params.label && params.label === value)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const { loading } = useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 10,
        skip: 0,
        status: true,
      },
    },
    onCompleted: ({ departments }) => {
      setDepartments(departments?.departments);
    },
    onError: () => {
      toast.error(t("Error on connection"));
    },
  });

  return (
    <div
      className={classnames("sidebar-left", {
        show: sidebarOpen,
      })}
    >
      <div className="sidebar">
        <div className="sidebar-content email-app-sidebar">
          <div className="email-app-menu">
            <div className="form-group-compose text-center compose-btn">
              <Button
                className="compose-email"
                color="primary"
                block
                onClick={handleComposeClick}
              >
                {t("Compose")} <Plus />
              </Button>
            </div>
            <PerfectScrollbar
              className="sidebar-menu-list"
              options={{ wheelPropagation: false }}
            >
              <ListGroup tag="div" className="list-group-messages">
                <ListGroupItem
                  tag={Link}
                  to="/apps/ticket"
                  onClick={() => handleFolder("inbox")}
                  action
                  active={
                    !Object.keys(params).length || handleActiveItem("inbox")
                  }
                >
                  <Mail size={18} className="me-75" />
                  <span className="align-middle">{t("Inbox")}</span>
                  <Badge className="float-end" color="light-primary" pill>
                    {chats?.chats?.count}
                  </Badge>
                  {/* ) : null} */}
                </ListGroupItem>
                <ListGroupItem
                  className="cursor-pointer"
                  onClick={() => setPriority("low")}
                  action
                >
                  <ChevronDown size={18} className="me-75" />
                  <span className="align-middle">{t("Low priority")}</span>{" "}
                  <Badge className="float-end" color="light-success" pill>
                    {
                      chats?.chats?.chats?.filter(
                        (chat) => chat.priority === "low"
                      ).length
                    }
                  </Badge>
                </ListGroupItem>
                <ListGroupItem
                  className="cursor-pointer"
                  onClick={() => setPriority("medium")}
                  action
                >
                  <Minus size={18} className="me-75" />
                  <span className="align-middle">{t("Medium priority")}</span>
                  <Badge className="float-end" color="light-warning" pill>
                    {
                      chats?.chats?.chats?.filter(
                        (chat) => chat.priority === "medium"
                      ).length
                    }
                  </Badge>
                </ListGroupItem>
                <ListGroupItem
                  className="cursor-pointer"
                  onClick={() => setPriority("high")}
                  action
                >
                  <ChevronUp size={18} className="me-75" />
                  <span className="align-middle">{t("High priority")}</span>
                  <Badge className="float-end" color="light-danger" pill>
                    {
                      chats?.chats?.chats?.filter(
                        (chat) => chat.priority === "high"
                      ).length
                    }
                  </Badge>
                </ListGroupItem>
              </ListGroup>
              <h6 className="section-label mt-3 mb-1 px-2">
                {t("Departments")}
              </h6>
              <ListGroup tag="div" className="list-group-labels">
                <ListGroupItem
                  tag={Link}
                  onClick={() => handleLabel("All")}
                  active={handleActiveItem("All")}
                  action
                >
                  <span className="bullet bullet-sm bullet-success me-1"></span>
                  {t("All")}
                </ListGroupItem>
                {departments &&
                  departments.map((department) => {
                    return (
                      <ListGroupItem
                        style={{ cursor: "pointer" }}
                        onClick={() => setDepartment(department.id)}
                        action
                      >
                        <span className="bullet bullet-sm bullet-success me-1"></span>
                        {department?.title}
                      </ListGroupItem>
                    );
                  })}
              </ListGroup>
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
