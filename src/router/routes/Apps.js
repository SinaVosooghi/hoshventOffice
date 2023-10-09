// ** React Imports
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const UserList = lazy(() => import("../../views/apps/user/list"));
const UserView = lazy(() => import("../../views/apps/user/view"));

const Roles = lazy(() => import("../../views/apps/roles-permissions/roles"));
const EditRole = lazy(() => import("../../views/apps/roles-permissions/edit"));
const Permissions = lazy(() =>
  import("../../views/apps/roles-permissions/permissions")
);
const Chat = lazy(() => import("../../views/apps/chat"));

const Categories = lazy(() => import("../../views/apps/category/list"));
const EditCategory = lazy(() => import("../../views/apps/category/edit"));
const AddCategory = lazy(() => import("../../views/apps/category/add"));

const Brands = lazy(() => import("../../views/apps/brand/list"));
const EditBrand = lazy(() => import("../../views/apps/brand/edit"));
const AddBrand = lazy(() => import("../../views/apps/brand/add"));

const Menus = lazy(() => import("../../views/apps/menus/list"));
const EditMenu = lazy(() => import("../../views/apps/menus/edit"));
const AddMenu = lazy(() => import("../../views/apps/menus/add"));

const Workshops = lazy(() => import("../../views/apps/workshops/list"));
const EditWorkshop = lazy(() => import("../../views/apps/workshops/edit"));
const AddWorkshop = lazy(() => import("../../views/apps/workshops/add"));

const Seminars = lazy(() => import("../../views/apps/seminars/list"));
const EditSeminar = lazy(() => import("../../views/apps/seminars/edit"));
const AddSeminar = lazy(() => import("../../views/apps/seminars/add"));

const Halls = lazy(() => import("../../views/apps/halls/list"));
const EditHall = lazy(() => import("../../views/apps/halls/edit"));
const AddHall = lazy(() => import("../../views/apps/halls/add"));

const Sliders = lazy(() => import("../../views/apps/sliders/list"));
const EditSlider = lazy(() => import("../../views/apps/sliders/edit"));
const AddSlider = lazy(() => import("../../views/apps/sliders/add"));

const Departments = lazy(() => import("../../views/apps/department/list"));
const EditDepartment = lazy(() => import("../../views/apps/department/edit"));
const AddDeparment = lazy(() => import("../../views/apps/department/add"));

const Certificates = lazy(() => import("../../views/apps/certificate/list"));
const EditCertificate = lazy(() => import("../../views/apps/certificate/edit"));
const AddCertificate = lazy(() => import("../../views/apps/certificate/add"));

const Payments = lazy(() => import("../../views/apps/payment/list"));

const Contacts = lazy(() => import("../../views/apps/contact/list"));
const EditContacts = lazy(() => import("../../views/apps/contact/edit"));

const EditSite = lazy(() => import("../../views/apps/site/edit"));

const Events = lazy(() => import("../../views/apps/event/list"));
const EditEvent = lazy(() => import("../../views/apps/event/edit"));
const AddEvent = lazy(() => import("../../views/apps/event/add"));
const Email = lazy(() => import("../../views/apps/ticket"));

const Services = lazy(() => import("../../views/apps/services/list"));
const EditService = lazy(() => import("../../views/apps/services/edit"));
const AddService = lazy(() => import("../../views/apps/services/add"));

