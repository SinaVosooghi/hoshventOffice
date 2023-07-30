// ** React Imports
import { Fragment } from "react";

// ** Roles Components
import Table from "./Table";
import RoleCards from "./RoleCards";
import { t } from "i18next";

const Roles = () => {
  return (
    <Fragment>
      <h3>{t("Roles List")}</h3>
      <RoleCards />
      <h3 className="mt-50">{t("Total users with their roles")}</h3>
      <p className="mb-2">
        {t("Find all of your company’s administrator accounts and their associate roles.")}
      </p>
      <div className="app-user-list">
        <Table />
      </div>
    </Fragment>
  );
};

export default Roles;
