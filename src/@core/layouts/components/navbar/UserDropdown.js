// ** React Imports
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
import { isUserLoggedIn } from "@utils";

// ** Store & Actions
import { useDispatch } from "react-redux";
import { handleLogout } from "@store/authentication";

// ** Third Party Components
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power,
} from "react-feather";

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import { useGetUser } from "../../../../utility/gqlHelpers/useGetUser";
import { t } from "i18next";
import { capitalizeFirstLetter } from "../../../../utility/Utils";

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch();

  // ** Get user with token
  const { user, error } = useGetUser();

  // ** State
  const [userData, setUserData] = useState(null);

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      if (error === "Unauthorized") {
        dispatch(handleLogout());
      }
      setUserData(user);
    }
  }, [user, error]);

  // ** renders client avatar
  const renderClient = (row) => {
    const stateNum = Math.floor(Math.random() * 6),
      states = [
        "light-success",
        "light-danger",
        "light-warning",
        "light-info",
        "light-primary",
        "light-secondary",
      ],
      color = states[stateNum];

    if (row?.avatar?.length) {
      return (
        <Avatar
          img={`${import.meta.env.VITE_BASE_API}/${row?.avatar}`}
          imgHeight="40"
          imgWidth="40"
          status="online"
        />
      );
    } else {
      return (
        <Avatar
          color={color}
          imgHeight="40"
          imgWidth="40"
          width="40"
          height="40"
          status="online"
          content={row ? row?.firstName + " " + row?.lastName : "John Doe"}
          initials
        />
      );
    }
  };

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        {renderClient(userData)}
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name fw-bold">
            {(userData && userData.firstName + " " + userData.lastName) ||
              "John Doe"}
          </span>
          <span className="user-status">
            {(userData && t(capitalizeFirstLetter(userData.usertype))) ||
              "Admin"}
          </span>
        </div>
      </DropdownToggle>
      <DropdownMenu end>
        {/* <DropdownItem tag={Link} to="/pages/profile">
          <User size={14} className="me-75" />
          <span className="align-middle">Profile</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/apps/email">
          <Mail size={14} className="me-75" />
          <span className="align-middle">Inbox</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/apps/todo">
          <CheckSquare size={14} className="me-75" />
          <span className="align-middle">Tasks</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/apps/chat">
          <MessageSquare size={14} className="me-75" />
          <span className="align-middle">Chats</span>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem tag={Link} to="/pages/account-settings">
          <Settings size={14} className="me-75" />
          <span className="align-middle">Settings</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/pages/pricing">
          <CreditCard size={14} className="me-75" />
          <span className="align-middle">Pricing</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/pages/faq">
          <HelpCircle size={14} className="me-75" />
          <span className="align-middle">FAQ</span>
        </DropdownItem> */}
        <DropdownItem
          tag={Link}
          to="/login"
          onClick={() => dispatch(handleLogout())}
        >
          <Power size={14} className="me-75" />
          <span className="align-middle">{t("Logout")}</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
