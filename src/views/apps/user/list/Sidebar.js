// ** React Import
import { useState } from "react";

// ** Custom Components
import Sidebar from "@components/sidebar";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Third Party Components
import Select from "react-select";
import classnames from "classnames";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input, Row, Col } from "reactstrap";
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
import { SeminarMultiSelect } from "./SeminarMultiSelect";
import { WorkshopMultiSelect } from "./WorkshopMultiSelect";
import { ServicesMultiSelect } from "./ServiceMultiSelect";

const defaultValues = {
  email: "",
  mobilenumber: "",
  password: "",
  firstName: "",
  lastName: "",
  role: null,
};

const SidebarNewUsers = ({ open, toggleSidebar }) => {
  const SignupSchema = yup.object().shape({
    firstName: yup
      .string()
      .required(`${t("Firstname")} ${t("field is required")}`),
    lastName: yup
      .string()
      .required(`${t("Lastname")} ${t("field is required")}`),
    mobilenumber: yup
      .string()
      .required(`${t("Mobile")} ${t("field is required")}`),
    email: yup.string().required(`${t("Email")} ${t("field is required")}`),
  });
  // ** States
  const [data, setData] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const [seminarItems, setSeminarItems] = useState([]);
  const [workshopItems, setWorkshopItems] = useState([]);
  const [servicesItems, setServices] = useState([]);

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
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });

  // ** Function to handle form submit
  const onSubmit = (data) => {
    setData(data);

    const workshopFiltered = workshopItems.map((m) => m.value);
    const seminarFiltered = seminarItems.map((m) => m.value);
    const servicesFiltered = servicesItems.map((m) => m.value);

    create({
      variables: {
        input: {
          ...data,
          role: parseInt(data.role.value),
          category: data.category ? data.category?.value : null,
          usertype: data.usertype.value,
          mobilenumber: parseInt(data.mobilenumber),
          seminars: seminarFiltered,
          workshops: workshopFiltered,
          siteid: data.siteid ? data.siteid?.value : null,
          services: servicesFiltered,
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
        <Row>
          <Col md={6}>
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
          </Col>
          <Col md="6">
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
          </Col>
        </Row>
        <Row>
          <Col md={6}>
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
          </Col>
          <Col md={6}>
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
          </Col>
        </Row>
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
            {t("User Role")} <span className="text-danger">*</span>
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
            {t("User Type")} <span className="text-danger">*</span>
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
          <Label className="form-label" for="events">
            {t("Seminars")}
          </Label>

          <SeminarMultiSelect items={seminarItems} setItems={setSeminarItems} />
        </div>

        <div className="mb-1">
          <Label className="form-label" for="events">
            {t("Workshops")}
          </Label>

          <WorkshopMultiSelect
            items={workshopItems}
            setItems={setWorkshopItems}
          />
        </div>

        <div className="mb-1">
          <Label className="form-label" for="events">
            {t("Services")}
          </Label>

          <ServicesMultiSelect items={servicesItems} setItems={setServices} />
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
