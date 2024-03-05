// ** React Imports
import { Fragment, useState } from "react";

// ** Mail Components Imports
import MailCard from "./MailCard";
import MailDetails from "./MailDetails";
import ComposePopUp from "./ComposePopup";

// ** Utils
import { formatDateToMonthShort, formatToDynamicLocation } from "@utils";

// ** Third Party Components
import PerfectScrollbar from "react-perfect-scrollbar";
import { Menu, Search, Trash } from "react-feather";

// ** Reactstrap Imports
import { Input, Label, InputGroup, InputGroupText } from "reactstrap";
import { t } from "i18next";

const Mails = (props) => {
  // ** Props
  const {
    query,
    store,
    chats,
    openMail,
    setQuery,
    dispatch,
    selectMail,
    composeOpen,
    updateMails,
    setOpenMail,
    paginateMail,
    selectAllMail,
    toggleCompose,
    setSidebarOpen,
    updateMailLabel,
    resetSelectedMail,
    selectCurrentMail,
  } = props;

  const { mails, selectedMails } = store;
  const [currentTicket, setCurrentTicket] = useState(null);

  // ** States

  // ** Variables
  const labelColors = {
    personal: "success",
    company: "primary",
    important: "warning",
    private: "danger",
  };

  // ** Handles Update Functions
  const handleMailClick = (id) => {
    setCurrentTicket(id);
    setOpenMail(true);
  };

  // ** Handles SelectAll
  const handleSelectAll = (e) => {
    dispatch(selectAllMail(e.target.checked));
  };

  /*eslint-disable */

  // ** Handles Folder Update
  const handleFolderUpdate = (e, folder, ids = selectedMails) => {
    e.preventDefault();
    dispatch(updateMails({ emailIds: ids, dataToUpdate: { folder } }));
    dispatch(resetSelectedMail());
  };

  // ** Handles Label Update
  const handleLabelsUpdate = (e, label, ids = selectedMails) => {
    e.preventDefault();
    dispatch(updateMailLabel({ emailIds: ids, label }));
    dispatch(resetSelectedMail());
  };

  // ** Handles Mail Read Update
  const handleMailReadUpdate = (arr, bool) => {
    dispatch(
      updateMails({ emailIds: arr, dataToUpdate: { isRead: bool } })
    ).then(() => dispatch(resetSelectedMail()));
    dispatch(selectAllMail(false));
  };

  // ** Handles Move to Trash
  const handleMailToTrash = (ids) => {
    dispatch(updateMails({ emailIds: ids, dataToUpdate: { folder: "trash" } }));
    dispatch(resetSelectedMail());
  };
  /*eslint-enable */

  // ** Renders Mail
  const renderMails = () => {
    if (chats?.chats?.chats?.length) {
      return chats?.chats?.chats?.map((chat, index) => {
        return (
          <MailCard
            chat={chat}
            key={index}
            dispatch={dispatch}
            selectMail={selectMail}
            updateMails={updateMails}
            labelColors={labelColors}
            selectedMails={selectedMails}
            handleMailClick={handleMailClick}
            handleMailReadUpdate={handleMailReadUpdate}
            formatDateToMonthShort={formatDateToMonthShort}
            formatToDynamicLocation={formatToDynamicLocation}
          />
        );
      });
    }
  };

  return (
    <Fragment>
      <div className="email-app-list">
        <div className="app-fixed-search d-flex align-items-center">
          <div
            className="sidebar-toggle d-block d-lg-none ms-1"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size="21" />
          </div>
          <div className="d-flex align-content-center justify-content-between w-100">
            <InputGroup className="input-group-merge">
              <InputGroupText>
                <Search className="text-muted" size={14} />
              </InputGroupText>
              <Input
                id="email-search"
                placeholder={t("Search ticket")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>
        <div className="app-action">
          <div className="action-left form-check">
          </div>
          {selectedMails.length ? (
            <div className="action-right">
              <ul className="list-inline m-0">
                <li className="list-inline-item">
                  <span
                    className="action-icon"
                    onClick={() => handleMailToTrash(selectedMails)}
                  >
                    <Trash size={18} />
                  </span>
                </li>
              </ul>
            </div>
          ) : null}
        </div>

        <PerfectScrollbar
          className="email-user-list"
          options={{ wheelPropagation: false }}
        >
          {chats?.chats?.chats?.length ? (
            <ul className="email-media-list">{renderMails()}</ul>
          ) : (
            <div className="no-results d-block">
              <h5>{t("No Items Found")}</h5>
            </div>
          )}
        </PerfectScrollbar>
      </div>
      <MailDetails
        currentTicket={currentTicket}
        openMail={openMail}
        dispatch={dispatch}
        mail={store.currentMail}
        labelColors={labelColors}
        setOpenMail={setOpenMail}
        updateMails={updateMails}
        paginateMail={paginateMail}
        updateMailLabel={updateMailLabel}
        handleMailToTrash={handleMailToTrash}
        handleFolderUpdate={handleFolderUpdate}
        handleLabelsUpdate={handleLabelsUpdate}
        handleMailReadUpdate={handleMailReadUpdate}
        formatDateToMonthShort={formatDateToMonthShort}
        formatToDynamicLocation={formatToDynamicLocation}
      />
      <ComposePopUp composeOpen={composeOpen} toggleCompose={toggleCompose} />
    </Fragment>
  );
};

export default Mails;
