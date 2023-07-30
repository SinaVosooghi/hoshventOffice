// ** React Imports
import { useState, useEffect } from "react";

// ** Table Columns
import { columns } from "./columns";

// ** Third Party Components
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";

// ** Reactstrap Imports
import { Button, Input, Row, Col, Card } from "reactstrap";
import { noDataToDisplay } from "../../../../utility/Utils";

// ** Styles
import "@styles/react/apps/app-invoice.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { t } from "i18next";
import { GET_ITEMS_QUERY } from "../gql";
import { useLazyQuery } from "@apollo/client";

const CustomHeader = ({ handleFilter, value, handlePerPage, rowsPerPage }) => {
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
        </Col>
        <Col
          lg="6"
          className="actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pe-lg-1 p-0"
        >
          <div className="d-flex align-items-center">
            <label htmlFor="search-invoice">{t("Search")}:</label>
            <Input
              id="search-invoice"
              className="ms-50 me-2 w-100"
              type="text"
              value={value}
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

const InvoiceList = () => {
  // ** States
  const [value, setValue] = useState("");
  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("id");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusValue, setStatusValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [getItems, { data: orders }] = useLazyQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getItems({
      variables: {
        input: {
          limit: rowsPerPage,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: value,
        },
      },
    });
  }, []);

  const handleFilter = (val) => {
    setValue(val);
    getItems({
      variables: {
        input: {
          limit: rowsPerPage,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: value,
        },
      },
    });
  };

  const handlePerPage = (e) => {
    getItems({
      variables: {
        input: {
          limit: rowsPerPage,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: value,
        },
      },
    });
    setRowsPerPage(parseInt(e.target.value));
  };

  const handleStatusValue = (e) => {
    setStatusValue(e.target.value);
    getItems({
      variables: {
        input: {
          limit: rowsPerPage,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: value,
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
        },
      },
    });
    setCurrentPage(page.selected + 1);
  };

  const CustomPagination = () => {
    const count = Number(
      Math.ceil(orders?.orders?.count / rowsPerPage)
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
        noDataComponent={noDataToDisplay()}
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

    if (orders > 0) {
      return orders;
    } else if (orders === 0 && isFiltered) {
      return [];
    } else {
      return orders?.orders?.orders?.slice(0, rowsPerPage);
    }
  };

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
    getItems({
      variables: {
        input: {
          limit: rowsPerPage,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: value,
        },
      },
    });
  };

  return (
    <div className="invoice-list-wrapper">
      <Card>
        <div className="invoice-list-dataTable react-dataTable">
          <DataTable
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

export default InvoiceList;
