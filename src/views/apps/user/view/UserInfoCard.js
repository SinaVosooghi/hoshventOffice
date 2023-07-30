// ** React Imports
import { useState, Fragment } from "react";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  CardBody,
  Button,
  Badge,
  Modal,
  Input,
  Label,
  ModalBody,
  ModalHeader,
  FormText,
} from "reactstrap";

// ** Third Party Components
import Swal from "sweetalert2";
import Select from "react-select";
import { Check, Briefcase, X } from "react-feather";
import { useForm, Controller } from "react-hook-form";
import withReactContent from "sweetalert2-react-content";
import classnames from "classnames";
import { useQuery, useMutation } from "@apollo/client";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import { t } from "i18next";
import moment from "moment";
import { GET_ITEM_QUERY, UPDATE_ITEM_MUTATION, USER_TYPES } from "../gql";
import { GET_ITEMS_QUERY } from "../../roles-permissions/gql";
import { sleep } from "../../../../utility/Utils";
import toast from "react-hot-toast";
import InputPasswordToggle from "@components/input-password-toggle";

const statusOptions = [
  { value: true, label: t("Active") },
  { value: false, label: t("Deactive") },
];

const MySwal = withReactContent(Swal);

const UserInfoCard = ({ selectedUser }) => {
  // ** Hook
  const {
    reset,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ** State
  const [show, setShow] = useState(false);
  const [roleOptions, setRoleOptions] = useState([
    { value: "", label: `${t("Select")} ${t("Role")}` },
  ]);

  const [data, setData] = useState(null);
  useQuery(GET_ITEMS_QUERY, {
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

  useQuery(GET_ITEM_QUERY, {
    variables: { id: parseInt(selectedUser?.id) },
    fetchPolicy: "network-only",
    onCompleted: async ({ user }) => {
      if (user) {
        for (const [key, value] of Object.entries(user)) {
          setValue(key, value);
        }
        await sleep(500);

        reset({
          ...user,
          status: user.status
            ? {
                label: t("Active"),
                value: user.status,
              }
            : {
                label: t("Deactive"),
                value: user.status,
              },
          role: {
            label: user.role?.title,
            value: user.role?.id,
          },
          usertype: {
            label: t(user?.usertype),
            value: user?.usertype,
          },
        });
      }
    },
  });

  const [update] = useMutation(UPDATE_ITEM_MUTATION, {
    context: {
      headers: {
        "apollo-require-preflight": true,
      },
    },
    refetchQueries: [GET_ITEM_QUERY],
    onCompleted: () => {
      setShow(false);
      toast.success(t("Data updated successfully"));
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  // ** render user img
  const renderUserImg = () => {
    if (selectedUser !== null && selectedUser?.avatar) {
      return (
        <img
          height="110"
          width="110"
          alt="user-avatar"
          src={`${import.meta.env.VITE_BASE_API}/${selectedUser?.avatar}`}
          className="img-fluid rounded mt-3 mb-2"
        />
      );
    } else {
      return (
        <Avatar
          initials
          color={"light-primary"}
          className="rounded mt-3 mb-2"
          content={selectedUser?.firstName}
          contentStyles={{
            borderRadius: 0,
            fontSize: "calc(48px)",
            width: "100%",
            height: "100%",
          }}
          style={{
            height: "110px",
            width: "110px",
          }}
        />
      );
    }
  };

  const onSubmit = (data) => {
    setData(data);
    delete data.__typename;
    const avatar = data.avatar;
    delete data.avatar;

    update({
      variables: {
        refetchQueries: [GET_ITEM_QUERY],
        input: {
          ...data,
          ...(typeof avatar !== "string" && { avatar }),
          role: parseInt(data.role.value),
          status: data.usertype.status,
          usertype: data.usertype.value,
          mobilenumber: parseInt(data.mobilenumber),
          phonenumber: parseInt(data.phonenumber),
        },
      },
    });
  };

  const handleReset = () => {
    // reset({
    //   username: selectedUser?.username,
    //   lastName: selectedUser?.firstName?.split(' ')[1],
    //   firstName: selectedUser?.firstName?.split(' ')[0]
    // })
  };

  const handleSuspendedClick = () => {
    return MySwal.fire({
      title: t("Are you sure?"),
      icon: "warning",
      cancelButtonText: t("Cancel"),
      showCancelButton: true,
      confirmButtonText: selectedUser
        ? t("Yes, Activate user!")
        : t("Yes, Suspend user!"),
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1",
      },
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        delete selectedUser?.__typename;

        update({
          variables: {
            input: {
              ...selectedUser,
              status: !selectedUser?.status,
              role: parseInt(selectedUser?.role.id),
            },
          },
        });
        MySwal.fire({
          icon: "success",
          title: !selectedUser?.status ? t("Activated") : t("Suspended"),
          confirmButtonText: t("Ok"),
          text: !selectedUser?.status
            ? t("User has been activated.")
            : t("User has been suspended."),
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        MySwal.fire({
          title: t("Cancelled"),
          text: selectedUser?.status
            ? t("Cancelled Suspension :)")
            : t("Cancelled Activation :)"),
          confirmButtonText: t("Ok"),
          icon: "error",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      }
    });
  };

  const renderUserType = (userType) => {
    let type = "";

    switch (userType) {
      case "super": {
        type = t("Super");
        break;
      }
      case "merchant": {
        type = t("Merchant");
        break;
      }
      case "judge": {
        type = t("Judge");
        break;
      }
      case "lecturer": {
        type = t("Lecturer");
        break;
      }
    }

    return type;
  };

  return (
    <Fragment>
      <Card>
        <CardBody>
          <div className="user-avatar-section">
            <div className="d-flex align-items-center flex-column">
              {renderUserImg()}
              <div className="d-flex flex-column align-items-center text-center">
                <div className="user-info">
                  <h4>
                    {selectedUser !== null
                      ? selectedUser?.firstName + " " + selectedUser?.lastName
                      : "Eleanor Aguilar"}
                  </h4>
                  {selectedUser !== null ? (
                    <Badge className="text-capitalize">
                      {selectedUser?.role?.title}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-around my-2 pt-75">
            <div className="d-flex align-items-start me-2">
              <Badge color="light-primary" className="rounded p-75">
                <Check className="font-medium-2" />
              </Badge>
              <div className="ms-75">
                <h4 className="mb-0">
                  {renderUserType(selectedUser?.usertype)}
                </h4>
                <small>
                  {t("User")} {t("Type")}
                </small>
              </div>
            </div>
            <div className="d-flex align-items-start">
              <Badge color="light-primary" className="rounded p-75">
                <Briefcase className="font-medium-2" />
              </Badge>
              <div className="ms-75">
                <h4 className="mb-0">
                  {moment(selectedUser?.created).format("YYYY/MM/D")}
                </h4>
                <small>{t("Created")}</small>
              </div>
            </div>
          </div>
          <h4 className="fw-bolder border-bottom pb-50 mb-1">{t("Details")}</h4>
          <div className="info-container">
            {selectedUser !== null ? (
              <ul className="list-unstyled">
                {selectedUser?.username && (
                  <li className="mb-75">
                    <span className="fw-bolder me-25">{t("Username")}:</span>
                    <span>{selectedUser?.username}</span>
                  </li>
                )}
                <li className="mb-75">
                  <span className="fw-bolder me-25">{t("Email")}:</span>
                  <span>{selectedUser?.email}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">{t("Status")}:</span>
                  <span className="text-capitalize">
                    <Badge
                      className="text-capitalize"
                      color={
                        !selectedUser?.status ? "light-danger" : "light-success"
                      }
                      pill
                    >
                      {selectedUser?.status ? t("Active") : t("Deactive")}
                    </Badge>
                  </span>
                </li>
                {selectedUser?.role && (
                  <li className="mb-75">
                    <span className="fw-bolder me-25">{t("Role")}:</span>
                    <span className="text-capitalize">
                      <Badge
                        className="text-capitalize"
                        color="light-info"
                        pill
                      >
                        {selectedUser?.role?.title}
                      </Badge>
                    </span>
                  </li>
                )}

                {selectedUser?.mobilenumber && (
                  <li className="mb-75">
                    <span className="fw-bolder me-25">
                      {t("Mobile number")}:
                    </span>
                    <span>{selectedUser?.mobilenumber}</span>
                  </li>
                )}

                {selectedUser?.phonenumber && (
                  <li className="mb-75">
                    <span className="fw-bolder me-25">
                      {t("Phone number")}:
                    </span>
                    <span>{selectedUser?.phonenumber}</span>
                  </li>
                )}

                {selectedUser?.address && (
                  <li className="mb-75">
                    <span className="fw-bolder me-25">{t("Address")}:</span>
                    <span>{selectedUser?.address}</span>
                  </li>
                )}

                {selectedUser?.about && (
                  <li className="mb-75">
                    <span className="fw-bolder me-25">{t("About")}:</span>
                    <span>{selectedUser?.about}</span>
                  </li>
                )}
              </ul>
            ) : null}
          </div>
          <div className="d-flex justify-content-center pt-2">
            <Button color="primary" onClick={() => setShow(true)}>
              {t("Edit")}
            </Button>
            {selectedUser?.status ? (
              <>
                <Button
                  className="ms-1"
                  color="danger"
                  outline
                  onClick={handleSuspendedClick}
                >
                  {t("Suspend")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="ms-1"
                  color="success"
                  outline
                  onClick={handleSuspendedClick}
                >
                  {t("Activate")}
                </Button>
              </>
            )}
          </div>
        </CardBody>
      </Card>
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody className="px-sm-5 pt-50 pb-5">
          <div className="text-center mb-2">
            <h1 className="mb-1">{t("Edit User Information")}</h1>
            <p>{t("Updating user details will receive a privacy audit.")}</p>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className="gy-1 pt-75">
              <Col md={6} xs={12}>
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
              </Col>
              <Col md={6} xs={12}>
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
              </Col>
              <Col xs={12}>
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
              </Col>
              <Col xs={12}>
                <Label className="form-label" for="address">
                  {t("Address")}
                </Label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input id="address" placeholder={t("Address")} {...field} />
                  )}
                />
                <FormText color="muted">
                  {t("You can use letters, numbers & periods")}
                </FormText>
              </Col>
              <Col md={6} xs={12}>
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
              </Col>
              <Col md={6} xs={12}>
                <Label className="form-label" for="username">
                  {t("Username")} <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="username"
                      placeholder="0214231231"
                      invalid={errors.username && true}
                      {...field}
                    />
                  )}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className="form-label" for="phonenumber">
                  {t("Phone number")} <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="phonenumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="phonenumber"
                      placeholder="0214231231"
                      invalid={errors.phonenumber && true}
                      {...field}
                    />
                  )}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className="form-label" for="password">
                  {t("Password")} <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => <InputPasswordToggle {...field} />}
                />
              </Col>
              <Col md={6} xs={12}>
                <Label className="form-label" for="status">
                  {t("Status")}:
                </Label>
                <Select
                  id="status"
                  isClearable={false}
                  placeholder={t("Select...")}
                  className="react-select"
                  classNamePrefix="select"
                  options={statusOptions}
                  theme={selectThemeColors}
                  defaultValue={
                    statusOptions[
                      statusOptions.findIndex(
                        (i) => i.value === selectedUser?.status
                      )
                    ]
                  }
                />
              </Col>
              <Col md={6} xs={12}>
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
              </Col>
              <Col md={6} xs={12}>
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
              </Col>

              <Col md={6} xs={12}>
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
              </Col>

              <Col md={12} xs={12}>
                <Label className="form-label" for="about">
                  {t("About")}
                </Label>
                <Controller
                  name="about"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="textarea"
                      name="about"
                      id="about"
                      placeholder={t("About")}
                      style={{ minHeight: "100px" }}
                      {...field}
                    />
                  )}
                />
              </Col>
              <Col xs={12} className="text-center mt-2 pt-50">
                <Button type="submit" className="me-1" color="success">
                  {t("Update")}
                </Button>
                <Button
                  type="reset"
                  color="secondary"
                  outline
                  onClick={() => {
                    handleReset();
                    setShow(false);
                  }}
                >
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

export default UserInfoCard;
