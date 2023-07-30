// ** React Imports
import { useState, useEffect, forwardRef } from "react";

// ** Table Columns
import { columns } from "./columns";

// ** Third Party Components
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";

// ** Reactstrap Imports
import { Card, Input, Row, Col, Button } from "reactstrap";

// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { ITEM_NAME_SINGULAR, GET_ITEMS_QUERY } from "../gql";
import { useLazyQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { noDataToDisplay } from "../../../../utility/Utils";
// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className="form-check">
    <Input type="checkbox" ref={ref} {...props} />
  </div>
));

// ** Table Header
const CustomHeader = ({
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
}) => {
  const { t } = useTranslation();
  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row>
        <Col
          xl="6"
          className="d-flex align-items-sm-center flex-lg-nowrap flex-wrap flex-sm-row flex-column pe-lg-1 p-0 mt-lg-0 mt-1"
        >
          <div className="d-flex align-items-center mb-sm-0 mb-1 me-1 justify-content-start">
            <label className="mb-0" htmlFor="search-invoice">
              {t("Search")}:
            </label>
            <Input
              type="text"
              value={searchTerm}
              id="search-invoice"
              className="ms-50 w-100"
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
        </Col>
        <Col xl="6" className="d-flex align-items-center p-0 ">
          <div className="d-flex align-items-center w-100 justify-content-end">
            <label htmlFor="rows-per-page">{t("Show")}</label>
            <Input
              className="mx-50"
              type="select"
              id="rows-per-page"
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{ width: "5rem" }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Input>
            <label htmlFor="rows-per-page">{t("Entries")}</label>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const Table = () => {
  // ** States
  const [plan, setPlan] = useState("");
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState("id");
  const [getItems, { data: roles }] = useLazyQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
  });

  // ** Get data on mount
  useEffect(() => {
    getItems({
      variables: {
        input: {
          limit: rowsPerPage,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm,
        },
      },
    });
  }, [sort, sortColumn, currentPage]);

  useEffect(() => {
    getItems({
      variables: {
        input: {
          limit: rowsPerPage,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm,
        },
      },
    });
  }, [rowsPerPage, searchTerm]);

  useEffect(() => {
    getItems({
      variables: {
        input: {
          limit: rowsPerPage,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm,
        },
      },
    });
  }, []);

  // ** Function in get data on page change
  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    setRowsPerPage(value);
  };

  // ** Function in get data on search query change
  const handleFilter = (val) => {
    setSearchTerm(val);
  };

  const handlePlanChange = (val) => {
    setPlan(val);
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(roles?.roles?.count / rowsPerPage));

    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        pageCount={count || 1}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        containerClassName={
          "pagination react-paginate justify-content-end my-2 pe-1"
        }
      />
    );
  };

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      q: searchTerm,
    };

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0;
    });

    if (roles > 0) {
      return roles;
    } else if (roles === 0 && isFiltered) {
      return [];
    } else {
      return roles?.roles?.roles?.slice(0, rowsPerPage);
    }
  };

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
  };

  return (
    <Card>
      <div className="react-dataTable react-dataTable-selectable-rows">
        <DataTable
          noHeader
          subHeader
          pagination
          responsive
          selectableRows
          paginationServer
          columns={columns}
          onSort={handleSort}
          data={dataToRender()}
          sortIcon={<ChevronDown />}
          paginationComponent={CustomPagination}
          selectableRowsComponent={BootstrapCheckbox}
          className="react-dataTable"
          noDataComponent={noDataToDisplay()}
          subHeaderComponent={
            <CustomHeader
              plan={plan}
              searchTerm={searchTerm}
              rowsPerPage={rowsPerPage}
              handleFilter={handleFilter}
              handlePerPage={handlePerPage}
              handlePlanChange={handlePlanChange}
            />
          }
        />
      </div>
    </Card>
  );
};

export default Table;
