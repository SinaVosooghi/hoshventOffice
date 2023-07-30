// ** React Imports
import { Link } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Reactstrap Imports
import { Badge, Button } from "reactstrap";

// ** Third Party Components
import { Trash, Edit2, Check } from "react-feather";
import { t } from "i18next";
import moment from "moment";
import {
  DELETE_ITEM_MUTATION,
  GET_ITEMS_QUERY,
  UPDATE_ITEM_MUTATION,
} from "../gql";
import { fallbackHandler } from "../../../../utility/helpers/fallbackhandler";
import { useMutation } from "@apollo/client";

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

  return (
    <Avatar
      color={color}
      className="me-50"
      content={row.client ? row.client.name : "John Doe"}
      initials
    />
  );
};

// ** Table columns
export const columns = [
  {
    name: t("Title"),
    sortable: true,
    minWidth: "350px",
    sortField: "client.name",
    // selector: row => row.client.name,
    cell: (row) => {
      return (
        <Link to={`/apps/comments/edit/${row.id}`}>
          <div className="d-flex justify-content-left align-items-center">
            {renderClient(row)}
            <div className="d-flex flex-column">
              <h6 className="user-name text-truncate mb-0">{t(row.type)}</h6>
            </div>
          </div>
        </Link>
      );
    },
  },
  {
    name: t("Title"),
    sortable: true,
    minWidth: "150px",
    sortField: "total",
    cell: (row) => (
      <Link to={`/apps/${row.type}s/edit/${row.id}`}>
        <span>
          {row.course?.title ?? row.blog?.title ?? row.product?.title}
        </span>
      </Link>
    ),
  },
  {
    name: t("User"),
    sortable: true,
    sortField: "total",
    cell: (row) => (
      <span>
        {row.user?.firstName ?? ""} {row.user?.lastName ?? ""}
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
        {row.updated ? moment(row?.updated).format("YYYY/MM/D") : "-"}
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
        {row.created ? moment(row?.created).format("YYYY/MM/D") : "-"}
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

      const [update] = useMutation(UPDATE_ITEM_MUTATION, {
        ...fallbackHandler("delete"),
      });

      return (
        <>
          <Link to={`/apps/comments/edit/${row.id}`}>
            <Button
              size="sm"
              outline
              onClick={(e) => {
                e.preventDefault();
                if (confirm(t("Do you want to update?"))) {
                  update({
                    variables: { input: { id: row.id, status: true } },
                    refetchQueries: [GET_ITEMS_QUERY],
                  });
                }
              }}
            >
              {t("Confirm")}{" "}
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
            <Trash className="font-medium-3 text-body" />
          </Link>
        </>
      );
    },
  },
];
