// ** Navigation imports
import apps from "./apps";
import pages from "./pages";
import others from "./others";
import charts from "./charts";
import dashboards from "./dashboards";
import formsAndTables from "./forms-tables";
import payments from "./payments";

// ** Merge & Export
export default [
  ...dashboards,
  ...apps,
  ...formsAndTables,
  ...pages,
  ...charts,
  ...payments,
  ...others,
];
