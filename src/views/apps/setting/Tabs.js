// ** Reactstrap Imports
import { Nav, NavItem, NavLink } from "reactstrap";

// ** Icons Imports
import {
  User,
  Lock,
  Bookmark,
  Link,
  Bell,
  AlertCircle,
  FileText,
  Twitter,
  ShoppingCart,
  HelpCircle,
} from "react-feather";
import { t } from "i18next";

const Tabs = ({ activeTab, toggleTab }) => {
  return (
    <Nav pills className="mb-2">
      <NavItem>
        <NavLink active={activeTab === "1"} onClick={() => toggleTab("1")}>
          <User size={18} className="me-50" />
          <span className="fw-bold">{t("Website")}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "2"} onClick={() => toggleTab("2")}>
          <AlertCircle size={18} className="me-50" />
          <span className="fw-bold">{t("Maintenance")}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "3"} onClick={() => toggleTab("3")}>
          <Twitter size={18} className="me-50" />
          <span className="fw-bold">{t("Social media setting")}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "4"} onClick={() => toggleTab("4")}>
          <FileText size={18} className="me-50" />
          <span className="fw-bold">{t("Text settings")}</span>
        </NavLink>
      </NavItem>
      {/* <NavItem>
        <NavLink active={activeTab === "4"} onClick={() => toggleTab("4")}>
          <Bell size={18} className="me-50" />
          <span className="fw-bold">{t("Notifications")}</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "5"} onClick={() => toggleTab("5")}>
          <Link size={18} className="me-50" />
          <span className="fw-bold">{t("Connections")}</span>
        </NavLink>
      </NavItem> */}
      <NavItem>
        <NavLink active={activeTab === "7"} onClick={() => toggleTab("7")}>
          <ShoppingCart size={18} className="me-50" />
          <span className="fw-bold">{t("Shop settings")}</span>
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default Tabs;
