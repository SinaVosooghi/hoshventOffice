// ** React Imports
import { Link } from "react-router-dom";

// ** Store & Actions
import { store } from "@store/store";
import { getUser } from "@src/views/apps/user/store";
import { t } from "i18next";
// ** Icons Imports
import { Edit2, Eye, Trash } from "react-feather";

// ** Reactstrap Imports
import { Badge, Button } from "reactstrap";
import { DELETE_ITEM_MUTATION, GET_ITEMS_QUERY } from "../gql";
import { fallbackHandler } from "../../../../utility/helpers/fallbackhandler";
import { useMutation } from "@apollo/client";
import moment from "jalali-moment";

export const columns = [
  {
    name: t("Title"),
    sortable: true,
    minWidth: "297px",
    sortField: "fullName",
    selector: (row) => row.title,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <Link
            to={`/apps/roles/edit/${row.id}`}
            className="user_name text-truncate text-body"
          >
            <span className="fw-bold">{row.title}</span>
          </Link>
          <small className="text-truncate text-muted mb-0">{row.email}</small>
        </div>
      </div>
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
        {row.updated
          ? moment(row.updated).locale("fa").format("YYYY/MM/D")
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
        {moment(row.created).locale("fa").format("YYYY/MM/D")}
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
          <Link to={`/apps/roles/edit/${row.id}`}>
            <Button color="primary" outline size="sm">
              {t("Edit")}
            </Button>{" "}
          </Link>
          <Link
            className="ms-1"
            to={"#"}
            onClick={(e) => {
              e.preventDefault();
              if (confirm("Do you want to delete?")) {
                deleteItem({
                  variables: { id: row.id },
                  refetchQueries: [GET_ITEMS_QUERY, "Getroles"],
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
