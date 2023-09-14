// ** Reactstrap Imports
import { Nav, NavItem, NavLink } from "reactstrap";

// ** Icons Imports
import {
  User,
  Lock,
  Bookmark,
  Link,
  Bell,
  Globe,
  CreditCard,
  UserCheck,
  Printer,
} from "react-feather";
import { t } from "i18next";

const Tabs = ({ activeTab, toggleTab }) => {
  return (
    <Nav pills className="mb-2">
      <NavItem>
        <NavLink active={activeTab === "1"} onClick={() => toggleTab("1")}>
          <Globe size={18} className="me-50" />
          <span className="fw-bold">{t("Site")}</span>
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink active={activeTab === "2"} onClick={() => toggleTab("2")}>
          <UserCheck size={18} className="me-50" />
          <span className="fw-bold">{t("Register fields")}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "3"} onClick={() => toggleTab("3")}>
          <CreditCard size={18} className="me-50" />
          <span className="fw-bold">{t("Payment Details")}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "4"} onClick={() => toggleTab("4")}>
          <Printer size={18} className="me-50" />
          <span className="fw-bold">{t("Card setting")}</span>
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default Tabs;
