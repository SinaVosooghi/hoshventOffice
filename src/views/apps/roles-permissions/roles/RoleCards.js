// ** React Imports
import { Fragment, useState } from "react";
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Label,
  Input,
  Table,
  Modal,
  Button,
  CardBody,
  ModalBody,
  ModalHeader,
  FormFeedback,
  Form,
  UncontrolledTooltip,
} from "reactstrap";

// ** Third Party Components
import { Info, UserMinus, Users } from "react-feather";
import { useForm, Controller } from "react-hook-form";

// ** FAQ Illustrations
import illustration from "@src/assets/images/illustration/faq-illustrations.svg";

import { t } from "i18next";

import {
  CREATE_ITEM_MUTATION,
  GET_ITEMS_QUERY,
  ITEM_NAME_SINGULAR,
  ROLES_ARRAY,
} from "../gql";
import { useMutation, useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const RoleCards = () => {
  // ** States
  const [show, setShow] = useState(false);
  const [modalType, setModalType] = useState("Add New");
  const [isSuper, setIsSuper] = useState(false);

  const [create] = useMutation(CREATE_ITEM_MUTATION, {
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
    },
    onError: (error) => {
      console.log(error);
      toast.error(t(error.message));
    },
  });

  const { data: roles } = useQuery(GET_ITEMS_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        limit: 5,
        skip: 0,
      },
    },
  });

  // ** Hooks
  const {
    reset,
    control,
    setError,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { title: "" } });

  const onSubmit = (data) => {
    const permissions = { read: [], create: [], update: [], delete: [] };

    Object.keys(data).map(function (key) {
      if (key.startsWith("read")) {
        permissions.read.push({ key, value: isSuper ? true : data[key] });
      }
      if (key.startsWith("create")) {
        permissions.create.push({ key, value: isSuper ? true : data[key] });
      }
      if (key.startsWith("update")) {
        permissions.update.push({ key, value: isSuper ? true : data[key] });
      }

      if (key.startsWith("delete")) {
        permissions.delete.push({ key, value: isSuper ? true : data[key] });
      }
    });

    if (data.title.length) {
      setShow(false);
      create({
        variables: {
          input: {
            title: data.title,
            permissions,
          },
        },
      });
    } else {
      setError("title", {
        type: "manual",
      });
    }
  };

  const onReset = () => {
    setShow(false);
    reset({ title: "" });
  };

  const handleModalClosed = () => {
    setModalType("Add New");
    setValue("title");
  };

  return (
    <Fragment>
      <Row>
        {roles?.roles?.roles.length > 0 &&
          roles?.roles?.roles?.map((item, index) => {
            return (
              <Col key={index} xl={4} md={6}>
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <span>{`${t("Total")} ${item.users.length} ${t(
                        "users"
                      )}`}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-end mt-1 pt-25">
                      <div className="role-heading">
                        <h4 className="fw-bolder">{item.title}</h4>
                        <Link
                          to={`/apps/roles/edit/${item.id}`}
                          className="role-edit-modal"
                        >
                          <small className="fw-bolder">
                            {t("Edit")} {t("Role")}
                          </small>
                        </Link>
                      </div>
                      <Link
                        to=""
                        className="text-body"
                        onClick={(e) => e.preventDefault()}
                      >
                        {item.users.length ? (
                          <Users className="font-medium-5" />
                        ) : (
                          <UserMinus className="font-medium-5" />
                        )}
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        <Col xl={4} md={6}>
          <Card>
            <Row>
              <Col sm={5}>
                <div className="d-flex align-items-end justify-content-center h-100">
                  <img
                    className="img-fluid mt-2"
                    src={illustration}
                    alt="Image"
                    width={85}
                  />
                </div>
              </Col>
              <Col sm={7}>
                <CardBody className="text-sm-end text-center ps-sm-0">
                  <Button
                    color="primary"
                    className="text-nowrap mb-1"
                    onClick={() => {
                      setModalType("Add New");
                      setShow(true);
                    }}
                  >
                    {t("Add")} {t("New")} {t(ITEM_NAME_SINGULAR)}
                  </Button>
                  <p className="mb-0">
                    {t("Add a new role, if it does not exist")}
                  </p>
                </CardBody>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Modal
        isOpen={show}
        onClosed={handleModalClosed}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody className="px-5 pb-5">
          <div className="text-center mb-4">
            <h1>
              {t(modalType)} {t("Role")}
            </h1>
            <p>{t("Set role permissions")}</p>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col xs={12}>
                <Label className="form-label" for="title">
                  {t("Role Name")}
                </Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="title"
                      placeholder={`${t("Enter role name")}`}
                      invalid={errors.title && true}
                    />
                  )}
                />
                {errors.title && (
                  <FormFeedback>
                    {t("Please enter a valid role name")}
                  </FormFeedback>
                )}
              </Col>
              <Col xs={12}>
                <h4 className="mt-2 pt-50">
                  {t("Role")} {t("Permissions")}
                </h4>
                <Table className="table-flush-spacing" responsive>
                  <tbody>
                    <tr>
                      <td className="text-nowrap fw-bolder" width="90%">
                        <span className="me-50">
                          {t("Administrator Access")}
                        </span>
                        <Info size={14} id="info-tooltip" />
                        <UncontrolledTooltip
                          placement="top"
                          target="info-tooltip"
                        >
                          {t("Allows a full access to the system")}
                        </UncontrolledTooltip>
                      </td>
                      <td>
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            onChange={(e) => setIsSuper(e.target.checked)}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
                <Table className="table-flush-spacing" responsive>
                  <tbody>
                    {!isSuper &&
                      ROLES_ARRAY.map(({ title, value }, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-nowrap fw-bolder">
                              {t("management")} {t(title)}
                            </td>
                            <td>
                              <div className="d-flex">
                                <div className="form-check me-3 me-lg-5">
                                  <Controller
                                    name={`read-${value}`}
                                    control={control}
                                    render={({ field }) => (
                                      <>
                                        <Input
                                          {...field}
                                          type="checkbox"
                                          id={`read-${value}`}
                                        />
                                        <Label
                                          className="form-check-label"
                                          for={`read-${value}`}
                                        >
                                          {t("Read")}
                                        </Label>{" "}
                                      </>
                                    )}
                                  />
                                </div>
                                <div className="form-check me-3 me-lg-5">
                                  <Controller
                                    name={`create-${value}`}
                                    control={control}
                                    render={({ field }) => (
                                      <>
                                        <Input
                                          {...field}
                                          type="checkbox"
                                          id={`create-${value}`}
                                        />
                                        <Label
                                          className="form-check-label"
                                          for={`create-${value}`}
                                        >
                                          {t("Create")}
                                        </Label>{" "}
                                      </>
                                    )}
                                  />
                                </div>
                                <div className="form-check me-3 me-lg-5">
                                  <Controller
                                    name={`update-${value}`}
                                    control={control}
                                    render={({ field }) => (
                                      <>
                                        <Input
                                          {...field}
                                          type="checkbox"
                                          id={`update-${value}`}
                                        />
                                        <Label
                                          className="form-check-label"
                                          for={`update-${value}`}
                                        >
                                          {t("Update")}
                                        </Label>{" "}
                                      </>
                                    )}
                                  />
                                </div>

                                <div className="form-check">
                                  <Controller
                                    name={`delete-${value}`}
                                    control={control}
                                    render={({ field }) => (
                                      <>
                                        <Input
                                          {...field}
                                          type="checkbox"
                                          id={`delete-${value}`}
                                        />
                                        <Label
                                          className="form-check-label"
                                          for={`delete-${value}`}
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
              <Col className="text-center mt-2" xs={12}>
                <Button type="submit" color="primary" className="me-1">
                  {t("Submit")}
                </Button>
                <Button type="reset" outline onClick={onReset}>
                  {t("Discard")}
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default RoleCards;
