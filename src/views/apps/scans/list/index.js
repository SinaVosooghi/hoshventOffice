// ** React Imports
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

// ** Table Columns
import { columns } from "./columns";

// ** Third Party Components
import ReactPaginate from "react-paginate";
import { ChevronDown, Codesandbox, DownloadCloud } from "react-feather";
import DataTable from "react-data-table-component";

// ** Reactstrap Imports
import { Button, Input, Row, Col, Card, CardText } from "reactstrap";
import Avatar from "@components/avatar";

// ** Styles
import "@styles/react/apps/app-invoice.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { t } from "i18next";
import { GET_ITEMS_QUERY, GET_SCAN_PDF, GET_SCAN_TOTAL } from "../gql";
import { useLazyQuery } from "@apollo/client";
import { noDataToDisplay } from "../../../../utility/Utils";

const CustomHeader = ({ seminar, workshop, service }) => {
  const [getPdfFile] = useLazyQuery(GET_SCAN_PDF, {
    fetchPolicy: "network-only",

    onCompleted: ({ scansPdf }) => {
      let link = document.createElement("a");
      link.download = name;
      link.href = import.meta.env.VITE_BASE_API + scansPdf;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  });

  // ** Downloads CSV
  function downloadCSV(e) {
    e.preventDefault();
    getPdfFile({
      variables: {
        input: {
          skip: 0,
          ...(service && { service: parseInt(service) }),
          ...(workshop && { workshop: parseInt(workshop) }),
          ...(seminar && { seminar: parseInt(seminar) }),
        },
      },
    });
  }

  const [getTotalTimesPdf] = useLazyQuery(GET_SCAN_TOTAL, {
    fetchPolicy: "network-only",

    onCompleted: ( {scanTotal} ) => {
      let link = document.createElement("a");
      link.download = name;
      link.href = import.meta.env.VITE_BASE_API + scanTotal;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  });

  // ** Downloads CSV
  function downloadTotalCSV(e) {
    e.preventDefault();
    getTotalTimesPdf({
      variables: {
        input: {
          skip: 0,
          ...(service && { service: parseInt(service) }),
          ...(workshop && { workshop: parseInt(workshop) }),
          ...(seminar && { seminar: parseInt(seminar) }),
        },
      },
    });
  }

  return (
    <div className="invoice-list-table-header w-100 py-2">
      <Row>
        <Col
          lg="6"
          className="d-flex align-items-sm-center justify-content-xl-start justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
        >
          <div className="d-flex align-items-center justify-content-start ms-2">
            <label htmlFor="search-invoice">آخرین اسکن ها</label>
          </div>

          <Button outline onClick={downloadCSV} className="me-1 ms-1" size="sm">
            <DownloadCloud className="font-small-4 me-50" />
            <span>{t("Download CSV")}</span>
          </Button>
          <Button outline onClick={downloadTotalCSV} className="me-1 ms-1" size="sm">
            <DownloadCloud className="font-small-4 me-50" />
            <span>{t("Download TOTAL CSV")}</span>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

const ScansList = ({ service, workshop, seminar }) => {
  // ** States
  const [value, setValue] = useState("");
  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("id");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusValue, setStatusValue] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { type } = useParams();

  const [getItems, { data: scans }] = useLazyQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
  });

  // ** Get data on mount
  useEffect(() => {
    getItems({
      variables: {
        input: {
          limit: rowsPerPage,
          skip: (currentPage - 1) * rowsPerPage,
          ...(service && { service: parseInt(service) }),
          ...(seminar && { seminar: parseInt(seminar) }),
          ...(workshop && { workshop: parseInt(workshop) }),
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
          ...(service && { service: parseInt(service) }),
          ...(seminar && { seminar: parseInt(seminar) }),
          ...(workshop && { workshop: parseInt(workshop) }),
        },
      },
    });
  };

  const handlePerPage = (e) => {
    getItems({
      variables: {
        input: {
          limit: parseInt(e.target.value),
          skip: (currentPage - 1) * rowsPerPage,
          ...(service && { service: parseInt(service) }),
          ...(seminar && { seminar: parseInt(seminar) }),
          ...(workshop && { workshop: parseInt(workshop) }),
        },
      },
    });
    setRowsPerPage(parseInt(e.target.value));
  };

  const handleStatusValue = (e) => {
    let statusState = null;

    switch (e.target.value) {
      case "true":
        statusState = true;
        break;
      case "false":
        statusState = false;
        break;
      default:
        statusState = null;
    }
    setStatusValue(e.target.value);

    getItems({
      variables: {
        input: {
          limit: rowsPerPage,
          skip: (currentPage - 1) * rowsPerPage,
          status: statusState,
          ...(service && { service: parseInt(service) }),
          ...(seminar && { seminar: parseInt(seminar) }),
          ...(workshop && { workshop: parseInt(workshop) }),
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
          ...(service && { service: parseInt(service) }),
          ...(seminar && { seminar: parseInt(seminar) }),
          ...(workshop && { workshop: parseInt(workshop) }),
        },
      },
    });
    setCurrentPage(page.selected + 1);
  };

  const CustomPagination = () => {
    const count = Number(Math.ceil(scans?.scans?.count / rowsPerPage));

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

    if (scans > 0) {
      return scans;
    } else if (scans === 0 && isFiltered) {
      return [];
    } else {
      return scans?.scans?.scans?.slice(0, rowsPerPage);
    }
  };

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
  };

  return (
    <div className="invoice-list-wrapper">
      <Card>
        <Col className="mt-2 ms-2">
          <div className="d-flex align-items-center">
            <Avatar
              color={"light-success"}
              icon={<Codesandbox />}
              className="me-2"
            />
            <div className="my-auto">
              <h4 className="fw-bolder mb-0">{scans?.scans?.count}</h4>
              <CardText className="font-small-3 mb-0">{t("Scans")}</CardText>
            </div>
          </div>
        </Col>
        <div className="invoice-list-dataTable react-dataTable">
          <DataTable
            noHeader
            pagination
            sortServer
            paginationServer
            subHeader={true}
            columns={columns}
            responsive={true}
            onSort={handleSort}
            data={dataToRender()}
            sortIcon={<ChevronDown />}
            className="react-dataTable"
            defaultSortField="invoiceId"
            paginationDefaultPage={currentPage}
            paginationComponent={CustomPagination}
            noDataComponent={noDataToDisplay()}
            keyField={(row) => row.id}
            subHeaderComponent={
              <CustomHeader
                value={value}
                statusValue={statusValue}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                handleStatusValue={handleStatusValue}
                service={service}
                workshop={workshop}
                seminar={seminar}
              />
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default ScansList;
