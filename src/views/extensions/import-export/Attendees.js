// ** React Imports
import { Fragment, useEffect, useRef, useState, useMemo } from "react";

// ** Custom Components
import ExtensionsHeader from "@components/extensions-header";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Table,
  Modal,
  Input,
  Label,
  Button,
  CardBody,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";

// ** Third Party Components
import classnames from "classnames";
import { utils, writeFile } from "xlsx";
import { t } from "i18next";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import {
  GET_BULK_CHECKIN,
  GET_BULK_CHECKOUT,
  GET_TIMELINE_ITEMS_QUERY,
} from "../../apps/user/gql";
import moment from "jalali-moment";
import { toast } from "react-hot-toast";
import { GET_ATTENDEES_ITEMS } from "./gql";
import { Printer } from "react-feather";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { ReactQrCode } from "@devmehq/react-qr-code";
import { getUserData } from "../../../utility/Utils";
import PrintableCards from "./PrintableCards";

const initialData = [];

const Attendees = ({ seminar, type }) => {
  // ** States
  const [data, setData] = useState(initialData);
  const [value, setValue] = useState();
  const [modal, setModal] = useState(false);
  const [fileName, setFileName] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [dataToExport, setDataToExport] = useState([]);
  const [fileFormat, setFileFormat] = useState("xlsx");
  const [selectedRows, setSelectedRows] = useState([]);
  const componentRef = useRef();

  const [getItems, { data: attendees, loading }] = useLazyQuery(
    GET_ATTENDEES_ITEMS,
    {
      fetchPolicy: "network-only",
      onCompleted: ({ attendees }) => {
        setData([]);
        setData(attendees?.attends);
      },
    }
  );

  const [checkin] = useMutation(GET_BULK_CHECKIN, {
    refetchQueries: [GET_TIMELINE_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const [checkout] = useMutation(GET_BULK_CHECKOUT, {
    refetchQueries: [GET_TIMELINE_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  // ** Get data on mount
  useEffect(() => {
    if (seminar) {
      getItems({
        variables: {
          input: {
            skip: 0,
            searchTerm: value,
            siteid: parseInt(seminar?.hall?.site?.id),
            ...(type === "seminar"
              ? { s: parseInt(seminar.id) }
              : { w: parseInt(seminar.id) }),
          },
        },
      });
    }
  }, [seminar, value]);

  const toggleModal = () => setModal(!modal);

  const handleFilter = (e) => {
    const value = parseInt(e.target.value);
    setValue(value);
  };

  const handleExport = () => {
    const exportArr = dataToExport;
    data.map((item) => {
      if (selectedRows.includes(item.id)) {
        return exportArr.push({
          نام: item.user.firstName + " " + item.user.lastName,
          موبایل: item.user.mobilenumber,
          نوع: item.user.usertype === "user" ? "کاربر" : "میهمان",
        });
      } else {
        return exportArr.push({
          نام: item.user.firstName + " " + item.user.lastName,
          موبایل: item.user.mobilenumber,
          نوع: item.user.usertype === "user" ? "کاربر" : "میهمان",
        });
      }
    });
    setDataToExport([...exportArr]);

    const name = fileName.length
      ? `${fileName}.${fileFormat}`
      : `excel-sheet.${fileFormat}`;
    const wb = utils.json_to_sheet(dataToExport);
    const wbout = utils.book_new();
    utils.book_append_sheet(wbout, wb, "test");
    writeFile(wbout, name);
    toggleModal();
  };

  const handleSelect = (id) => {
    const selectedRowsArr = selectedRows;
    if (!selectedRowsArr.includes(id)) {
      selectedRowsArr.push(id);
    } else if (selectedRowsArr.includes(id)) {
      selectedRowsArr.splice(selectedRowsArr.indexOf(id), 1);
    } else {
      return null;
    }
    setSelectedRows([...selectedRowsArr]);
  };

  const handleSelectAll = () => {
    let selectedRowsArr = selectedRows;
    if (selectedRowsArr.length < data.length) {
      const ids = data.map((i) => i.id);
      selectedRowsArr = ids;
    } else if (selectedRowsArr.length === data.length) {
      selectedRowsArr = [];
    } else {
      return null;
    }

    setSelectedRows(selectedRowsArr);
  };

  const onBulkCheckinHandler = () => {
    checkin({
      variables: {
        input: {
          ids: selectedRows,
          type: type,
          actionId: parseInt(seminar?.id),
        },
      },
    });
  };

  const onBulkCheckoutHandler = () => {
    checkout({
      variables: {
        input: {
          ids: selectedRows,
          type: type,
          actionId: parseInt(seminar?.id),
        },
      },
    });
  };

  const array = useMemo(
    () => (value ? filteredData : attendees?.attendees?.attends),
    [value]
  );
  const renderTableData = useMemo(
    () =>
      array?.map((col) => {
        if (loading) <></>;

        return (
          <tr
            key={col.id}
            className={classnames({
              selected: selectedRows.includes(col.id),
            })}
          >
            <td>
              <div className="form-check">
                <Input
                  id={col.id}
                  type="checkbox"
                  onChange={() => handleSelect(col.id)}
                  checked={!!selectedRows.includes(col.id)}
                />
              </div>
            </td>
            <td>
              <Link
                to={`/apps/user/view/${col.user?.id}`}
                className="user_name text-truncate text-body"
              >
                {col?.user?.firstName} {col?.user?.lastName}
              </Link>
            </td>
            <td>
              {col?.user?.usertype === "user" && "کاربر"}
              {col?.user?.usertype === "guest" && "میهمان"}
            </td>
            <td>{col?.user?.mobilenumber}</td>
            <td>
              {col.created
                ? moment(col?.created).locale("fa").format("YYYY/MM/D")
                : "-"}
            </td>
            <td>
              <ReactQrCode
                value={`${import.meta.env.VITE_BASE_API}/scan&u=${
                  col.user?.id
                }&e=${seminar?.hall?.site?.id}`}
                size={80}
                viewBox={`0 0 80 80`}
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: "#fff",
                  marginBottom: 10,
                }}
                renderAs="canvas"
                id="qr"
              />
            </td>
          </tr>
        );
      }),
    [array]
  );

  const reactToPrintFn = useReactToPrint({
    contentRef: componentRef,
    onBeforePrint: () => {
      return new Promise((resolve) => {

        promiseResolveRef.current = resolve; // Save resolve for signaling readiness
        setRenderPrint(true); // Trigger rendering
      });
    },
    onAfterPrint: () => {
      setRenderPrint(false); // Cleanup after print
      promiseResolveRef.current = null; // Reset promise
    },
  });

  return (
    <Fragment>
      <ExtensionsHeader
        title={t("Attendees")}
        subTitle={t("List of attendees and bulk checkin and checkout")}
      />
      <Row className="export-component">
        <Col sm="12">
          <Card>
            <CardBody className="pb-0">
              <div className="d-flex flex-wrap justify-content-between">
                <div className="d-flex" style={{ columnGap: 10 }}>
                  <Button color="primary" onClick={() => toggleModal()}>
                    {t("Export")}
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => onBulkCheckinHandler()}
                  >
                    {t("Bulk enter")}
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => onBulkCheckoutHandler()}
                  >
                    {t("Bulk exit")}
                  </Button>

                  <Button
                    color="secondary"
                    onClick={() => onBulkCheckoutHandler()}
                  >
                    <Printer size={14} className="me-50" />
                    {t("Print")}
                  </Button>
                </div>
              </div>
            </CardBody>
            <Table className="table-hover-animation mt-2" responsive>
              <thead>
                <tr>
                  <th>
                    <div className="form-check">
                      <Input
                        type="checkbox"
                        id="select-all"
                        label=""
                        checked={!!selectedRows.length}
                        onChange={() => handleSelectAll()}
                      />
                    </div>
                  </th>
                  <th>{t("Name")}</th>
                  <th>{t("Type")}</th>
                  <th>{t("Mobile")}</th>
                  <th>{t("Created")}</th>
                  <th>{t("QR Code")}</th>
                </tr>
              </thead>
              <tbody>{renderTableData}</tbody>
            </Table>
          </Card>
        </Col>
      </Row>
      <Modal
        isOpen={modal}
        toggle={() => toggleModal()}
        className="modal-dialog-centered"
        onClosed={() => setFileName("")}
      >
        <ModalHeader toggle={() => toggleModal()}>{t("Export")}</ModalHeader>
        <ModalBody>
          <div className="mb-2">
            <Input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="نام فایلی که می خواهید ذخیره کنید"
            />
          </div>
          <div>
            <Input
              type="select"
              id="selectFileFormat"
              name="customSelect"
              value={fileFormat}
              onChange={(e) => {
                setFileFormat(e.target.value);
              }}
            >
              <option>xlsx</option>
              <option>csv</option>
              <option>txt</option>
            </Input>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => handleExport()}>
            {t("Export")}
          </Button>
          <Button color="flat-danger" onClick={() => toggleModal()}>
            {t("Cancel")}
          </Button>
        </ModalFooter>
      </Modal>
      {/*<PrintableCards
        ref={componentRef}
        data={data}
        seminarTitle={seminar?.data?.title}
      />*/}
    </Fragment>
  );
};

export default Attendees;
