// ** React Imports
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

// ** Table Columns
import { columns } from "./columns";

// ** Third Party Components
import ReactPaginate from "react-paginate";
import { ChevronDown, DownloadCloud } from "react-feather";
import DataTable from "react-data-table-component";

// ** Reactstrap Imports
import {
  Button,
  Input,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Label,
} from "reactstrap";

// ** Styles
import "@styles/react/apps/app-invoice.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { t } from "i18next";
import { GET_ITEMS_QUERY, GET_SEMINAR_PDF } from "../gql";
import { useLazyQuery, useQuery } from "@apollo/client";
import { noDataToDisplay } from "../../../../utility/Utils";
import { GET_ITEMS_QUERY as GET_HALLS_ITEMS } from "../../halls/gql";
import Select from "react-select";
import { selectThemeColors } from "@utils";

const CustomHeader = ({
  handlePerPage,
  rowsPerPage,
  handleFilter,
  currentHall,
  searchTerm,
}) => {
  const [getPdfFile] = useLazyQuery(GET_SEMINAR_PDF, {
    fetchPolicy: "network-only",

    onCompleted: ({ seminarsPdf }) => {
      var link = document.createElement("a");
      link.download = name;
      link.href = import.meta.env.VITE_BASE_API + seminarsPdf;
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
          hall: currentHall.value ?? null,
        },
      },
    });
  }

  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row>
        <Col
          xl="9"
          className="d-flex align-items-sm-center justify-content-xl-start justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
        >
          <Button tag={Link} to={`/apps/seminars/add`} color="primary">
            {t("Add Record")}
          </Button>
          <div className="d-flex align-items-center mb-sm-0 mb-1 mx-1">
            <label className="mb-0" htmlFor="search-invoice">
              {t("Search")}:
            </label>
            <Input
              id="search-invoice"
              className="ms-50 w-100"
              type="text"
              value={searchTerm}
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
          <Button outline onClick={downloadCSV} className="me-1">
            <DownloadCloud className="font-small-4 me-50" />
            <span>{t("Download CSV")}</span>
          </Button>
        </Col>

        <Col xl="3" className="d-flex align-items-center p-0 ">
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

const ItemList = () => {
  // ** States
  const [value, setValue] = useState("");
  const [sort, setSort] = useState("desc");
  const [sortColumn, setSortColumn] = useState("id");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusValue, setStatusValue] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { type } = useParams();

  const [getItems, { data: seminars }] = useLazyQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
  });

  const [currentHall, setCurrentHall] = useState({
    value: null,
    label: `${t("All")} ${t("Hall")}`,
  });

  const [hallOptions, setHallsOptions] = useState([
    { value: null, label: `${t("All")} ${t("Halls")}` },
  ]);

  useQuery(GET_HALLS_ITEMS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 5,
        skip: 0,
      },
    },
    onCompleted: ({ halls }) => {
      halls?.halls?.map((hall) =>
        setHallsOptions((prev) => [
          ...prev,
          { value: hall.id, label: hall.title },
        ])
      );
    },
    onError: (err) => {
      console.log(err);
    },
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
          hall: currentHall.value ?? null,
          type,
        },
      },
    });
  }, [sort, sortColumn, currentPage, value, currentHall]);

  const handleFilter = (val) => {
    setValue(val);
    getItems({
      variables: {
        input: {
          limit: rowsPerPage,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: value,
          hall: currentHall.value ?? null,
          status: statusValue ?? null,
          type,
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
          hall: currentHall.value ?? null,
          status: statusValue ?? null,
          type,
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
          hall: currentHall.value ?? null,
          status: statusState,
          type,
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
          hall: currentHall.value ?? null,
          status: statusValue ?? null,
          type,
        },
      },
    });
    setCurrentPage(page.selected + 1);
  };

  const CustomPagination = () => {
    const count = Number(Math.ceil(seminars?.seminars?.count / rowsPerPage));

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

    if (seminars > 0) {
      return seminars;
    } else if (seminars === 0 && isFiltered) {
      return [];
    } else {
      return seminars?.seminars?.seminars?.slice(0, rowsPerPage);
    }
  };

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
  };

  return (
    <div className="invoice-list-wrapper">
      <Card>
        <CardBody>
          <CardHeader>
            <CardTitle tag="h4">{t("Filters")}</CardTitle>
          </CardHeader>
          <Row>
            <Col md="3">
              <Label for="role-select">{t("Hall")}</Label>
              <Select
                isClearable={false}
                value={currentHall}
                options={hallOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(data) => {
                  setCurrentHall(data);
                }}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <div className="invoice-list-dataTable react-dataTable">
            <DataTable
              noHeader
              pagination
              paginationServer
              subHeader={true}
              columns={columns}
              responsive={true}
              data={dataToRender()}
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
                  currentHall={currentHall}
                />
              }
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ItemList;
