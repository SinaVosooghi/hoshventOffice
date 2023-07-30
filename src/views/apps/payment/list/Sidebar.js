// ** React Import
import { useState } from "react";

// ** Custom Components
import Sidebar from "@components/sidebar";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Third Party Components
import Select from "react-select";
import classnames from "classnames";
import { useForm, Controller } from "react-hook-form";

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input } from "reactstrap";
import InputPasswordToggle from "@components/input-password-toggle";

// ** Store & Actions
import { t } from "i18next";
import { useQuery, useMutation } from "@apollo/client";
import { CREATE_ITEM_MUTATION, GET_ITEMS_QUERY, USER_TYPES } from "../gql";
import { GET_ITEMS_QUERY as GET_ROLE_ITEMS } from "../../roles-permissions/gql";
import toast from "react-hot-toast";

const defaultValues = {
  email: "",
  mobilenumber: "",
  password: "",
  firstName: "",
  lastName: "",
  role: null,
  usertype: null,
};

const checkIsValid = (data) => {
  return Object.values(data).every((field) =>
    typeof field === "object" ? field !== null : field.length > 0
  );
};

const SidebarNewUsers = ({ open, toggleSidebar }) => {
  // ** States
  const [data, setData] = useState(null);
  const [roleOptions, setRoleOptions] = useState([
    { value: "", label: `${t("Select")} ${t("Role")}` },
  ]);

  useQuery(GET_ROLE_ITEMS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 5,
        skip: 0,
      },
    },
    onCompleted: ({ roles }) => {
      roles?.roles?.map((role) =>
        setRoleOptions((prev) => [
          ...prev,
          { value: role.id, label: role.title },
        ])
      );
    },
  });

  const [create] = useMutation(CREATE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  // ** Vars
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  // ** Function to handle form submit
  const onSubmit = (data) => {
    setData(data);

    if (checkIsValid(data)) {
      toggleSidebar();
      create({
        variables: {
          input: {
            ...data,
            role: parseInt(data.role.value),
            usertype: data.usertype.value,
            mobilenumber: parseInt(data.mobilenumber),
          },
        },
      });
    } else {
      for (const key in data) {
        if (data[key] === null) {
          setError("role", {
            type: "manual",
          });
        }
        if (data[key] !== null && data[key].length === 0) {
          setError(key, {
            type: "manual",
          });
        }
      }
    }
  };

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, "");
    }
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title={` ${t("New")} ${t("User")}`}
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label className="form-label" for="firstName">
            {t("Firstname")} <span className="text-danger">*</span>
          </Label>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Input
                id="firstName"
                placeholder="John Doe"
                invalid={errors.firstName && true}
                {...field}
              />
            )}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="lastName">
            {t("lastname")} <span className="text-danger">*</span>
          </Label>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Input
                id="lastName"
                placeholder="johnDoe99"
                invalid={errors.lastName && true}
                {...field}
              />
            )}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="email">
            {t("Email")} <span className="text-danger">*</span>
          </Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                type="email"
                id="email"
                placeholder="john.doe@example.com"
                invalid={errors.email && true}
                {...field}
              />
            )}
          />
          <FormText color="muted">
            {t("You can use letters, numbers & periods")}
          </FormText>
        </div>

        <div className="mb-1">
          <Label className="form-label" for="mobilenumber">
            {t("Mobile number")} <span className="text-danger">*</span>
          </Label>
          <Controller
            name="mobilenumber"
            control={control}
            render={({ field }) => (
              <Input
                id="mobilenumber"
                placeholder="09389219292"
                invalid={errors.mobilenumber && true}
                {...field}
              />
            )}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="company">
            {t("Password")} <span className="text-danger">*</span>
          </Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <InputPasswordToggle
                htmlFor="basic-default-password"
                {...field}
              />
            )}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="role">
            {t("User")} {t("Role")} <span className="text-danger">*</span>
          </Label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                isClearable={false}
                classNamePrefix="select"
                options={roleOptions}
                theme={selectThemeColors}
                placeholder={t("Select...")}
                className={classnames("react-select", {
                  "is-invalid": data !== null && data.role === null,
                })}
                {...field}
              />
            )}
          />
        </div>
        <div className="mb-1">
          <Label className="form-label" for="usertype">
            {t("User")} {t("Type")} <span className="text-danger">*</span>
          </Label>
          <Controller
            name="usertype"
            required
            control={control}
            render={({ field }) => (
              <Select
                isClearable={false}
                classNamePrefix="select"
                options={USER_TYPES}
                placeholder={t("Select...")}
                theme={selectThemeColors}
                className={classnames("react-select", {
                  "is-invalid": data !== null && data.usertype === null,
                })}
                {...field}
              />
            )}
          />
        </div>
        <Button type="submit" className="me-1" color="primary">
          {t("Submit")}
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          {t("Cancel")}
        </Button>
      </Form>
    </Sidebar>
  );
};

export default SidebarNewUsers;
