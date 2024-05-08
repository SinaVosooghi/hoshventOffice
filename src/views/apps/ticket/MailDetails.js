// ** React Imports
import { Fragment, useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";

// ** Utils
import { formatDate } from "@utils";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Third Party Components
import classnames from "classnames";
import toast from "react-hot-toast";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import Select, { components } from "react-select";
import {
  formatToDynamicLocation,
  hashConfig,
  thousandSeperator,
} from "../../../utility/Utils";

import {
  Star,
  Trash,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CornerUpLeft,
  CornerUpRight,
  Send,
  Paperclip,
  FileText,
} from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Badge,
  Card,
  Table,
  CardBody,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Button,
  ListGroup,
  ListGroupItem,
  CardFooter,
} from "reactstrap";
import { t } from "i18next";
import { useLazyQuery } from "@apollo/client";
import {
  CREATE_MESSAGE_ITEM_MUTATION,
  GET_ITEMS_QUERY,
  GET_ITEM_QUERY,
} from "./gql";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const MailDetails = (props) => {
  // ** Props
  const {
    mail,
    openMail,
    dispatch,
    labelColors,
    setOpenMail,
    updateMails,
    paginateMail,
    handleMailToTrash,
    currentTicket,
  } = props;

  // ** States
  const [showReplies, setShowReplies] = useState(true);
  const [description, setDescription] = useState(EditorState.createEmpty());
  const { i18n, t } = useTranslation();

  const [create] = useMutation(CREATE_MESSAGE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEMS_QUERY, GET_ITEM_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const [getItem, { data: chat }] = useLazyQuery(GET_ITEM_QUERY, {
    fetchPolicy: "network-only",
    pollInterval: 5000,
    ssr: false,
    onError: () => {
      toast.error(t("Error on connection"));
    },
  });

  useEffect(() => {
    if (currentTicket) {
      getItem({
        variables: {
          id: currentTicket,
        },
      });
    }
  }, [currentTicket]);

  // ** Renders Labels
  const renderLabels = (arr) => {
    if (arr && arr.length) {
      return arr.map((label) => (
        <Badge
          key={label}
          color={`light-${labelColors[label]}`}
          className="me-50 text-capitalize"
          pill
        >
          {label}
        </Badge>
      ));
    }
  };

  // ** Renders Attachments
  const renderAttachments = (arr) => {
    if (!arr) return;
    return (
      <a
        href={`/apps/invoices/preview/${arr.id}`}
        onClick={(e) => e.preventDefault()}
      >
        <span className="text-muted font-small-2 ms-25">{`${t(
          "Invoice number"
        )} #${arr.invoicenumber}`}</span>
      </a>
    );
  };

  // ** Renders Messages
  const renderMessage = (obj, chat) => {
    return (
      <Card>
        <CardHeader className="email-detail-head">
          <div className="user-details d-flex justify-content-between align-items-center flex-wrap">
            <Avatar
              img={obj.from?.avatar}
              initials
              color={"light-primary"}
              className="me-75"
              imgHeight="48"
              imgWidth="48"
              content={
                !obj.from
                  ? obj.user?.firstName ?? "" + " " + obj.user?.lastName ?? ""
                  : obj.from?.firstName ?? "" + " " + obj.from?.lastName ?? ""
              }
            />

            <div className="mail-items">
              <h5 className="mb-0">
                {!obj.from
                  ? obj.user?.firstName ?? "" + " " + obj.user?.lastName ?? ""
                  : obj.from?.firstName ?? "" + " " + obj.from?.lastName ?? ""}
              </h5>
              <UncontrolledDropdown className="email-info-dropup">
                {!obj.user ? (
                  <>
                    <DropdownToggle
                      className="font-small-3 text-muted cursor-pointer"
                      tag="span"
                      caret
                    >
                      <span className="me-25">
                        {obj.user ? obj.user?.email : obj.from?.email}
                      </span>
                    </DropdownToggle>
                    <DropdownMenu>
                      <Table className="font-small-3" size="sm" borderless>
                        <tbody>
                          <tr>
                            <td className="text-end text-muted align-top">
                              {t("From")}:
                            </td>
                            <td>{obj.from?.email}</td>
                          </tr>
                          <tr>
                            <td className="text-end text-muted align-top">
                              {t("To")}:
                            </td>
                            <td>
                              {obj.to?.email} {obj.to?.mobileNumber ?? ""}
                            </td>
                          </tr>
                          <tr>
                            <td className="text-end text-muted align-top">
                              {t("Date")}:
                            </td>
                            <td>
                              {formatToDynamicLocation(
                                obj.created,
                                i18n.language
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </DropdownMenu>
                  </>
                ) : (
                  <span className="me-25 text-muted">
                    {obj.user ? obj.user?.email : obj.from?.email}
                  </span>
                )}
              </UncontrolledDropdown>
            </div>
          </div>
          <div className="mail-meta-item d-flex align-items-center">
            <small className="mail-date-time text-muted">
              {formatToDynamicLocation(obj.created, i18n.language)}
            </small>
            <UncontrolledDropdown className="ms-50">
              <DropdownToggle className="cursor-pointer" tag="span">
                <MoreVertical size={14} />
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem className="d-flex align-items-center w-100">
                  <CornerUpLeft className="me-50" size={14} />
                  {t("Reply")}
                </DropdownItem>
                <DropdownItem className="d-flex align-items-center w-100">
                  <CornerUpRight className="me-50" size={14} />
                  {t("Forward")}
                </DropdownItem>
                <DropdownItem className="d-flex align-items-center w-100">
                  <Trash2 className="me-50" size={14} />
                  {t("Delete")}
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </CardHeader>
        <CardBody className="mail-message-wrapper pt-2">
          <div
            className="mail-message"
            dangerouslySetInnerHTML={{
              __html: obj?.messages ? obj?.messages[0]?.body : obj.body,
            }}
          ></div>
        </CardBody>

        {chat?.invoice ? (
          <CardFooter>
            <div className="mail-attachments">
              <div className="d-flex align-items-center mb-1">
                <FileText size={16} />
                <h5 className="fw-bolder text-body mb-0 ms-50 d-block">
                  {t("Invoice")}
                </h5>
              </div>
              <div className="d-flex flex-column">
                {renderAttachments(chat?.invoice)}
              </div>
            </div>
          </CardFooter>
        ) : null}
      </Card>
    );
  };

  // ** Renders Replies
  const renderReplies = (arr, chat) => {
    if (arr.length && showReplies === true) {
      return arr.map((obj, index) => (
        <Row key={index}>
          <Col sm="12">{renderMessage(obj, chat.chat)}</Col>
        </Row>
      ));
    }
  };

  const handleGoBack = () => {
    setOpenMail(false);
  };

  const renderTypes = (type) => {
    switch (type) {
      case "info":
        return (
          <Badge className="float-start px-2" color="light-info" pill>
            {t("Information")}
          </Badge>
        );
      case "success":
        return (
          <Badge className="float-start  px-2" color="light-success" pill>
            {t("Success")}
          </Badge>
        );
      case "warning":
        return (
          <Badge className="float-start px-2" color="light-warning" pill>
            {t("Warning")}
          </Badge>
        );
      case "alert":
        return (
          <Badge className="float-start px-2" color="light-danger" pill>
            {t("Alert")}
          </Badge>
        );
    }
  };

  const renderPriority = (priority) => {
    switch (priority) {
      case "high":
        return (
          <span>
            <span className="bullet bullet-sm bullet-warning me-50"></span>
            {t("High")}
          </span>
        );
      case "medium":
        return (
          <span>
            <span className="bullet bullet-sm bullet-warning me-50"></span>
            {t("Medium")}
          </span>
        );
      case "low":
        return (
          <span>
            <span className="bullet bullet-sm bullet-info me-50"></span>
            {t("Low")}
          </span>
        );
    }
  };

  const handleSubmit = () => {
    const rawContentState = convertToRaw(description.getCurrentContent());
    const markup = draftToHtml(rawContentState, hashConfig, true);

    create({
      variables: {
        input: {
          chat: chat?.chat?.id,
          body: markup,
        },
      },
    });
  };

  return (
    <div
      className={classnames("email-app-details", {
        show: openMail,
      })}
    >
      {chat !== null && chat !== undefined ? (
        <Fragment>
          <div className="email-detail-header">
            <div className="email-header-left d-flex align-items-center">
              <span className="go-back me-1" onClick={handleGoBack}>
                <ChevronLeft size={20} />
              </span>
              <h4 className="email-subject mb-0">{chat?.chat?.subject}</h4>
              <UncontrolledDropdown className="email-info-dropup ms-2">
                <DropdownToggle
                  className="font-small-3 text-muted cursor-pointer"
                  tag="span"
                  caret
                >
                  <MoreVertical size={14} />
                  <span className="me-25">{t("Information")}</span>
                </DropdownToggle>
                <DropdownMenu>
                  <Table className="font-small-3" size="sm" borderless>
                    <tbody>
                      <tr>
                        <td className="text-end text-muted align-top">
                          {t("Type")}:
                        </td>
                        <td> {renderTypes(chat?.chat?.type)}</td>
                      </tr>
                      <tr>
                        <td className="text-end text-muted align-top">
                          {t("Priority")}:
                        </td>
                        <td> {renderPriority(chat?.chat?.priority)}</td>
                      </tr>
                      <tr>
                        <td className="text-end text-muted align-top">
                          {t("From")}:
                        </td>
                        <td>{chat.chat?.from?.email}</td>
                      </tr>
                      <tr>
                        <td className="text-end text-muted align-top">
                          {t("To")}:
                        </td>
                        <td>
                          {chat.chat?.to?.email}{" "}
                          {chat.chat?.to?.mobileNumber ?? ""}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-end text-muted align-top">
                          {t("Date")}:
                        </td>
                        <td>
                          {formatToDynamicLocation(
                            chat.chat?.created,
                            i18n.language
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
            <div className="email-header-right ms-2 ps-1">
              <ul className="list-inline m-0">
                <li className="list-inline-item me-1">
                  <span
                    className="action-icon favorite"
                    onClick={() => {
                      dispatch(
                        updateMails({
                          emailIds: [chat?.chat?.id],
                          dataToUpdate: { isStarred: !chat?.chat?.isStarred },
                        })
                      );
                    }}
                  >
                    <Star
                      size={18}
                      className={classnames({
                        "text-warning fill-current": chat?.chat?.isStarred,
                      })}
                    />
                  </span>
                </li>

                <li className="list-inline-item me-1">
                  <span
                    className="action-icon"
                    onClick={() => {
                      handleMailToTrash([chat?.chat?.id]);
                      handleGoBack();
                    }}
                  >
                    <Trash size={18} />
                  </span>
                </li>
                <li className="list-inline-item email-prev">
                  <span
                    className={classnames({
                      "action-icon": chat?.chat?.hasPreviousMail,
                    })}
                    onClick={() => {
                      return chat?.chat?.hasPreviousMail
                        ? dispatch(
                            paginateMail({
                              dir: "next",
                              emailId: chat?.chat?.id,
                            })
                          )
                        : null;
                    }}
                  >
                    <ChevronLeft
                      size={18}
                      className={classnames({
                        "text-muted": !chat?.chat?.hasPreviousMail,
                      })}
                    />
                  </span>
                </li>
                <li className="list-inline-item email-next">
                  <span
                    className={classnames({
                      "action-icon": chat?.chat?.hasNextMail,
                    })}
                    onClick={() => {
                      return chat?.chat?.hasNextMail
                        ? dispatch(
                            paginateMail({
                              dir: "previous",
                              emailId: chat?.chat?.id,
                            })
                          )
                        : null;
                    }}
                  >
                    <ChevronRight
                      size={18}
                      className={classnames({
                        "text-muted": !chat?.chat?.hasNextMail,
                      })}
                    />
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <PerfectScrollbar
            className="email-scroll-area"
            options={{ wheelPropagation: false }}
          >
            <Row>
              <Col sm="12">
                <div className="email-label">
                  {renderLabels(chat?.chat?.labels)}
                </div>
              </Col>
            </Row>
            {chat?.chat?.messages && chat?.chat?.messages?.length ? (
              <Fragment>
                {/* {showReplies === true ? (
                  <Row className="mb-1">
                    <Col sm="12">
                      <a
                        className="fw-bold"
                        href="/"
                        onClick={handleShowReplies}
                      >
                        {t("View")} {chat?.chat?.messages?.length}{" "}
                        {t("Earlier Messages")}
                      </a>
                    </Col>
                  </Row>
                ) : null} */}

                {renderReplies(chat?.chat?.messages, chat)}
              </Fragment>
            ) : null}
            <Row>
              <Col sm="12">
                <Card>
                  <CardBody>
                    <Editor
                      editorState={description}
                      onEditorStateChange={(data) => setDescription(data)}
                      placeholder={t("Reply")}
                      toolbar={{
                        options: ["inline", "textAlign", "link"],
                        inline: {
                          inDropdown: false,
                          options: [
                            "bold",
                            "italic",
                            "underline",
                            "strikethrough",
                          ],
                        },
                      }}
                    />
                    <Button
                      color="success"
                      type="submit"
                      className="mt-1 px-2"
                      size="sm"
                      onClick={() => handleSubmit()}
                    >
                      {t("Send")} <Send size={14} />
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </PerfectScrollbar>
        </Fragment>
      ) : null}
    </div>
  );
};

export default MailDetails;
