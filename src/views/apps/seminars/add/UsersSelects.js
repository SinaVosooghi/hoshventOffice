import Select, { components } from "react-select"; // eslint-disable-line
import Avatar from "@components/avatar";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { t } from "i18next";
import { GET_ITEMS_QUERY } from "../../user/gql";

// ** Reactstrap Imports
import { selectThemeColors } from "@utils";

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

export const UserSelect = ({ usertype, users, setUsers }) => {
  const [usersOptions, setUsersOptions] = useState([]);

  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 100,
        skip: 0,
        status: true,
        usertype: usertype,
      },
    },
    onCompleted: ({ users }) => {
      users?.users?.map((user) =>
        setUsersOptions((prev) => [
          ...prev,
          {
            value: user.id,
            label: user.firstName + " " + user?.lastName ?? "",
            avatar: user.avatar,
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
      options={usersOptions}
      theme={selectThemeColors}
      value={users.length ? [...users] : null}
      onChange={(data) => setUsers([...data])}
      placeholder={t("Select...")}
      components={{
        Option: GuestsComponent,
      }}
    />
  );
};
