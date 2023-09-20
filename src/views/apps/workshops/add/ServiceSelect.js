import Select, { components } from "react-select"; // eslint-disable-line
import Avatar from "@components/avatar";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { t } from "i18next";
import { GET_ITEMS_QUERY } from "../../services/gql";

// ** Reactstrap Imports
import { selectThemeColors } from "@utils";

export const ServicesSelect = ({ services, setServices }) => {
  const [servicesOptions, setServicesOptions] = useState([]);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 100,
        skip: 0,
        status: true,
      },
    },
    onCompleted: ({ services }) => {
      services?.services?.map((service) =>
        setServicesOptions((prev) => [
          ...prev,
          {
            value: service.id,
            label: service.title,
            avatar: `${import.meta.env.VITE_BASE_API}/${service.image}`,
          },
        ])
      );
    },
  });

  return (
    <Select
      isMulti
      id="services"
      className="react-select"
      classNamePrefix="select"
      isClearable={false}
      options={servicesOptions}
      theme={selectThemeColors}
      value={services?.length ? [...services] : null}
      onChange={(data) => setServices([...data])}
      placeholder={t("Select...")}
    />
  );
};
