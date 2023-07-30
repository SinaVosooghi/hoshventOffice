// ** React Imports
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// ** Table Columns
import { columns } from "./columns";

// ** Third Party Components
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";

// ** Reactstrap Imports
import { Button, Input, Row, Col, Card } from "reactstrap";

// ** Styles
import "@styles/react/apps/app-invoice.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { t } from "i18next";
import { GET_ITEMS_QUERY } from "../gql";
import { useLazyQuery } from "@apollo/client";
import { noDataToDisplay } from "../../../../utility/Utils";

const CustomHeader = ({
  handleFilter,
  value,
  handleStatusValue,
  statusValue,
  handlePerPage,
  rowsPerPage,
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
          <Button tag={Link} to="/apps/questions/add" color="primary">
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

const ItemList = () => {
  // ** States
  const [value, setValue] = useState("");
  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("id");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusValue, setStatusValue] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [getItems, { data: questions }] = useLazyQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
  });

  // ** Get data on mount
  useEffect(() => {
    getItems({
      variables: {
        input: {
          limit: rowsPerPage,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: value,
          status: statusValue ?? null,
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
          searchTerm: value,
          status: statusValue ?? null,
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
          searchTerm: value,
          status: statusState,
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
        },
      },
    });
    setCurrentPage(page.selected + 1);
  };

  const CustomPagination = () => {
    const count = Number(Math.ceil(questions?.questions?.count / rowsPerPage));

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

    if (questions > 0) {
      return questions;
    } else if (questions === 0 && isFiltered) {
      return [];
    } else {
      return questions?.questions?.questions?.slice(0, rowsPerPage);
    }
  };

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
  };

  return (
    <div className="invoice-list-wrapper">
      <Card>
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
            subHeaderComponent={
              <CustomHeader
                value={value}
                statusValue={statusValue}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                handleStatusValue={handleStatusValue}
              />
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default ItemList;
