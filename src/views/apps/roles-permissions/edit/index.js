// ** React Import
import { useState } from "react";

// ** Custom Components
import { useNavigate, useParams } from "react-router-dom";

// ** Third Party Components
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";

// ** Reactstrap Imports
import {
  Button,
  Label,
  Form,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Badge,
  Table,
} from "reactstrap";
// ** Store & Actions/ReactDropzoneUploader";
import { useMutation, useQuery } from "@apollo/client";

import {
  GET_ITEMS_QUERY,
  GET_ITEM_QUERY,
  ITEM_NAME_SINGULAR,
  ROLES_ARRAY,
  UPDATE_ITEM_MUTATION,
} from "../gql.js";
import toast from "react-hot-toast";
import { t } from "i18next";

const Edit = () => {
  const { id } = useParams();
  // ** Vars
  const {
    register,
    setValue,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // ** States
  const history = useNavigate();
  const [selectedPermissions, setSelectedPermissions] = useState();

  const [update] = useMutation(UPDATE_ITEM_MUTATION, {
    onCompleted: () => {
      toast.success(t("Data updated successfully"));
      history(`/apps/roles`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useQuery(GET_ITEM_QUERY, {
    variables: { id: parseInt(id) },
    fetchPolicy: "network-only",
    onCompleted: async ({ role }) => {
      if (role) {
        const read = {};
        const update = {};
        const create = {};
        const deleteItems = {};
        setSelectedPermissions(role.permissions);
        for (const [key, value] of Object.entries(role)) {
          setValue(key, value);
        }

        await sleep(100);

        if (role.permissions.read) {
          for (const [key, value] of Object.entries(role.permissions.read)) {
            read[value.key] = value.value;
          }
        }

        if (role.permissions.update) {
          for (const [key, value] of Object.entries(role.permissions.update)) {
            update[value.key] = value.value;
          }
        }

        if (role.permissions.create) {
          for (const [key, value] of Object.entries(role.permissions.create)) {
            create[value.key] = value.value;
          }
        }

        if (role.permissions.delete) {
          for (const [key, value] of Object.entries(role.permissions.delete)) {
            deleteItems[value.key] = value.value;
          }
        }

        reset({
          title: role.title,
          description: role.description,
          ...read,
          ...update,
          ...create,
          ...deleteItems,
        });
      }
    },
  });

  // ** Function to handle form submit
  const onSubmit = (data) => {
    delete data.__typename;
    delete data._id;
    delete data.created;
    delete data.updated;

    const permissions = { read: [], create: [], update: [], delete: [] };

    Object.keys(data).map(function (key) {
      if (key.startsWith("read")) {
        permissions.read.push({ key, value: data[key] });
      }
      if (key.startsWith("create")) {
        permissions.create.push({ key, value: data[key] });
      }
      if (key.startsWith("update")) {
        permissions.update.push({ key, value: data[key] });
      }
      if (key.startsWith("delete")) {
        permissions.delete.push({ key, value: data[key] });
      }
    });

    update({
      variables: {
        refetchQueries: [GET_ITEMS_QUERY],
        input: {
          id: parseInt(id),
          title: data.title,
          permissions,
        },
      },
    });
  };

  return (
    <Row>
      <Col md={12}>
        <Card>
          <CardHeader>
            <CardTitle tag="h4">
              {t("Edit")} {t(ITEM_NAME_SINGULAR)}
            </CardTitle>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row className="mb-1">
                <Col md={12}>
                  <Label className="form-label" for="fullName">
                    {t("Role Name")}
                    <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="title"
                        required
                        placeholder={`${t("Enter role name")}`}
                        invalid={errors.fullName && true}
                        {...field}
                      />
                    )}
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <h4 className="mt-2 pt-50">
                    {t("Role")} {t("Permissions")}
                  </h4>
                  <Table className="table-flush-spacing" responsive>
                    <tbody>
                      {ROLES_ARRAY.map((role, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-nowrap fw-bolder">
                              {t("management")} {t(role.title)}
                            </td>
                            <td>
                              <div className="d-flex">
                                <div className="form-check me-3 me-lg-5">
                                  <input
                                    name={`read-${role.value}`}
                                    type="checkbox"
                                    {...register(`read-${role.value}`)}
                                    id={`read-${role.value}`}
                                    className={`form-check-input ${
                                      errors[`read-${role.value}`]
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                  />

                                  <Label
                                    className="form-check-label"
                                    for={`read-${role.value}`}
                                  >
                                    {t("Read")}
                                  </Label>
                                </div>
                                <div className="form-check me-3 me-lg-5">
                                  <input
                                    name={`create-${role.value}`}
                                    type="checkbox"
                                    {...register(`create-${role.value}`)}
                                    id={`create-${role.value}`}
                                    className={`form-check-input ${
                                      errors[`create-${role.value}`]
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                  />
                                  <Label
                                    className="form-check-label"
                                    for={`create-${role.value}`}
                                  >
                                    {t("Create")}
                                  </Label>
                                </div>
                                <div className="form-check me-3 me-lg-5">
                                  <Controller
                                    name={`update-${role.value}`}
                                    control={control}
                                    render={({ field }) => (
                                      <>
                                        <input
                                          name={`update-${role.value}`}
                                          type="checkbox"
                                          {...register(`update-${role.value}`)}
                                          id={`update-${role.value}`}
                                          className={`form-check-input ${
                                            errors[`update-${role.value}`]
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                        />
                                        <Label
                                          className="form-check-label"
                                          for={`update-${role.value}`}
                                        >
                                          {t("Update")}
                                        </Label>{" "}
                                      </>
                                    )}
                                  />
                                </div>
                                <div className="form-check">
                                  <Controller
                                    name={`delete-${role.value}`}
                                    control={control}
                                    render={() => (
                                      <>
                                        <input
                                          name={`delete-${role.value}`}
                                          type="checkbox"
                                          {...register(`delete-${role.value}`)}
                                          id={`delete-${role.value}`}
                                          className={`form-check-input ${
                                            errors[`delete-${role.value}`]
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                        />
                                        <Label
                                          className="form-check-label"
                                          for={`delete-${role.value}`}
                                        >
                                          {t("Delete")}
                                        </Label>{" "}
                                      </>
                                    )}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Col>
              </Row>

              <Button type="submit" className="mt-3" color="success">
                {t("Update")}
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Edit;