const AppRoutes = [
  {
    element: <Email />,
    path: "/apps/ticket",
    meta: {
      appLayout: true,
      className: "email-application",
      action: "read",
      resource: "read-messages",
    },
  },
  {
    element: <Email />,
    path: "/apps/ticket/:folder",
    meta: {
      appLayout: true,
      className: "email-application",
      action: "read",
      resource: "read-messages",
    },
  },
  {
    element: <Email />,
    path: "/apps/ticket/label/:label",
    meta: {
      appLayout: true,
      className: "email-application",
      action: "read",
      resource: "read-messages",
    },
  },
  {
    element: <Email />,
    path: "/apps/ticket/:filter",
  },
  {
    path: "/apps/chat",
    element: <Chat />,
    meta: {
      appLayout: true,
      className: "chat-application",
    },
  },
  {
    element: <UserList />,
    path: "/apps/user/list/:type",
    meta: {
      action: "read",
      resource: "read-users",
    },
  },
  {
    path: "/apps/user/view",
    element: <Navigate to="/apps/user/view/1" />,
    meta: {
      action: "read",
      resource: "read-users",
    },
  },
  {
    element: <UserView />,
    path: "/apps/user/view/:id",
    meta: {
      action: "read",
      resource: "read-users",
    },
  },
  {
    element: <Roles />,
    path: "/apps/roles",
    meta: {
      action: "read",
      resource: "read-roles",
    },
  },
  {
    element: <EditRole />,
    path: "/apps/roles/edit/:id/",
    meta: {
      action: "update",
      resource: "update-users",
    },
  },
  {
    element: <Permissions />,
    path: "/apps/permissions",
  },
  {
    element: <Categories />,
    path: "/apps/categories/:type",
    meta: {
      action: "read",
      resource: "read-categories",
    },
  },
  {
    element: <EditCategory />,
    path: "/apps/categories/edit/:type/:id/",
    meta: {
      action: "update",
      resource: "update-categories",
    },
  },
  {
    element: <AddCategory />,
    path: "/apps/categories/add/:type/",
    meta: {
      action: "create",
      resource: "create-categories",
    },
  },
  {
    element: <Brands />,
    path: "/apps/brands/",
    meta: {
      action: "read",
      resource: "read-brands",
    },
  },
  {
    element: <EditBrand />,
    path: "/apps/brands/edit/:id/",
    meta: {
      action: "read",
      resource: "read-brands",
    },
  },
  {
    element: <AddBrand />,
    path: "/apps/brands/add/",
    meta: {
      action: "create",
      resource: "create-brands",
    },
  },

  {
    element: <Menus />,
    path: "/apps/Menus/",
    meta: {
      action: "read",
      resource: "read-menus",
    },
  },
  {
    element: <EditMenu />,
    path: "/apps/Menus/edit/:id/",
    meta: {
      action: "update",
      resource: "update-menus",
    },
  },
  {
    element: <AddMenu />,
    path: "/apps/Menus/add/",
    meta: {
      action: "create",
      resource: "create-menus",
    },
  },
  {
    element: <Workshops />,
    path: "/apps/workshops",
    meta: {
      action: "read",
      resource: "read-workshops",
    },
  },
  {
    element: <EditWorkshop />,
    path: "/apps/workshops/edit/:id/",
    meta: {
      action: "update",
      resource: "update-workshops",
    },
  },
  {
    element: <AddWorkshop />,
    path: "/apps/workshops/add/",
    meta: {
      action: "create",
      resource: "create-workshops",
    },
  },
  {
    element: <Services />,
    path: "/apps/services",
    meta: {
      action: "read",
      resource: "read-services",
    },
  },
  {
    element: <EditService />,
    path: "/apps/services/edit/:id/",
    meta: {
      action: "update",
      resource: "update-services",
    },
  },
  {
    element: <AddService />,
    path: "/apps/services/add/",
    meta: {
      action: "create",
      resource: "create-services",
    },
  },
  {
    element: <Seminars />,
    path: "/apps/seminars",
    meta: {
      action: "read",
      resource: "read-seminars",
    },
  },
  {
    element: <EditSeminar />,
    path: "/apps/seminars/edit/:id/",
    meta: {
      action: "update",
      resource: "update-seminars",
    },
  },
  {
    element: <AddSeminar />,
    path: "/apps/seminars/add/",
    meta: {
      action: "create",
      resource: "create-seminars",
    },
  },
  {
    element: <Halls />,
    path: "/apps/halls",
    meta: {
      action: "read",
      resource: "read-halls",
    },
  },
  {
    element: <EditHall />,
    path: "/apps/halls/edit/:id/",
    meta: {
      action: "update",
      resource: "update-halls",
    },
  },
  {
    element: <AddHall />,
    path: "/apps/halls/add/",
    meta: {
      action: "create",
      resource: "create-halls",
    },
  },

  {
    element: <Sliders />,
    path: "/apps/sliders",
    meta: {
      action: "read",
      resource: "read-sliders",
    },
  },
  {
    element: <EditSlider />,
    path: "/apps/sliders/edit/:id/",
    meta: {
      action: "update",
      resource: "update-sliders",
    },
  },
  {
    element: <AddSlider />,
    path: "/apps/sliders/add/",
    meta: {
      action: "create",
      resource: "create-sliders",
    },
  },
  {
    element: <Events />,
    path: "/apps/events",
    meta: {
      action: "read",
      resource: "read-events",
    },
  },
  {
    element: <EditEvent />,
    path: "/apps/events/edit/:id/",
    meta: {
      action: "update",
      resource: "update-events",
    },
  },
  {
    element: <AddEvent />,
    path: "/apps/events/add/",
    meta: {
      action: "create",
      resource: "create-events",
    },
  },

  {
    element: <Certificates />,
    path: "/apps/certificates/",
  },
  {
    element: <EditCertificate />,
    path: "/apps/certificates/edit/:id/",
  },
  {
    element: <AddCertificate />,
    path: "/apps/certificates/add/",
  },

  {
    element: <Payments />,
    path: "/apps/payments",
    meta: {
      action: "read",
      resource: "read-payments",
    },
  },

  {
    element: <Departments />,
    path: "/apps/departments/",
    meta: {
      action: "read",
      resource: "HOME",
    },
  },
  {
    element: <EditDepartment />,
    path: "/apps/departments/edit/:id/",
    meta: {
      action: "read",
      resource: "HOME",
    },
  },
  {
    element: <AddDeparment />,
    path: "/apps/departments/add/",
    meta: {
      action: "read",
      resource: "HOME",
    },
  },

  {
    element: <Contacts />,
    path: "/apps/contacts/",
    meta: {
      action: "read",
      resource: "HOME",
    },
  },
  {
    element: <EditContacts />,
    path: "/contacts/edit/:id/",
    meta: {
      action: "read",
      resource: "HOME",
    },
  },
  {
    element: <EditSite />,
    path: "/apps/site/edit",
    meta: {
      action: "read",
      resource: "HOME",
    },
  },
];

export default AppRoutes;
