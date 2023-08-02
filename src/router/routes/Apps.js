// ** React Imports
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Chat = lazy(() => import("../../views/apps/chat"));
const Todo = lazy(() => import("../../views/apps/todo"));
const Email = lazy(() => import("../../views/apps/ticket"));
const Kanban = lazy(() => import("../../views/apps/kanban"));
const Calendar = lazy(() => import("../../views/apps/calendar"));

const InvoiceAdd = lazy(() => import("../../views/apps/invoice/add"));
const InvoiceList = lazy(() => import("../../views/apps/invoice/list"));
const InvoiceEdit = lazy(() => import("../../views/apps/invoice/edit"));
const InvoicePrint = lazy(() => import("../../views/apps/invoice/print"));
const InvoicePreview = lazy(() => import("../../views/apps/invoice/preview"));

const EcommerceShop = lazy(() => import("../../views/apps/ecommerce/shop"));
const EcommerceDetail = lazy(() => import("../../views/apps/ecommerce/detail"));
const EcommerceWishlist = lazy(() =>
  import("../../views/apps/ecommerce/wishlist")
);
const EcommerceCheckout = lazy(() =>
  import("../../views/apps/ecommerce/checkout")
);

const UserList = lazy(() => import("../../views/apps/user/list"));
const UserView = lazy(() => import("../../views/apps/user/view"));

const Roles = lazy(() => import("../../views/apps/roles-permissions/roles"));
const EditRole = lazy(() => import("../../views/apps/roles-permissions/edit"));
const Permissions = lazy(() =>
  import("../../views/apps/roles-permissions/permissions")
);

const Categories = lazy(() => import("../../views/apps/category/list"));
const EditCategory = lazy(() => import("../../views/apps/category/edit"));
const AddCategory = lazy(() => import("../../views/apps/category/add"));

const Brands = lazy(() => import("../../views/apps/brand/list"));
const EditBrand = lazy(() => import("../../views/apps/brand/edit"));
const AddBrand = lazy(() => import("../../views/apps/brand/add"));

const Workshops = lazy(() => import("../../views/apps/workshops/list"));
const EditWorkshop = lazy(() => import("../../views/apps/workshops/edit"));
const AddWorkshop = lazy(() => import("../../views/apps/workshops/add"));

const Seminars = lazy(() => import("../../views/apps/seminars/list"));
const EditSeminar = lazy(() => import("../../views/apps/seminars/edit"));
const AddSeminar = lazy(() => import("../../views/apps/seminars/add"));

const Halls = lazy(() => import("../../views/apps/halls/list"));
const EditHall = lazy(() => import("../../views/apps/halls/edit"));
const AddHall = lazy(() => import("../../views/apps/halls/add"));

const Questions = lazy(() => import("../../views/apps/questions/list"));
const EditQuestion = lazy(() => import("../../views/apps/questions/edit"));
const AddQuestion = lazy(() => import("../../views/apps/questions/add"));

const Variations = lazy(() => import("../../views/apps/variations/list"));
const EditVariation = lazy(() => import("../../views/apps/variations/edit"));
const AddVariation = lazy(() => import("../../views/apps/variations/add"));

const Sliders = lazy(() => import("../../views/apps/sliders/list"));
const EditSlider = lazy(() => import("../../views/apps/sliders/edit"));
const AddSlider = lazy(() => import("../../views/apps/sliders/add"));

const Departments = lazy(() => import("../../views/apps/department/list"));
const EditDepartment = lazy(() => import("../../views/apps/department/edit"));
const AddDeparment = lazy(() => import("../../views/apps/department/add"));

const Blogs = lazy(() => import("../../views/apps/blog/list"));
const EditBlog = lazy(() => import("../../views/apps/blog/edit"));
const AddBlog = lazy(() => import("../../views/apps/blog/add"));

const Comments = lazy(() => import("../../views/apps/comment/list"));
const EditComment = lazy(() => import("../../views/apps/comment/edit"));
const AddComment = lazy(() => import("../../views/apps/comment/add"));

const Lessons = lazy(() => import("../../views/apps/lesson/list"));
const EditLesson = lazy(() => import("../../views/apps/lesson/edit"));
const AddLesson = lazy(() => import("../../views/apps/lesson/add"));

const Courses = lazy(() => import("../../views/apps/course/list"));
const EditCourse = lazy(() => import("../../views/apps/course/edit"));
const AddCourse = lazy(() => import("../../views/apps/course/add"));

const Certificates = lazy(() => import("../../views/apps/certificate/list"));
const EditCertificate = lazy(() => import("../../views/apps/certificate/edit"));
const AddCertificate = lazy(() => import("../../views/apps/certificate/add"));

const Products = lazy(() => import("../../views/apps/product/list"));
const EditProduct = lazy(() => import("../../views/apps/product/edit"));
const AddProduct = lazy(() => import("../../views/apps/product/add"));

const Shippings = lazy(() => import("../../views/apps/shipping/list"));
const EditShipping = lazy(() => import("../../views/apps/shipping/edit"));
const AddShipping = lazy(() => import("../../views/apps/shipping/add"));

