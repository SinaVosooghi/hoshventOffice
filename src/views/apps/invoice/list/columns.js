// ** React Imports
import { Link } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Reactstrap Imports
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledTooltip,
  UncontrolledDropdown,
  Badge,
} from "reactstrap";

// ** Third Party Components
import { Eye, Edit, Trash, MoreVertical, Printer } from "react-feather";
import { t } from "i18next";
import { thousandSeperator } from "../../../../utility/Utils";
import MultiLingualDatePicker from "../../../../utility/helpers/datepicker/MultiLingualDatePicker";
import { useMutation } from "@apollo/client";
import { DELETE_ITEM_MUTATION, GET_ITEMS_QUERY } from "../gql";
import { fallbackHandler } from "../../../../utility/helpers/fallbackhandler";

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

  if (row?.avatar?.length) {
    return (
      <Avatar className="me-50" img={row?.avatar} width="32" height="32" />
    );
  } else {
    return (
      <Avatar
        color={color}
        className="me-50"
        content={
          row?.user
            ? row?.user?.firstName + " " + row?.user?.lastName
            : "John Doe"
        }
        initials
      />
    );
  }
};

// ** Table columns
export const columns = [
  {
    name: "#",
    width: "80px",
    sortable: true,
    sortField: "id",
    // selector: row => row?.id,
    cell: (row) => (
      <Link to={`/apps/invoice/preview/${row?.id}`}>{`#${row?.id}`}</Link>
    ),
  },
  {
    name: t("Type"),
    sortable: true,
    width: "90px",
    cell: (row) => {
      return (
        <Link to={`/apps/invoice/preview/${row?.id}`}>
          <div className="d-flex justify-content-left align-items-center">
            <div className="d-flex flex-column">
              <h6 className="user-name text-truncate mb-0">{t(row?.type)}</h6>
            </div>
          </div>
        </Link>
      );
    },
  },
  {
    name: t("User"),
    sortable: true,
    sortField: "client.name",
    minWidth: "230px",
    // selector: row => row?.client.name,
    cell: (row) => {
      const name = row?.user
          ? row?.user?.firstName + " " + row?.user?.lastName
          : "John Doe",
        email = row?.user ? row?.user?.mobilenumber : "johnDoe@email.com";
      return (
        <Link to={`/apps/invoice/preview/${row?.id}`}>
          <div className="d-flex justify-content-left align-items-center">
            {renderClient(row)}
            <div className="d-flex flex-column">
              <h6 className="user-name text-truncate mb-0">{name}</h6>
              <small className="text-truncate text-muted mb-0">{email}</small>
            </div>
          </div>
        </Link>
      );
    },
  },
  {
    name: t("Invoice number"),
    sortable: true,
    sortField: "client.name",
    width: "140px",
    // selector: row => row?.client.name,
    cell: (row) => {
      return (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <h6 className="user-name text-truncate mb-0">
              #{row?.invoicenumber}
            </h6>
          </div>
        </div>
      );
    },
  },
  {
    name: t("Total"),
    sortable: true,
    minWidth: "150px",
    sortField: "total",
    // selector: row => row?.total,
    cell: (row) => <span>{thousandSeperator(row?.total) || 0}</span>,
  },
  {
    sortable: true,
    name: t("Issued Date"),
    sortField: "dueDate",
    cell: (row) => (
      <span className="text-capitalize">
        <MultiLingualDatePicker date={row?.issuedate} />
      </span>
    ),
  },
  {
    sortable: true,
    name: t("Due Date"),
    sortField: "balance",
    // selector: row => row?.balance,
    cell: (row) => (
      <span className="text-capitalize">
        <MultiLingualDatePicker date={row?.duedate} />
      </span>
    ),
  },
  {
    sortable: true,
    name: t("Created"),
    minWidth: "164px",
    sortField: "balance",
    // selector: row => row?.balance,
    cell: (row) => (
      <span className="text-capitalize">
        <MultiLingualDatePicker date={row?.created} />
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
        <div className="column-action d-flex align-items-center">
          {!row.readat && (
            <Badge pill className="me-20" color="light-danger">
              {t("New")}
            </Badge>
          )}
          <Link
            to={`/apps/invoice/preview/${row?.id}`}
            id={`pw-tooltip-${row?.id}`}
          >
            <Eye size={17} className="mx-1" />
          </Link>
          <UncontrolledTooltip placement="top" target={`pw-tooltip-${row?.id}`}>
            {t("Preview Invoice")}
          </UncontrolledTooltip>
          <UncontrolledDropdown>
            <DropdownToggle tag="span">
              <MoreVertical size={17} className="cursor-pointer" />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem
                tag={Link}
                to={`/apps/invoice/preview/${row?.id}`}
                className="w-100"
              >
                <Eye size={14} className="me-50" />
                <span className="align-middle">{t("Preview")}</span>
              </DropdownItem>
              <DropdownItem
                tag={Link}
                to={`/apps/invoice/edit/${row?.id}`}
                className="w-100"
              >
                <Edit size={14} className="me-50" />
                <span className="align-middle">{t("Edit")}</span>
              </DropdownItem>
              <DropdownItem
                tag={Link}
                to={`/apps/invoice/print/${row?.id}`}
                className="w-100"
              >
                <Printer size={14} className="me-50" />
                <span className="align-middle">{t("Print")}</span>
              </DropdownItem>
              <DropdownItem
                className="w-100"
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
                <Trash size={14} className="me-50" />
                <span className="align-middle">{t("Delete")}</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      );
    },
  },
];
