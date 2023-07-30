import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Badge,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { getUsersSelect } from "../../../../utility/gqlHelpers/getUsers";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { Trash, Edit2 } from "react-feather";
import moment from "moment";
import Avatar from "@components/avatar";

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

export const columns = (removeHandler) => {
  return [
    {
      name: t("User"),
      sortable: true,
      minWidth: "300px",
      sortField: "row.organizer",
      cell: (row) => {
        const email = row.email ? row.email : t("-");
        const name = row.firstName ? row?.firstName + " " + row?.lastName : "-";
        return (
          <Link to={`/apps/courses/edit/${row.id}`}>
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
      name: t("Mobile number"),
      sortable: true,
      sortField: "row.mobilenumber",
      cell: (row) => row.mobilenumber,
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
      cell: (row, index) => {
        return (
          <>
            <Link to={`/apps/user/view/${row.id}`} target="_blank">
              <Edit2 className="font-medium-3 text-body" />
            </Link>
            <Link
              className="ms-1"
              to={"#"}
              onClick={(e) => {
                e.preventDefault();
                if (confirm(t("Do you want to delete?"))) {
                  removeHandler(index);
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
};

const CustomHeader = ({
  handleFilter,
  value,
  handleStatusValue,
  statusValue,
  handlePerPage,
  rowsPerPage,
  setShow,
}) => {
  return (
    <div className="invoice-list-table-header w-100 py-2">
      <Row>
        <Col lg="6" className="d-flex align-items-center px-0 px-lg-1">
          <div className="d-flex align-items-center me-2">
            <label htmlFor="rows-per-page">{t("Show")}</label>
            <Input
              type="select"
              id="rows-per-page"
              value={rowsPerPage}
              onChange={handlePerPage}
              className="form-control mx-50 pe-3"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Input>
            <label htmlFor="rows-per-page">{t("Entries")}</label>
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setShow(true);
            }}
            color="primary"
          >
            {t("Add Record")}
          </Button>
        </Col>
        <Col
          lg="6"
          className="actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0"
        >
          <div className="d-flex align-items-center">
            <label htmlFor="search-invoice">{t("Search")}</label>
            <Input
              id="search-invoice"
              className="ms-50 me-2 w-100"
              type="text"
              value={value}
              onChange={(e) => handleFilter(e.target.value)}
              placeholder={t("Search")}
            />
          </div>
          <Input
            className="w-auto"
            type="select"
            value={statusValue}
            onChange={handleStatusValue}
          >
            <option value="">
              {t("Select")} {t("Status")}
            </option>
            <option value="">{t("All")}</option>
            <option value={true}>{t("Active")}</option>
            <option value={false}>{t("Deactive")}</option>
          </Input>
        </Col>
      </Row>
    </div>
  );
};

const Attendees = ({ attendees, handleAddAttendees, handleDeleteAttendee }) => {
  const [show, setShow] = useState(false);
  const usersData = getUsersSelect("student");
  const [usersOptions, setUsersOptions] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (usersData.length) {
      setUsersOptions(usersData);
    }
  }, [usersData]);

  const resetModal = () => {
    setShow(!show);
    setSelectedUser(null);
  };

  const addUser = () => {
    handleAddAttendees(selectedUser);
    resetModal();
  };
  return (
    <>
      <Modal
        isOpen={show}
        toggle={resetModal}
        className="modal-dialog-centered"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={resetModal}
        ></ModalHeader>
        <ModalBody className="px-5 pb-2">
          <div className="text-center mb-2">
            <h1 className="mb-1">{t("Add attendee")}</h1>
            <p>{t("Choose users for this course")}</p>
          </div>
          <Row className="pt-50">
            <Col sm={12}>
              <Label className="form-label">{t("Users")}</Label>
              <Select
                isClearable={true}
                classNamePrefix="select"
                options={usersOptions}
                theme={selectThemeColors}
                onChange={(d) => {
                  setSelectedUser(d?.user);
                }}
                placeholder={`${t("Select")} ${t("User")}...`}
                className={classnames("react-select")}
              />
            </Col>
            <Col sm={12} className="text-sm-end mt-2">
              <Button color="primary" block onClick={addUser}>
                {t("Add attendee")}
              </Button>
            </Col>
          </Row>
        </ModalBody>
        {selectedUser && (
          <>
            <hr />
            <ModalBody className="px-5 pb-3">
              <h6>{t("Selected User")}</h6>
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="d-flex justify-content-center me-1 mb-1 flex-column">
                  <h4 className="fw-bolder  mb-0 text-primary me-25">
                    {selectedUser.firstName ?? ""} {selectedUser.lastName ?? ""}
                  </h4>
                  <small>{selectedUser.mobilenumber ?? ""}</small>
                  <small>{selectedUser.email ?? ""}</small>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </Modal>
      <div className="react-dataTable user-view-account-projects">
        <DataTable
          noHeader
          responsive
          columns={columns(handleDeleteAttendee)}
          data={attendees}
          noDataComponent={t("There are no records to display")}
          className="react-dataTable"
          sortIcon={<ChevronDown size={10} />}
          subHeader={true}
          subHeaderComponent={<CustomHeader show={show} setShow={setShow} />}
        />
      </div>
    </>
  );
};

export default Attendees;