const Coupons = lazy(() => import("../../views/apps/coupon/list"));
const EditCoupon = lazy(() => import("../../views/apps/coupon/edit"));
const AddCoupon = lazy(() => import("../../views/apps/coupon/add"));

const Payments = lazy(() => import("../../views/apps/payment/list"));
const Orders = lazy(() => import("../../views/apps/order/list"));
const Setting = lazy(() => import("../../views/apps/setting"));

const Contacts = lazy(() => import("../../views/apps/contact/list"));
const EditContacts = lazy(() => import("../../views/apps/contact/edit"));

const Sites = lazy(() => import("../../views/apps/site/list"));
const EditSite = lazy(() => import("../../views/apps/site/edit"));
const AddSite = lazy(() => import("../../views/apps/site/add"));
const NewSite = lazy(() => import("../../views/apps/site/new"));

const Events = lazy(() => import("../../views/apps/event/list"));
const EditEvent = lazy(() => import("../../views/apps/event/edit"));
const AddEvent = lazy(() => import("../../views/apps/event/add"));

const Services = lazy(() => import("../../views/apps/services/list"));
const EditService = lazy(() => import("../../views/apps/services/edit"));
const AddService = lazy(() => import("../../views/apps/services/add"));

const Plans = lazy(() => import("../../views/apps/plans/list"));
const EditPlans = lazy(() => import("../../views/apps/plans/edit"));
const AddPlans = lazy(() => import("../../views/apps/plans/add"));

