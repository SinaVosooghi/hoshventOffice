// ** React Imports
import { Link } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Store & Actions
import { store } from "@store/store";
import { getUser } from "../store";
import { useMutation } from "@apollo/client";

// ** Icons Imports
import { Slack, User, Settings, Database, Edit2, Trash } from "react-feather";

// ** Reactstrap Imports
import { Badge } from "reactstrap";
import { t } from "i18next";
import moment from "moment";
import { DELETE_ITEM_MUTATION, GET_ITEMS_QUERY } from "../gql";
import { fallbackHandler } from "../../../../utility/helpers/fallbackhandler";
import { capitalizeFirstLetter } from "../../../../utility/Utils";

// ** Renders Client Columns
const renderClient = (row) => {
  return (
    <Avatar
      initials
      className="me-1"
      color={"light-primary"}
      content={row.firstName + " " + row.lastName || "John Doe"}
    />
  );
};

// ** Renders Role Columns
const renderRole = (row) => {
  const roleObj = {
    subscriber: {
      class: "text-primary",
      icon: User,
    },
    maintainer: {
      class: "text-success",
      icon: Database,
    },
    editor: {
      class: "text-info",
      icon: Edit2,
    },
    author: {
      class: "text-warning",
      icon: Settings,
    },
    admin: {
      class: "text-danger",
      icon: Slack,
    },
  };

  const Icon = roleObj[row.role] ? roleObj[row.role].icon : Edit2;

  return (
    <span className="text-truncate text-capitalize align-middle">
      <Link
        to={`/apps/roles/edit/${row.role.id}`}
        className="user_name text-truncate text-body"
      >
        <Icon
          size={18}
          className={`${
            roleObj[row.role] ? roleObj[row.role].class : ""
          } me-50`}
        />
        {row.role.title}
      </Link>
    </span>
  );
};

export const columns = [
  {
    name: t("User"),
    sortable: true,
    minWidth: "300px",
    sortField: "fullName",
    selector: (row) => row.firstName,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderClient(row)}
        <div className="d-flex flex-column">
          <Link
            to={`/apps/user/view/${row.id}`}
            className="user_name text-truncate text-body"
            onClick={() => store.dispatch(getUser(row.id))}
          >
            <span className="fw-bolder">
              {row.firstName + " " + row.lastName}{" "}
            </span>
          </Link>
          <small className="text-truncate text-muted mb-0">{row.email}</small>
        </div>
      </div>
    ),
  },
  {
    name: t("Role"),
    sortable: true,
    minWidth: "172px",
    sortField: "role",
    selector: (row) => row.role,
    cell: (row) => renderRole(row),
  },
  {
    name: t("Type"),
    sortable: true,
    minWidth: "172px",
    sortField: "usetype",
    selector: (row) => row.usetype,
    cell: (row) => (
      <span className="text-capitalize">
        {t(capitalizeFirstLetter(row.usertype))}
      </span>
    ),
  },
  {
    name: t("Updated"),
    sortable: true,
    sortField: "updated",
    selector: (row) => row.updated,
    cell: (row) => (
      <span className="text-capitalize">
        {row.updated ? moment(row.updated).format("YYYY/MM/D") : "-"}
      </span>
    ),
  },
  {
    name: t("Created"),
    sortable: true,
    sortField: "created",
    selector: (row) => row.created,
    cell: (row) => (
      <span className="text-capitalize">
        {row.created ? moment(row.created).format("YYYY/MM/D") : "-"}
      </span>
    ),
  },
  {
    name: t("Status"),
    sortable: true,
    minWidth: "138px",
    sortField: "status",
    selector: (row) => row.status,
    cell: (row) => (
      <span className="text-capitalize">
        <Badge
          className="text-capitalize"
          color={!row.status ? "light-danger" : "light-success"}
          pill
        >
          {row.status ? t("Active") : t("Deactive")}
        </Badge>
      </span>
    ),
  },
  {
    name: t("Actions"),
    width: "150px",
    cell: (row) => {
      const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, {
        ...fallbackHandler("delete"),
      });

      return (
        <>
          <Link to={`/apps/user/view/${row.id}`}>
            <Edit2 className="font-medium-3 text-body" />
          </Link>
          <Link
            className="ms-1"
            to={"#"}
            onClick={(e) => {
              e.preventDefault();
              if (confirm(t("Do you want to delete?"))) {
                deleteItem({
                  variables: { id: row.id },
                  refetchQueries: [GET_ITEMS_QUERY],
                });
              }
            }}
          >
            <Trash className="font-medium-3 text-body" />
          </Link>
        </>
      );
    },
  },
];
