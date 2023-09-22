import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { DefaultRoute } from "../router/routes";
import momentJalali from "moment-jalaali";
import moment from "moment";
// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0;

// ** Returns K format from a number
export const kFormatter = (num) =>
  num > 999 ? `${(num / 1000).toFixed(1)}k` : num;

// ** Converts HTML to string
export const htmlToString = (html) => {
  if (!html) return false;
  return html.replace(/<\/?[^>]+(>|$)/g, "");
};

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date();
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  );
};

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (
  value,
  formatting = { month: "short", day: "numeric", year: "numeric" }
) => {
  if (!value) return value;
  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
};

export const formatToDynamicLocation = (value, lang = "en") => {
  return lang === "ir"
    ? momentJalali(value).format("jYYYY/jMM/jDD h:mm a")
    : moment(value).format("YYYY/MM/DD h:mm a");
};

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value);
  let formatting = { month: "short", day: "numeric" };

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: "numeric", minute: "numeric" };
  }

  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
};

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem("userData");
export const getUserData = () => JSON.parse(localStorage.getItem("userData"));

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === "super" || userRole === "tenant") return DefaultRoute;
  return "/login";
};

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: "#0477bf1a", // for option hover bg-color
    primary: "#0477bf", // for selected option bg-color
    neutral10: "#0477bf", // for tags bg-color
    neutral20: "#ededed", // for input border-color
    neutral30: "#ededed", // for input hover border-color
  },
});

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const noDataToDisplay = () => {
  return (
    <div style={{ padding: 24 }}>{t("There are no records to display")}</div>
  );
};

export const hashConfig = {
  trigger: "#",
  separator: " ",
};

export const convertHtmlToDraft = (body) => {
  const contentBlock = htmlToDraft(body);
  const contentState = ContentState.createFromBlockArray(
    contentBlock.contentBlocks
  );
  const editorState = EditorState.createWithContent(contentState);

  return editorState;
};

export const thousandSeperator = (x) => {
  if (x > 0) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return 0;
  }
};

export const validateURL = (link) => {
  if (link.indexOf("http://") === 0 || link.indexOf("https://") === 0) {
    return true;
  } else {
    return false;
  }
};

export const showImage = (image) => {
  if (image) {
    return image && validateURL(image)
      ? image
      : import.meta.env.VITE_BASE_API + "/" + image;
  }
  return "error";
};

// ** Group by date
/*
 *   Array of Object should include created property
 *   [
 *     {
 *        created: '2017-10-14T20:34:30+00:00'
 *     }
 *   ]
 *
 */
export const groupByDate = (data) => {
  const chartData = [];

  const d = data.reduce((groups, item) => {
    const date = item.created.split("T")[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  Object.keys(d).map((item) => {
    chartData.push({
      date: item,
      count: d[item].length,
    });
  });

  return chartData;
};
