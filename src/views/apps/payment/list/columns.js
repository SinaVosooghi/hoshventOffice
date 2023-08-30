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
      content={row.user?.firstName + " " + row?.user?.lastName || "John Doe"}
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
      <Icon size={18} className={` me-50`} />
      {row.refid}
    </span>
  );
};

export const columns = [
  {
    name: t("User"),
    sortable: true,
    width: "300px",
    sortField: "fullName",
    selector: (row) => row.firstName,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderClient(row)}
        <div className="d-flex flex-column">
          <span className="fw-bolder">
            {row.user?.firstName + " " + row.user?.lastName}{" "}
          </span>
          <small className="text-truncate text-muted mb-0">{row.email}</small>
        </div>
      </div>
    ),
  },
  {
    name: t("Mobile"),
    sortable: true,
    minWidth: "172px",
    cell: (row) => {
      return row.user?.mobilenumber;
    },
  },
  {
    name: t("Total"),
    sortable: true,
    width: "162px",
    selector: (row) => row.amount,
    cell: (row) => (
      <>{row.amount ? row.amount?.toLocaleString() + " تومان " : ""}</>
    ),
  },
  {
    name: t("Status Code"),
    sortable: true,
    width: "90px",
    sortField: "statusCode",
    selector: (row) => row.statusCode,
    cell: (row) => <span className="text-capitalize">{row.statusCode}</span>,
  },
  {
    name: t("Code"),
    sortable: true,
    minWidth: "172px",
    sortField: "statusCode",
    selector: (row) => row.statusCode,
    cell: (row) => <span className="text-capitalize">{row.authority}</span>,
  },
  {
    name: t("Created"),
    sortable: true,
    sortField: "created",
    width: "120px",
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
    width: "138px",
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
    width: "80px",
    cell: (row) => {
      const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, {
        ...fallbackHandler("delete"),
      });

      return (
        <>
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
