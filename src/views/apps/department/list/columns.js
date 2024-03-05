// ** React Imports
import { Link, useParams } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Reactstrap Imports
import { Badge } from "reactstrap";

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
      const name = row.title ? row.title : t("Title");
      const type = row.type ?? "Type";
      return (
        <Link to={`/apps/departments/edit/${row.id}`}>
          <div className="d-flex justify-content-left align-items-center">
            {renderClient(row)}
            <div className="d-flex flex-column">
              <h6 className="user-name text-truncate mb-0">{name}</h6>
            </div>
          </div>
        </Link>
      );
    },
  },
  {
    name: t("Updated"),
    sortable: true,
    sortField: "updated",
    selector: (row) => row.updated,
    cell: (row) => (
      <span className="text-capitalize">
        {row.updated ? moment(row?.updated).locale("fa").format("YYYY/MM/D") : "-"}
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
        {row.created ? moment(row?.created).locale("fa").format("YYYY/MM/D") : "-"}
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
      const { type } = useParams();

      return (
        <>
          <Link to={`/apps/departments/edit/${row.id}`}>
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
