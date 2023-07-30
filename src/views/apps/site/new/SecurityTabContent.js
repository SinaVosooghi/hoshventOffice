// ** React Imports
import { Fragment, useState } from "react";
import classnames from "classnames";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  Label,
} from "reactstrap";

// ** Third Party Components
import { Controller } from "react-hook-form";
import Select from "react-select";
import { selectThemeColors } from "@utils";

// ** Demo Components
import { t } from "i18next";
import { GET_ITEMS_QUERY } from "../../user/gql";
import { useQuery } from "@apollo/client";

const countryOptions = [
  { value: 1, label: "ایران" },
  { value: 2, label: "USA" },
  { value: 3, label: "France" },
  { value: 4, label: "United Kingdom" },
];

const statusOptions = [
  { value: true, label: t("Active") },
  { value: false, label: t("Deactive") },
];

const SecurityTabContent = ({ handleSubmit, errors, control }) => {
  const [usersOptions, setUsersOptions] = useState([]);
  useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 100,
        skip: 0,
        status: true,
        usertype: "merchant",
      },
    },
    onCompleted: ({ users }) => {
      users?.users?.map((user) =>
        setUsersOptions((prev) => [
          ...prev,
          { value: user.id, label: user.firstName + "" + user?.lastName ?? "" },
        ])
      );
    },
  });
  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">{t("Manage Site")}</CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          <Row>
            <Col sm="4" className="mb-1">
              <Label className="form-label" for="user">
                {t("User")}
              </Label>
              <Controller
                name="user"
                control={control}
                defaultValue={usersOptions[0]}
                render={({ field }) => (
                  <Select
                    id="user"
                    isClearable={false}
                    className="react-select"
                    classNamePrefix="select"
                    options={usersOptions}
                    theme={selectThemeColors}
                    defaultValue={usersOptions[0]}
                    {...field}
                  />
                )}
              />
            </Col>
            <Col sm="4" className="mb-1">
              <Label className="form-label" for="status">
                {t("Status")}
              </Label>
              <Controller
                name="status"
                control={control}
                defaultValue={{ value: true, label: t("Active") }}
                render={({ field }) => (
                  <Select
                    isClearable={false}
                    classNamePrefix="select"
                    options={statusOptions}
                    theme={selectThemeColors}
                    placeholder={t("Select...")}
                    className={classnames("react-select")}
                    {...field}
                  />
                )}
              />
            </Col>

            <Col className="mt-1" sm="12">
              <Button color="success" className="me-1" type="submit">
                {t("Save")}
              </Button>
              <Button color="secondary" outline>
                {t("Discard")}
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default SecurityTabContent;
