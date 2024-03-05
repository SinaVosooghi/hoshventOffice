// ** React Imports
import { Link } from "react-router-dom";

import { Trash, Edit, Search } from "react-feather";

// ** Reactstrap Imports
import { Badge, Button } from "reactstrap";
import { DELETE_ITEM_MUTATION, GET_ITEMS_QUERY } from "../gql";
import { useMutation } from "@apollo/client";
import { fallbackHandler } from "../helpers";
import moment from "jalali-moment";
import { t } from "i18next";

export const columns = [
  {
    name: "نام",
    sortable: true,
    minWidth: "300px",
    sortField: "name",
    selector: (row) => row.name,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
          <Link
            target="_blank"
            to={`/contacts/edit/${row.id}`}
            className="user_name text-truncate text-body"
          >
            <span className="fw-bolder">{row.name}</span>
          </Link>
        </div>
      </div>
    ),
  },
  {
    name: "ایمیل",
    sortable: true,
    minWidth: "172px",
    sortField: "email",
    selector: (row) => row.email,
    cell: (row) => <span>{row.email}</span>,
  },
  {
    name: "پیام",
    sortable: true,
    minWidth: "172px",
    sortField: "description",
    selector: (row) => row.body,
    cell: (row) => (
      <span>{row.body.substring(0, 50).concat("...")}</span>
    ),
  },

  {
    name: "ثبت",
    width: "110px",
    sortable: true,
    sortField: "created",
    selector: (row) => row.created,
    cell: (row) => (
      <span className="text-capitalize">
        {moment(row.created).locale("fa").format("YYYY/MM/D")}
      </span>
    ),
  },
  {
    name: t("Actions"),
    width: "185px",
    cell: (row) => {
      const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, {
        ...fallbackHandler("delete"),
      });

      return (
        <>
          <Link to={`/contacts/edit/${row.id}`}>
            <Button color="primary" outline size="sm">
              {t("View")}
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
