import { useState } from "react";
import { GET_ITEMS_QUERY } from "../../views/apps/course/gql";
import { useQuery } from "@apollo/client";
import { t } from "i18next";

export const getCoursesSelect = (type) => {
  const [coursesData, setCoursesData] = useState([
    { value: "", label: `${t("Select")} ${t("Course")}...`, data: null },
  ]);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        skip: 0,
        usertype: type,
      },
    },
    onCompleted: ({ courses }) => {
      courses?.courses?.map((course) => {
        setCoursesData((prev) => [
          ...prev,
          {
            value: course.id,
            label: `(${course.offprice ?? course.price}) ` + course.title,
            price: course.offprice ?? course.price,
          },
        ]);
      });
    },
  });

  return coursesData;
};
