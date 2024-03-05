// ** Reactstrap Imports
import { Card, CardBody, CardHeader, Col, Progress, Row } from "reactstrap";

// ** Third Party Components
import { ChevronDown, Clock } from "react-feather";
import DataTable from "react-data-table-component";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { GET_TIMELINE_ITEMS_QUERY } from "../gql";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { noDataToDisplay } from "../../../../utility/Utils";
import ReactPaginate from "react-paginate";
import { t } from "i18next";
import momentJalali from "jalali-moment";
import moment from "jalali-moment";
import StatsHorizontal from "@components/widgets/stats/StatsHorizontal";

const renderClient = (image, title) => {
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

  return image ? (
    <Avatar
      color={color}
      className="me-50"
      content={title ?? "John Doe"}
      img={`${import.meta.env.VITE_BASE_API}/${image}`}
    />
  ) : (
    <Avatar
      color={color}
      className="me-50"
      content={title ?? "John Doe"}
      initials
    />
  );
};

export const columns = [
  {
    sortable: true,
    minWidth: "300px",
    name: t("Title"),
    selector: (row) => row.title,
    cell: (row) => {
      const title =
        row.workshop?.title || row.seminar?.title || row.service?.title;
      const image =
        row.workshop?.hall?.event?.image || row.seminar?.hall?.event?.image;
      const event =
        row.workshop?.hall?.event?.title || row.seminar?.hall?.event?.title;
      return (
        <div className="d-flex justify-content-left align-items-center">
          <div className="avatar-wrapper">{renderClient(image, title)}</div>
          <div className="d-flex flex-column">
            <span className="text-truncate fw-bolder">{title}</span>
            <small className="text-muted">{row.subtitle}</small>
          </div>
        </div>
      );
    },
  },
  {
    sortable: true,
    minWidth: "300px",
    name: t("Type"),
    selector: (row) => row.title,
    cell: (row) => {
      let type = "Seminar";
      if (row?.seminar) type = "Seminar";
      if (row?.service) type = "Service";
      if (row?.workshop) type = "Workshop";

      return (
        <div className="d-flex justify-content-left align-items-center">
          <div className="d-flex flex-column">
            <span className="text-truncate fw-bolder">{t(type)}</span>
          </div>
        </div>
      );
    },
  },
  {
    name: t("Enter"),
    selector: (row) => (
      <>
        {row?.checkin &&
          momentJalali(row?.checkin).locale("fa").format("H:mm  YYYY/MM/DD ")}
      </>
    ),
  },
  {
    name: t("Exit"),
    selector: (row) => (
      <>
        {row?.checkout &&
          momentJalali(row?.checkout).locale("fa").format("H:mm  YYYY/MM/DD ")}
      </>
    ),
  },
  {
    name: t("Total"),
    selector: (row) => {
      if (!row?.checkin || !row?.checkout) return <>-</>;
      const start = moment(row?.checkin);
      const end = moment(row?.checkout);

      var duration = moment.duration(end.diff(start)).asMinutes().toFixed(0);
      return <>{duration} دقیقه</>;
    },
  },
];

const UserAttends = ({ user }) => {
  const [value, setValue] = useState("");
  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("id");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusValue, setStatusValue] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [getItems, { data: userTimelines }] = useLazyQuery(
    GET_TIMELINE_ITEMS_QUERY,
    {
      fetchPolicy: "network-only",
    }
  );

  // ** Get data on mount
  useEffect(() => {
    getItems({
      variables: {
        input: {
          limit: rowsPerPage,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: value,
          status: statusValue ?? null,
          user: parseInt(user),
        },
      },
    });
  }, [sort, sortColumn, currentPage, value]);

  const handleFilter = (val) => {
    setValue(val);
    getItems({
      variables: {
        input: {
          limit: rowsPerPage,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: value,
          status: statusValue ?? null,
          user: parseInt(user),
        },
      },
    });
  };

  const handlePagination = (page) => {
    getItems({
      variables: {
        input: {
          limit: rowsPerPage,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: value,
          status: statusValue ?? null,
          user: parseInt(user),
        },
      },
    });
    setCurrentPage(page.selected + 1);
  };

  const CustomPagination = () => {
    const count = Number(
      Math.ceil(userTimelines?.userTimelines?.count / rowsPerPage)
    );

    return (
      <ReactPaginate
        nextLabel=""
        breakLabel="..."
        previousLabel=""
        pageCount={count || 1}
        activeClassName="active"
        breakClassName="page-item"
        pageClassName={"page-item"}
        breakLinkClassName="page-link"
        nextLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousLinkClassName={"page-link"}
        previousClassName={"page-item prev"}
        onPageChange={(page) => handlePagination(page)}
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        containerClassName={"pagination react-paginate justify-content-end p-1"}
      />
    );
  };

  const dataToRender = () => {
    const filters = {
      q: value,
    };

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0;
    });

    if (userTimelines > 0) {
      return userTimelines;
    } else if (userTimelines === 0 && isFiltered) {
      return [];
    } else {
      return userTimelines?.userTimelines?.timelines?.slice(0, rowsPerPage);
    }
  };

  return (
    <Card>
      <CardHeader tag="h4">لیست مراجعه کاربر</CardHeader>
      <CardBody>
        <Row>
          <Col lg="3" sm="6">
            <StatsHorizontal
              color="danger"
              statTitle={`${t("Total")}`}
              icon={<Clock size={20} />}
              renderStats={
                <h3 className="fw-bolder mb-75">
                  {userTimelines?.userTimelines.total} دقیقه
                </h3>
              }
            />
          </Col>
        </Row>
      </CardBody>

      <div style={{ marginTop: "-45px" }}>
        <DataTable
          noHeader
          pagination
          sortServer
          paginationServer
          subHeader={true}
          columns={columns}
          responsive={true}
          data={dataToRender()}
          sortIcon={<ChevronDown />}
          className="react-dataTable"
          defaultSortField="invoiceId"
          paginationDefaultPage={currentPage}
          paginationComponent={CustomPagination}
          noDataComponent={noDataToDisplay()}
        />
      </div>
    </Card>
  );
};

export default UserAttends;
