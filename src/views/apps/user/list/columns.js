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
import { Badge, Button } from "reactstrap";
import { t } from "i18next";
import moment from "jalali-moment";
import { DELETE_ITEM_MUTATION, GET_ITEMS_QUERY } from "../gql";
import { fallbackHandler } from "../../../../utility/helpers/fallbackhandler";
import { capitalizeFirstLetter } from "../../../../utility/Utils";

// ** renders client column
const renderClient = (row) => {
  const stateNum = Math.floor(Math.random() * 6),
    states = [
      "light-success",
      "light-danger",
      "light-warning",
      "light-info",
      "light-primary",
      "light-secondary",
    ],
    color = states[stateNum];

  return row.avatar ? (
    <Avatar
      color={color}
      className="me-50"
      content={row.title ?? "John Doe"}
      img={`${import.meta.env.VITE_BASE_API}/${row.avatar}`}
    />
  ) : (
    <Avatar
      color={color}
      className="me-50"
      content={row.firstName + " " + row.lastName ?? "John Doe"}
      initials
    />
  );
};

// ** Renders Role Columns
const renderRole = (row) => {
  if (!row.role) return <>-</>;
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
        to={`/apps/roles/edit/${row.role?.id}`}
        className="user_name text-truncate text-body"
      >
        <Icon
          size={18}
          className={`${
            roleObj[row.role] ? roleObj[row.role].class : ""
          } me-50`}
        />
        {row.role?.title}
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
    name: t("Category"),
    sortable: true,
    minWidth: "172px",
    sortField: "usetype",
    cell: (row) => (
      <span className="text-capitalize">
        {row?.category?.title}
      </span>
    ),
  },
  {
    name: t("Updated"),
    sortable: true,
    sortField: "updated",
    width: "130px",
    selector: (row) => row.updated,
    cell: (row) => (
      <span className="text-capitalize">
        {row.updated ? moment(row.updated).locale("fa").format("YYYY/MM/D") : "-"}
      </span>
    ),
  },
  {
    name: t("Created"),
    sortable: true,
    sortField: "created",
    width: "130px",
    selector: (row) => row.created,
    cell: (row) => (
      <span className="text-capitalize">
        {row.created ? moment(row.created).locale("fa").format("YYYY/MM/D") : "-"}
      </span>
    ),
  },
  {
    name: t("Status"),
    sortable: true,
    width: "110px",
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
    width: "200px",
    cell: (row) => {
      const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, {
        ...fallbackHandler("delete"),
      });

      return (
        <>
          <Link to={`/apps/user/view/${row.id}`}>
            <Button color="primary" outline size="sm">
              {t("Edit")}
            </Button>
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
            <Button color="danger" outline size="sm">
              {t("Remove")}
            </Button>
          </Link>
        </>
      );
    },
  },
];
