import Select, { components } from "react-select"; // eslint-disable-line
import Avatar from "@components/avatar";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { t } from "i18next";

// ** Reactstrap Imports
import { selectThemeColors } from "@utils";
import { GET_ITEMS_QUERY } from "../../event/gql";

const GuestsComponent = ({ data, ...props }) => {
  return (
    <components.Option {...props}>
      <div className="d-flex flex-wrap align-items-center">
        {renderUserImg(data.avatar)}
        <div>{data.label}</div>
      </div>
    </components.Option>
  );
};

// ** render user img
const renderUserImg = (avatar) => {
  if (avatar) {
    return (
      <Avatar
        className="my-0 me-1"
        size="sm"
        img={`${import.meta.env.VITE_BASE_API}/${avatar}`}
      />
    );
  } else {
    return <Avatar className="my-0 me-1" size="sm" />;
  }
};

export const EventsMultiSelect = ({ items, setItems }) => {
  const [eventsOptions, setEventsOptions] = useState([]);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 100,
        skip: 0,
        status: true,
      },
    },
    onCompleted: ({ events }) => {
      events?.events?.map((event) =>
        setEventsOptions((prev) => [
          ...prev,
          {
            value: event.id,
            label: event.title,
            avatar: event.image,
          },
        ])
      );
    },
  });

  return (
    <Select
      isMulti
      id="lecturers"
      className="react-select"
      classNamePrefix="select"
      isClearable={false}
      options={eventsOptions}
      theme={selectThemeColors}
      value={items.length ? [...items] : null}
      onChange={(data) => setItems([...data])}
      placeholder={t("Select...")}
      components={{
        Option: GuestsComponent,
      }}
    />
  );
};
