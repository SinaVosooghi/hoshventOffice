// ** React Imports
import { Link, useParams } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Reactstrap Imports
import { Badge, Button } from "reactstrap";

// ** Third Party Components
import { Trash, Edit2 } from "react-feather";
import { t } from "i18next";
import moment from "jalali-moment";
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
      content={row.firstName + " " + row.lastName ?? "John Doe"}
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
      const type = row.price;
      return (
        <Link to={`/apps/workshops/edit/${row.id}`}>
          <div className="d-flex justify-content-left align-items-center">
            {renderClient(row)}
            <div className="d-flex flex-column">
              <h6 className="user-name text-truncate mb-0">{name}</h6>
              <small className="text-truncate text-muted mb-0">
                {type && type.toLocaleString() + " تومان"}
              </small>
            </div>
          </div>
        </Link>
      );
    },
  },
  {
    name: t("Scans"),
    sortable: true,
    minWidth: "150px",
    cell: (row) => {
      return (
        <span>
          {row.scans?.length ?? "-"} از {row?.capacity ?? "∞"}
        </span>
      );
    },
  },
  {
    name: t("Hall"),
    sortable: true,
    minWidth: "150px",
    cell: (row) => {
      return <span>{row.hall?.title ?? "-"}</span>;
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
        {row.updated
          ? moment(row?.updated).locale("fa").format("YYYY/MM/D")
          : "-"}
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
        {row.created
          ? moment(row?.created).locale("fa").format("YYYY/MM/D")
          : "-"}
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
    name: t("Featured"),
    sortable: true,
    width: "110px",
    sortField: "featured",
    selector: (row) => row.featured,
    cell: (row) => (
      <span className="text-capitalize">
        <Badge
          className="text-capitalize"
          color={!row.featured ? "light-danger" : "light-success"}
          pill
        >
          {row.featured ? t("Active") : t("Deactive")}
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
      const { type } = useParams();

      return (
        <>
          <Link to={`/apps/workshops/edit/${row.id}`}>
            <Button color="primary" outline size="sm">
              {t("Edit")}
            </Button>{" "}
          </Link>
          <Button
            color="danger"
            outline
            size="sm"
            style={{ marginRight: 8 }}
            onClick={(e) => {
              if (confirm(t("Do you want to delete?"))) {
                deleteItem({
                  variables: { id: row.id },
                  refetchQueries: [GET_ITEMS_QUERY],
                });
              }
            }}
          >
            {t("Remove")}
          </Button>{" "}
        </>
      );
    },
  },
];
