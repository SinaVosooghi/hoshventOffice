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
import { GET_ITEMS_QUERY as GET_CATEGORY_ITEMS } from "../../category/gql";
import toast from "react-hot-toast";

// ** Third Party Components
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";

const defaultValues = {
  email: "",
  mobilenumber: "",
  password: "",
  firstName: "",
  lastName: "",
  role: null,
};

const checkIsValid = (data) => {
  return Object.values(data).every((field) => {
    return typeof field === "object" ? field !== null : field.length > 0;
  });
};

const SidebarNewUsers = ({ open, toggleSidebar }) => {
  // ** States
  const [data, setData] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const options = { phone: true, phoneRegionCode: "IR" };
  const [categoriesOptions, setCategoriesOptions] = useState([
    { value: "", label: `${t("Select")} ${t("Category")}` },
  ]);
  useQuery(GET_CATEGORY_ITEMS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 100,
        skip: 0,
        status: true,
        type: "user",
      },
    },
    onCompleted: ({ categories }) => {
      categories?.categories?.map((category) =>
        setCategoriesOptions((prev) => [
          ...prev,
          { value: category.id, label: category.title },
        ])
      );
    },
  });

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
    context: {
      headers: {
        "apollo-require-preflight": true,
      },
    },
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toggleSidebar();
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

    create({
      variables: {
        input: {
          ...data,
          role: parseInt(data.role.value),
          category: data.category ? data.category?.value : null,
          usertype: data.usertype.value,
          mobilenumber: parseInt(data.mobilenumber),
        },
      },
    });
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
                placeholder="John"
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
                placeholder="Doe"
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
              <Cleave
                className="form-control"
                placeholder="1 234 567 8900"
                options={options}
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
          <Label className="form-label" for="category">
            {t("Category")}
          </Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                isClearable={false}
                classNamePrefix="select"
                options={categoriesOptions}
                theme={selectThemeColors}
                placeholder={t("Select...")}
                className={classnames("react-select", {
                  "is-invalid": data !== null && data.category === null,
                })}
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
            defaultValue={USER_TYPES[0]}
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

        <div className="mb-1">
          <Label className="form-label" for="avatar">
            {t("Image")}
          </Label>
          <Controller
            control={control}
            name={"avatar"}
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Input
                  {...field}
                  value={value?.fileName}
                  onChange={(event) => {
                    onChange(event.target.files[0]);
                  }}
                  type="file"
                  id="avatar"
                />
              );
            }}
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
