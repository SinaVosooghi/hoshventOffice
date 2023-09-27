// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Invoice List Sidebar
import Sidebar from "./Sidebar";

// ** Table Columns
import { columns } from "./columns";
import toast from "react-hot-toast";

// ** Store & Actions
import { useSelector } from "react-redux";

// ** Third Party Components
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown, DownloadCloud, UploadCloud } from "react-feather";
import axios from "axios";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { t } from "i18next";
import {
  GET_PDF,
  ITEM_NAME_SINGULAR,
  UPLOAD_CSV_USERS,
  USER_TYPES,
} from "../gql";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_ITEMS_QUERY as GET_ROLES_ITEMS } from "../../roles-permissions/gql";
import { GET_ITEMS_QUERY as GET_CATEGORIES_ITEMS } from "../../category/gql";

import { GET_ITEMS_QUERY as GET_USERS_ITEMS } from "../gql";
import { noDataToDisplay } from "../../../../utility/Utils";
import { useNavigate, useParams } from "react-router-dom";

// ** Table Header
const CustomHeader = ({
  store,
  toggleSidebar,
  handlePerPage,
  rowsPerPage,
  handleFilter,
  searchTerm,
}) => {
  const [csvFile, setCsvFile] = useState();
  const history = useNavigate();

  const [getPdfFile] = useLazyQuery(GET_PDF, {
    fetchPolicy: "network-only",

    onCompleted: ({ usersPdf }) => {
      var link = document.createElement("a");
      link.download = name;
      link.href = import.meta.env.VITE_BASE_API + usersPdf;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  });

  const [upload] = useMutation(UPLOAD_CSV_USERS, {
    refetchQueries: [GET_USERS_ITEMS],
    context: {
      headers: {
        "apollo-require-preflight": true,
      },
    },
    refetchQueries: [GET_USERS_ITEMS],
    onCompleted: () => {
      history(`/apps/user/list/all`);
      toast.success(t("Data saved successfully"));
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  // ** Downloads CSV
  function downloadCSV(array) {
    getPdfFile({
      variables: {
        input: {
          skip: 0,
        },
      },
    });
  }

  const handleChange = (e) => {
    if (e.currentTarget.files) setCsvFile(e.currentTarget.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    upload({
      refetchQueries: [GET_USERS_ITEMS],
      variables: {
        input: {
          csv: csvFile,
        },
      },
    });
  };

  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row>
        <Col
          xl="9"
          className="d-flex align-items-sm-center justify-content-xl-start justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
        >
          <Button
            className="add-new-user me-1 ms-1"
            color="primary"
            onClick={toggleSidebar}
          >
            {t("Add")} {t("New")} {t(ITEM_NAME_SINGULAR)}
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
          <Button outline onClick={() => downloadCSV()} className="me-1">
            <DownloadCloud className="font-small-4 me-50" />
            <span>{t("Download CSV")}</span>
          </Button>
          <form onSubmit={onSubmit}>
            <div className="d-flex align-items-center mb-sm-0 mb-1">
              <Input
                onChange={handleChange}
                type="file"
                className="me-1"
                accept="text/csv"
                style={{ width: 200 }}
                required
              />

              <Button outline className="me-1" type="submit">
                <UploadCloud className="font-small-4 me-50" />
                <span>{t("Upload CSV")}</span>
              </Button>
            </div>
          </form>
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

const UsersList = () => {
  // ** Store Vars
  const store = useSelector((state) => state.users);
  const { type } = useParams();

  // ** States
  const [sort, setSort] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleOptions, setRoleOptions] = useState([
    { value: null, label: `${t("All")} ${t("Role")}` },
  ]);
  const [currentRole, setCurrentRole] = useState({
    value: null,
    label: `${t("All")} ${t("Role")}`,
  });
  const [currentStatus, setCurrentStatus] = useState({
    value: null,
    label: `${t("All")} ${t("Status")}`,
    number: 0,
  });
  const [currentUsertype, setCurrentUsertype] = useState({
    value: null,
    label: `${t("All")} ${t("Type")}`,
    number: 0,
  });

  const [currentCategory, setCurrentCategory] = useState({
    value: null,
    label: `${t("All")} ${t("Categories")}`,
    number: 0,
  });

  const [categories, setCategories] = useState([
    { value: null, label: `${t("All")} ${t("Categories")}` },
  ]);

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [getItems, { data: users }] = useLazyQuery(GET_USERS_ITEMS, {
    fetchPolicy: "network-only",
  });

  useQuery(GET_ROLES_ITEMS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 5,
        skip: 0,
      },
    },
    onCompleted: ({ roles }) => {
      roles?.roles?.map((role) =>
        setRoleOptions((prev) => [
          ...prev,
          { value: role.id, label: role.title },
        ])
      );
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useQuery(GET_CATEGORIES_ITEMS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 5,
        skip: 0,
        type: "user",
      },
    },
    onCompleted: ({ categories }) => {
      categories?.categories?.map((category) =>
        setCategories((prev) => [
          ...prev,
          { value: category.id, label: category.title },
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
          searchTerm,
          role: currentRole.value ?? null,
          status: currentStatus.value ?? null,
          usertype: currentUsertype.value,
          category: currentCategory.value ?? null,
        },
      },
    });
  }, [
    sort,
    sortColumn,
    currentPage,
    currentUsertype,
    currentStatus,
    currentRole,
    currentCategory,
  ]);

  useEffect(() => {
    getItems({
      variables: {
        input: {
          limit: rowsPerPage,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm,
          role: currentRole.value ?? null,
          status: currentStatus.value ?? null,
          usertype:
            type && type !== "all" ? type : currentUsertype.value ?? null,
        },
      },
    });
  }, [rowsPerPage, searchTerm]);

  const statusOptions = [
    { value: null, label: `${t("All")} ${t("Status")}`, number: 0 },
    { value: true, label: t("Active"), number: 2 },
    { value: false, label: t("Inactive"), number: 3 },
  ];

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

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(users?.users?.count / rowsPerPage));

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

    if (users > 0) {
      return users;
    } else if (users === 0 && isFiltered) {
      return [];
    } else {
      return users?.users?.users?.slice(0, rowsPerPage);
    }
  };

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection);
    setSortColumn(column.sortField);
  };

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">{t("Filters")}</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            {type !== "teacher" && (
              <>
                <Col md="3">
                  <Label for="role-select">{t("Role")}</Label>
                  <Select
                    isClearable={false}
                    value={currentRole}
                    options={roleOptions}
                    className="react-select"
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    onChange={(data) => {
                      setCurrentRole(data);
                    }}
                  />
                </Col>
                <Col md="3">
                  <Label for="status-select">{t("Type")}</Label>
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    className="react-select"
                    classNamePrefix="select"
                    options={USER_TYPES}
                    value={currentUsertype}
                    onChange={(data) => {
                      setCurrentUsertype(data);
                    }}
                  />
                </Col>
              </>
            )}

            <Col md="3">
              <Label for="status-select">{t("Category")}</Label>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className="react-select"
                classNamePrefix="select"
                options={categories}
                value={currentCategory}
                onChange={(data) => {
                  setCurrentCategory(data);
                }}
              />
            </Col>

            <Col md="3">
              <Label for="status-select">{t("Status")}</Label>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className="react-select"
                classNamePrefix="select"
                options={statusOptions}
                value={currentStatus}
                onChange={(data) => {
                  setCurrentStatus(data);
                }}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card className="overflow-hidden">
        <div className="react-dataTable">
          <DataTable
            noHeader
            subHeader
            sortServer
            pagination
            responsive
            paginationServer
            columns={columns}
            onSort={handleSort}
            sortIcon={<ChevronDown />}
            className="react-dataTable"
            paginationComponent={CustomPagination}
            data={dataToRender()}
            noDataComponent={noDataToDisplay()}
            subHeaderComponent={
              <CustomHeader
                store={store}
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                toggleSidebar={toggleSidebar}
              />
            }
          />
        </div>
      </Card>

      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  );
};

export default UsersList;