const AppRoutes = [
  {
    element: <Email />,
    path: "/apps/ticket",
    meta: {
      appLayout: true,
      className: "email-application",
    },
  },
  {
    element: <Email />,
    path: "/apps/ticket/:folder",
    meta: {
      appLayout: true,
      className: "email-application",
    },
  },
  {
    element: <Email />,
    path: "/apps/ticket/label/:label",
    meta: {
      appLayout: true,
      className: "email-application",
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
    element: <Todo />,
    path: "/apps/todo",
    meta: {
      appLayout: true,
      className: "todo-application",
    },
  },
  {
    element: <Todo />,
    path: "/apps/todo/:filter",
    meta: {
      appLayout: true,
      className: "todo-application",
    },
  },
  {
    element: <Todo />,
    path: "/apps/todo/tag/:tag",
    meta: {
      appLayout: true,
      className: "todo-application",
    },
  },
  {
    element: <Calendar />,
    path: "/apps/calendar",
  },
  {
    element: <Kanban />,
    path: "/apps/kanban",
    meta: {
      appLayout: true,
      className: "kanban-application",
    },
  },
  {
    element: <InvoiceList />,
    path: "/apps/invoices",
  },
  {
    element: <InvoicePreview />,
    path: "/apps/invoice/preview/:id",
  },
  {
    path: "/apps/invoice/preview",
    element: <Navigate to="/apps/invoice/preview/4987" />,
  },
  {
    element: <InvoiceEdit />,
    path: "/apps/invoice/edit/:id",
  },
  {
    path: "/apps/invoice/edit",
    element: <Navigate to="/apps/invoice/edit/4987" />,
  },
  {
    element: <InvoiceAdd />,
    path: "/apps/invoice/add",
  },
  {
    path: "/apps/invoice/print/:id",
    element: <InvoicePrint />,
    meta: {
      layout: "blank",
    },
  },
  {
    element: <EcommerceShop />,
    path: "/apps/ecommerce/shop",
    meta: {
      className: "ecommerce-application",
    },
  },
  {
    element: <EcommerceWishlist />,
    path: "/apps/ecommerce/wishlist",
    meta: {
      className: "ecommerce-application",
    },
  },
  {
    path: "/apps/ecommerce/product-detail",
    element: (
      <Navigate to="/apps/ecommerce/product-detail/apple-i-phone-11-64-gb-black-26" />
    ),
    meta: {
      className: "ecommerce-application",
    },
  },
  {
    path: "/apps/ecommerce/product-detail/:product",
    element: <EcommerceDetail />,
    meta: {
      className: "ecommerce-application",
    },
  },
  {
    path: "/apps/ecommerce/checkout",
    element: <EcommerceCheckout />,
    meta: {
      className: "ecommerce-application",
    },
  },
  {
    element: <UserList />,
    path: "/apps/user/list/:type",
  },
  {
    path: "/apps/user/view",
    element: <Navigate to="/apps/user/view/1" />,
  },
  {
    element: <UserView />,
    path: "/apps/user/view/:id",
  },
  {
    element: <Roles />,
    path: "/apps/roles",
  },
  {
    element: <EditRole />,
    path: "/apps/roles/edit/:id/",
  },
  {
    element: <Permissions />,
    path: "/apps/permissions",
  },
  {
    element: <Categories />,
    path: "/apps/categories/:type",
  },
  {
    element: <EditCategory />,
    path: "/apps/categories/edit/:type/:id/",
  },
  {
    element: <AddCategory />,
    path: "/apps/categories/add/:type/",
  },

  {
    element: <Brands />,
    path: "/apps/brands/",
  },
  {
    element: <EditBrand />,
    path: "/apps/brands/edit/:id/",
  },
  {
    element: <AddBrand />,
    path: "/apps/brands/add/",
  },
  {
    element: <Workshops />,
    path: "/apps/workshops",
  },
  {
    element: <EditWorkshop />,
    path: "/apps/workshops/edit/:id/",
  },
  {
    element: <AddWorkshop />,
    path: "/apps/workshops/add/",
  },

  {
    element: <Seminars />,
    path: "/apps/seminars",
  },
  {
    element: <EditSeminar />,
    path: "/apps/seminars/edit/:id/",
  },
  {
    element: <AddSeminar />,
    path: "/apps/seminars/add/",
  },
  {
    element: <Halls />,
    path: "/apps/halls",
  },
  {
    element: <EditHall />,
    path: "/apps/halls/edit/:id/",
  },
  {
    element: <AddHall />,
    path: "/apps/halls/add/",
  },
  {
    element: <Sites />,
    path: "/apps/site",
  },
  {
    element: <EditSite />,
    path: "/apps/site/edit",
  },
  {
    element: <AddSite />,
    path: "/apps/site/add",
  },
  {
    element: <NewSite />,
    path: "/apps/site/new",
  },

  {
    element: <Variations />,
    path: "/apps/variations",
  },
  {
    element: <EditVariation />,
    path: "/apps/variations/edit/:id/",
  },
  {
    element: <AddVariation />,
    path: "/apps/variations/add",
  },
  {
    element: <Sliders />,
    path: "/apps/sliders",
  },
  {
    element: <EditSlider />,
    path: "/apps/sliders/edit/:id/",
  },
  {
    element: <AddSlider />,
    path: "/apps/sliders/add/",
  },
  {
    element: <Events />,
    path: "/apps/events",
  },
  {
    element: <EditEvent />,
    path: "/apps/events/edit/:id/",
  },
  {
    element: <AddEvent />,
    path: "/apps/events/add/",
  },
  {
    element: <Services />,
    path: "/apps/services",
  },
  {
    element: <EditService />,
    path: "/apps/services/edit/:id/",
  },
  {
    element: <AddService />,
    path: "/apps/services/add/",
  },
  {
    element: <Plans />,
    path: "/apps/plans",
  },
  {
    element: <EditPlans />,
    path: "/apps/plans/edit/:id/",
  },
  {
    element: <AddPlans />,
    path: "/apps/plans/add/",
  },
  {
    element: <Blogs />,
    path: "/apps/blogs/",
  },
  {
    element: <EditBlog />,
    path: "/apps/blogs/edit/:id/",
  },
  {
    element: <AddBlog />,
    path: "/apps/blogs/add/",
  },
  {
    element: <Comments />,
    path: "/apps/comments/",
  },
  {
    element: <EditComment />,
    path: "/apps/comments/edit/:id/",
  },
  {
    element: <AddComment />,
    path: "/apps/comments/add/",
  },

  {
    element: <Courses />,
    path: "/apps/courses/",
  },
  {
    element: <EditCourse />,
    path: "/apps/courses/edit/:id/",
  },
  {
    element: <AddCourse />,
    path: "/apps/courses/add/",
  },

  {
    element: <Lessons />,
    path: "/apps/lessons/",
  },
  {
    element: <EditLesson />,
    path: "/apps/lessons/edit/:id/",
  },
  {
    element: <AddLesson />,
    path: "/apps/lessons/add/",
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
    element: <Products />,
    path: "/apps/products/",
  },
  {
    element: <EditProduct />,
    path: "/apps/products/edit/:id/",
  },
  {
    element: <AddProduct />,
    path: "/apps/products/add/",
  },

  {
    element: <Shippings />,
    path: "/apps/shippings/",
  },
  {
    element: <EditShipping />,
    path: "/apps/shippings/edit/:id/",
  },
  {
    element: <AddShipping />,
    path: "/apps/shippings/add/",
  },

  {
    element: <Coupons />,
    path: "/apps/coupons/:type",
  },
  {
    element: <EditCoupon />,
    path: "/apps/coupons/edit/:type/:id/",
  },
  {
    element: <AddCoupon />,
    path: "/apps/coupons/:type/add/",
  },

  {
    element: <Payments />,
    path: "/apps/payments",
  },
  {
    element: <Orders />,
    path: "/apps/orders",
  },

  {
    element: <Departments />,
    path: "/apps/departments/",
  },
  {
    element: <EditDepartment />,
    path: "/apps/departments/edit/:id/",
  },
  {
    element: <AddDeparment />,
    path: "/apps/departments/add/",
  },

  {
    element: <Questions />,
    path: "/apps/questions/",
  },
  {
    element: <EditQuestion />,
    path: "/apps/questions/edit/:id/",
  },
  {
    element: <AddQuestion />,
    path: "/apps/questions/add/",
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
];

export default AppRoutes;
