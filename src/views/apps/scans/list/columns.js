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
      content={row.title ?? "John Doe"}
      initials
    />
  );
};

// ** Table columns
export const columns = [
  {
    name: t("User"),
    sortable: true,
    width: "150px",
    cell: (row) => {
      return (
        <p className="text-capitalize mx-50" color={"light-primary"}>
          {row?.user?.firstName + " " + row?.user?.lastName}
        </p>
      );
    },
  },
  {
    name: t("Title"),
    sortable: true,
    maxWidth: "300px",
    sortField: "client.name",
    // selector: row => row.client.name,
    cell: (row) => {
      const name =
        row?.workshop?.title ?? row?.seminar?.title ?? row?.service?.title;
      const slug = row.slug;
      return (
        <div className="d-flex justify-content-left align-items-center">
          {renderClient(row)}
          <div className="d-flex flex-column">
            <h6 className="user-name text-truncate mb-0">{name}</h6>
            <small className="text-truncate text-muted mb-0">{slug}</small>
          </div>
        </div>
      );
    },
  },
  {
    name: t("By"),
    sortable: true,
    ellipsis: true,
    cell: (row) => {
      return (
        <div className="white-space-nowrap overflow-hidden text-overflow-ellipsis">
          {row?.scanby && row?.scanby?.firstName + " " + row?.scanby?.lastName}
        </div>
      );
    },
  },
  {
    name: t("Type"),
    sortable: true,
    ellipsis: true,
    cell: (row) => {
      return (
        <div className="white-space-nowrap overflow-hidden text-overflow-ellipsis">
          {row?.type === "checkin" ? "ورود" : "خروج"}
        </div>
      );
    },
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
];
