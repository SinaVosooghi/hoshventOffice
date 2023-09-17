import axios from "axios";

//Defaults will be combined with the instance
axios.defaults.baseURL = "/some/page.aspx";

//Create Axios Instance
const axiosInstance = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=UTF-8",
  },
});

//Add interceptors to instance
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.log(12312312);
    } else if (error.response.status === 401) {
      console.log(345345);
    }
    return error;
  }
);

export default axiosInstance;
