// ** React Imports
import { useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";

// ** Email App Component Imports
import Mails from "./Mails";
import Sidebar from "./Sidebar";
import toast from "react-hot-toast";
import { useLazyQuery } from "@apollo/client";

// ** Third Party Components
import classnames from "classnames";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import {
  getMails,
  selectMail,
  updateMails,
  paginateMail,
  selectAllMail,
  updateMailLabel,
  resetSelectedMail,
  selectCurrentMail,
} from "./store";

// ** Styles
import "@styles/react/apps/app-email.scss";
import { GET_ITEMS_QUERY } from "./gql";
import { t } from "i18next";

const EmailApp = () => {
  // ** States
  const [query, setQuery] = useState("");
  const [openMail, setOpenMail] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusValue, setStatusValue] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [value, setValue] = useState("");
  const [chatsData, setChatsData] = useState([]);
  const [priority, setPriority] = useState(null);
  const [department, setDepartment] = useState(null);

  // ** Toggle Compose Function
  const toggleCompose = () => setComposeOpen(!composeOpen);

  // ** Store Variables
  const dispatch = useDispatch();
  const store = useSelector((state) => state.email);

  // ** Vars
  const params = useParams();

  const [getItems, { data: chats }] = useLazyQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    pollInterval: 5000,
    ssr: false,
    onError: () => {
      toast.error(t("Error on connection"));
    },
  });

  // ** UseEffect: GET initial data on Mount
  useEffect(() => {
    getItems({
      variables: {
        input: {
          limit: rowsPerPage,
          skip: (currentPage - 1) * rowsPerPage,
          searchTerm: query,
          status: statusValue ?? null,
          priority,
          department,
        },
      },
    });
  }, [query, params.folder, params.label, priority, department]);

  // useEffect(() => {
  //   console.log(priority);
  // }, [priority]);

  return (
    <Fragment>
      <Sidebar
        store={store}
        chats={chats}
        dispatch={dispatch}
        getMails={getMails}
        setOpenMail={setOpenMail}
        sidebarOpen={sidebarOpen}
        toggleCompose={toggleCompose}
        setSidebarOpen={setSidebarOpen}
        resetSelectedMail={resetSelectedMail}
        setPriority={setPriority}
        setDepartment={setDepartment}
        department={department}
      />
      <div className="content-right">
        <div className="content-body">
          <div
            className={classnames("body-content-overlay", {
              show: sidebarOpen,
            })}
            onClick={() => setSidebarOpen(false)}
          ></div>
          <Mails
            store={store}
            mails={chatsData}
            chats={chats}
            query={query}
            setQuery={setQuery}
            dispatch={dispatch}
            getMails={getMails}
            openMail={openMail}
            selectMail={selectMail}
            setOpenMail={setOpenMail}
            updateMails={updateMails}
            composeOpen={composeOpen}
            paginateMail={paginateMail}
            selectAllMail={selectAllMail}
            toggleCompose={toggleCompose}
            setSidebarOpen={setSidebarOpen}
            updateMailLabel={updateMailLabel}
            selectCurrentMail={selectCurrentMail}
            resetSelectedMail={resetSelectedMail}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default EmailApp;
