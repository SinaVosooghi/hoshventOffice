// ** Custom Components & Plugins
import classnames from "classnames";
import {
  Star,
  Paperclip,
  Link as LinkIcon,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Minus,
  CheckCircle,
  Info,
} from "react-feather";

// ** Custom Component Import
import Avatar from "@components/avatar";

// ** Utils
import { htmlToString } from "@utils";

// ** Reactstrap Imports
import { Badge, Input, Label } from "reactstrap";
import { t } from "i18next";
import { Link } from "react-router-dom";

const ticketPriorities = {
  high: { color: "light-danger", title: "High", icon: <ChevronUp /> },
  medium: { color: "light-success", title: "Medium", icon: <ChevronDown /> },
  low: { color: "light-primary", title: "Low", icon: <Minus /> },
};

const ticketsType = {
  alert: {
    color: "light-danger",
    title: "Alert",
    icon: <AlertCircle color="light-danger" />,
  },
  success: {
    color: "light-success",
    title: "Success",
    icon: <CheckCircle className="me-50" />,
  },
  info: {
    color: "light-primary",
    title: "Info",
    icon: <Info className="me-50" />,
  },
  warning: {
    color: "light-primary",
    title: "Warning",
    icon: <AlertCircle className="me-50" />,
  },
  invoice: {
    color: "light-primary",
    title: "Invoice",
    icon: <Paperclip className="me-50" />,
  },
};

const MailCard = (props) => {
  // ** Props
  const {
    chat,
    dispatch,
    selectMail,
    labelColors,
    updateMails,
    selectedMails,
    handleMailClick,
    handleMailReadUpdate,
    formatToDynamicLocation,
  } = props;

  // ** Function to render labels
  const renderLabels = (arr) => {
    if (arr && arr.length) {
      return arr.map((label) => (
        <span
          key={label}
          className={`bullet bullet-${labelColors[label]} bullet-sm mx-50`}
        ></span>
      ));
    }
  };

  // ** Function to handle read & mail click
  const onMailClick = () => {
    handleMailClick(chat.id);
    handleMailReadUpdate([chat.id], true);
  };

  return (
    <li
      onClick={() => onMailClick(chat.id)}
      className={classnames("d-flex user-mail", { "mail-read": chat.isRead })}
    >
      <div className="mail-left pe-50">
        <Avatar
          initials
          color={"light-primary"}
          className="custom-avatar"
          content={
            chat?.from?.firstName + " " + chat?.from?.lastName || "John Doe"
          }
        />
        <div className="user-action">
          {/* <Input
            label=''
            type='checkbox'
            checked={selectedMails.includes(chat.id)}
            id={`${chat.from.name}-${chat.id}`}
            onChange={e => e.stopPropagation()}
            onClick={e => {
              dispatch(selectMail(chat.id))
              e.stopPropagation()
            }}
          /> */}
          <div className="form-check">
            <Input
              type="checkbox"
              id={`${chat.from}-${chat.id}`}
              onChange={(e) => e.stopPropagation()}
              checked={selectedMails.includes(chat.id)}
              onClick={(e) => {
                dispatch(selectMail(chat.id));
                e.stopPropagation();
              }}
            />
            <Label
              onClick={(e) => e.stopPropagation()}
              for={`${chat.from}-${chat.id}`}
            ></Label>
          </div>
          <div
            className="email-favorite"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(
                updateMails({
                  emailIds: [chat.id],
                  dataToUpdate: { isStarred: !chat.isStarred },
                })
              );
            }}
          >
            <Star
              size={14}
              className={classnames({
                favorite: chat.isStarred,
              })}
            />
          </div>
        </div>
      </div>
      <div className="mail-body">
        <div className="mail-details">
          <div className="mail-items">
            <h5 className="mb-25">
              {chat.from?.firstName + " " + chat.from?.lastName}
              {chat?.invoice && (
                <Link to={`/apps/invoice/preview/${chat?.invoice?.id}`}>
                  <Badge color="info" className="ms-1">
                    <LinkIcon className="me-50" size={14} />
                    <span className="align-middle">
                      {t("Invoice Attached")}
                    </span>
                  </Badge>
                </Link>
              )}
              {chat?.priority && (
                <Badge
                  color={`${ticketPriorities[chat?.priority]?.color} ms-1`}
                >
                  {ticketPriorities[chat?.priority]?.icon}
                  <span className="align-middle">
                    {t(ticketPriorities[chat?.priority]?.title)}
                  </span>
                </Badge>
              )}
              {chat?.type && (
                <Badge color={`${ticketsType[chat?.type]?.color} ms-1`}>
                  {ticketsType[chat?.type]?.icon}
                  <span className="align-middle">
                    {t(ticketsType[chat?.type]?.title)}
                  </span>
                </Badge>
              )}
            </h5>
            <span className="text-truncate">{chat.subject}</span>
            <span className="text-truncate ms-50">
              -- {chat.department?.title}
            </span>
          </div>
          <div className="mail-meta-item">
            {chat.attachments && chat.attachments.length ? (
              <Paperclip size={14} />
            ) : null}
            {renderLabels(chat.labels)}
            <span className="mail-date">
              {formatToDynamicLocation(chat.created)}
            </span>
          </div>
        </div>
        <div className="mail-message">
          <p className="text-truncate mb-0">
            {htmlToString(chat?.messages[0]?.body)}
          </p>
        </div>
      </div>
    </li>
  );
};

export default MailCard;
