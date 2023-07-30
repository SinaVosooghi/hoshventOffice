// ** React Imports
import { Link, useParams } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Reactstrap Imports
import { Badge, Button } from "reactstrap";

// ** Third Party Components
import { Trash, Edit2 } from "react-feather";
import { t } from "i18next";
import moment from "moment";
import { DELETE_ITEM_MUTATION, GET_ITEMS_QUERY } from "../gql";
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

  return row.image ? (
    <Avatar
      color={color}
      className="me-50"
      content={row.title ?? "John Doe"}
      img={`${import.meta.env.VITE_BASE_API}/${row.image}`}
    />
  ) : (
    <Avatar
      color={color}
      className="me-50"
      content={row?.title ?? "John Doe"}
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
      const name = row.title ? row.title : t("Title");
      const price = row.price ? row.price.toLocaleString() + " تومان" : "-";
      return (
        <Link to={`/apps/services/edit/${row.id}`}>
          <div className="d-flex justify-content-left align-items-center">
            {renderClient(row)}
            <div className="d-flex flex-column">
              <h6 className="user-name text-truncate mb-0">{name}</h6>
              <small className="text-truncate text-muted mb-0">{price}</small>
            </div>
          </div>
        </Link>
      );
    },
  },
  {
    name: t("Events"),
    sortable: true,
    minWidth: "150px",
    cell: (row) => {
      return row.events?.map((e) => (
        <Badge className="text-capitalize mx-50" color={"light-primary"} pill>
          {e.title}
        </Badge>
      ));
    },
  },
  {
    name: t("Updated"),
    sortable: true,
    sortField: "updated",
    width: "130px",
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
    width: "130px",
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
          <Link to={`/apps/services/edit/${row.id}`}>
            <Button color="primary" outline size="sm">
              {t("Edit")}
            </Button>{" "}
          </Link>
          <Link
            className="ms-50"
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
            </Button>{" "}
          </Link>
        </>
      );
    },
  },
];
