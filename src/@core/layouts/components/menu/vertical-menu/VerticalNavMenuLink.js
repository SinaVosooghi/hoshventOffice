// ** React Imports
import { NavLink } from "react-router-dom";

// ** Third Party Components
import classnames from "classnames";
import { useTranslation } from "react-i18next";

// ** Reactstrap Imports
import { Badge } from "reactstrap";
import { useEffect, useMemo, useState } from "react";
import { useGetOrders } from "../../../../../utility/gqlHelpers/useGetOrders";
import { useGetInvoices } from "../../../../../utility/gqlHelpers/useGetInvoices";

const VerticalNavMenuLink = ({ item, activeItem }) => {
  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? "a" : NavLink;
  const [lang, setLang] = useState("ir");
  const [badgeNumnber, setBadgeNumber] = useState(null);

  // ** Hooks
  const { t, i18n } = useTranslation();
  const { orders } = useGetOrders();
  const { invoices } = useGetInvoices();

  useEffect(() => {
    switch (item.id) {
      case "orders": {
        const count = orders.filter((order) => !order.readat).length;
        setBadgeNumber(count);
        break;
      }
      case "invoiceList": {
        const count = invoices.filter((invoice) => !invoice.readat).length;
        setBadgeNumber(count);
        break;
      }
    }
  }, [item, orders]);

  useMemo(() => {
    if (lang !== i18n.language) {
      setLang(i18n.language);
    }
  }, [i18n.language]);

  return (
    <li
      className={classnames({
        "nav-item": !item.children,
        disabled: item.disabled,
        active: item.navLink === activeItem,
      })}
    >
      <LinkTag
        className="d-flex align-items-center"
        target={item.newTab ? "_blank" : undefined}
        /*eslint-disable */
        {...(item.externalLink === true
          ? {
              href: item.navLink || "/",
            }
          : {
              to: item.navLink || "/",
              className: (i) => {
                if (i.isActive && !item.disabled) {
                  return "d-flex align-items-center active";
                }
              },
            })}
        onClick={(e) => {
          if (
            item.navLink.length === 0 ||
            item.navLink === "#" ||
            item.disabled === true
          ) {
            e.preventDefault();
          }
        }}
      >
        {item.icon}
        <span className="menu-item text-truncate">{t(item.title)}</span>

        {item.badge && item.badgeText && badgeNumnber ? (
          <Badge
            className={`ms-auto ${lang === "ir" ? "me-1 float-end" : "me-1"}`}
            color={item.badge}
            pill
          >
            {badgeNumnber ?? item.badgeText}
          </Badge>
        ) : null}
      </LinkTag>
    </li>
  );
};

export default VerticalNavMenuLink;
