// ** Styles
import "@styles/react/pages/page-authentication.scss";

import * as yup from "yup";

// ** Reactstrap Imports
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Form,
  FormFeedback,
  Input,
  Label,
  UncontrolledTooltip,
} from "reactstrap";
import { Coffee, X } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
// ** Utils
import { getHomeRouteForLoggedInUser, isObjEmpty } from "@utils";

// ** Context
import { AbilityContext } from "@src/utility/context/Can";
import Avatar from "@components/avatar";
// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";
import api from "./loginApi";
// ** Actions
import { handleLogin } from "@store/authentication";
import illustrationsDark from "@src/assets/images/pages/auth-v2-login-illustration-dark.png";
// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/auth-v2-login-illustration-light.png";
import { renderUserImg } from "../../../utility/helpers/renderDashboardLogo";
import { t } from "i18next";
import toast from "react-hot-toast";
// ** React Imports
import { useContext } from "react";
// ** Third Party Components
import { useDispatch } from "react-redux";
import useGetSetting from "../../../utility/gqlHelpers/useGetSetting";
// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";

const ToastContent = ({ dir, name, role }) => {
  return (
    <div className="d-flex" style={{ dir: dir }}>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <h6>{name}</h6>
        </div>
        <span>
          {t(
            "You have successfully logged in to Dashboard. Now you can start to explore. Enjoy!"
          )}
        </span>
      </div>
    </div>
  );
};

const defaultValues = {
  password: "admin",
  loginEmail: "admin@demo.com",
};

const Login = () => {
  const FormSchema = yup.object().shape({
    email: yup
      .string()
      .email(t("email must be a valid email"))
      .required(`${t("Email")} ${t("field is required")}`),
    password: yup
      .string()
      .required(`${t("Password")} ${t("field is required")}`),
  });

  // ** Hooks
  const { skin } = useSkin();
  const dispatch = useDispatch();
  const history = useNavigate();
  const ability = useContext(AbilityContext);
  const setting = useGetSetting();
  const { i18n } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(FormSchema) });

  const onSubmit = (data) => {
    const { email, password } = data;
    if (isObjEmpty(errors)) {
      try {
        var response = api.post(
          import.meta.env.VITE_BASE_API + "/auth/tenant",
          {
            email,
            password,
            remember: false,
          }
        );
        response
          .then(({ data }) => {
            const { type, firstName, lastName, access_token, site, role } =
              data;
            const permissions = role?.permissions;
            const abilityItems = [];

            if (role) {
              if (permissions.read) {
                permissions.read.map((p) => {
                  if (p.value)
                    abilityItems.push({ action: "read", subject: p.key });
                });
              }

              if (permissions.create) {
                permissions.create.map((p) => {
                  if (p.value)
                    abilityItems.push({
                      action: "create",
                      subject: p.key,
                    });
                });
              }

              if (permissions.update) {
                permissions.update.map((p) => {
                  if (p.value)
                    abilityItems.push({
                      action: "update",
                      subject: p.key,
                    });
                });
              }

              if (permissions.delete) {
                permissions.delete.map((p) => {
                  if (p.value)
                    abilityItems.push({
                      action: "delete",
                      subject: p.key,
                    });
                });
              }
            }
            let abilites;
            if (role) {
              abilites = [
                {
                  action: "manage",
                  subject: "HOME",
                },
                ...abilityItems,
              ];
            }

            if (!role) {
              abilites = [
                {
                  action: "manage",
                  subject: "all",
                },
              ];
            }

            delete data.role;
            const loginData = {
              ...data,
              accessToken: access_token,
              site: site[0],
              ability: abilites,
            };

            dispatch(handleLogin(loginData));
            ability.update(abilites);

            history(getHomeRouteForLoggedInUser(type));
            toast.success(
              <ToastContent
                dir={i18n.language === "ir" ? "rtl" : "ltr"}
                name={`${firstName}  ${lastName}` || email || "Admin user"}
              />,
              { hideProgressBar: true, autoClose: 2000 }
            );
          })
          .catch((errors) => {
            console.log(errors);
            toast.error(t("Email or password is wrong!"));
          });
      } catch (error) {
        console.error(`Exception getting servers. ${error}`);
      }
    }
  };

  return (
    <>
      <div className="auth-wrapper auth-basic px-2">
        <div className="auth-inner my-2">
          <Card className="mb-0">
            <CardBody>
              <CardTitle
                tag="h4"
                className="mb-1"
                style={{ textAlign: "center", direction: "rtl" }}
              >
                {t("Welcome to")} {setting?.title ?? t("Dashboard")}!
              </CardTitle>
              <CardText
                className="mb-2"
                style={{ textAlign: "center", direction: "rtl" }}
              >
                {t("Please sign-in to your account and start the adventure")}{" "}
              </CardText>
              <Form
                className="auth-login-form mt-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="mb-1">
                  <Label
                    className="form-label"
                    for="email"
                    style={{ float: i18n.language === "ir" ? "right" : "left" }}
                  >
                    {t("Email")}
                  </Label>
                  <Controller
                    id="email"
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        autoFocus
                        type="email"
                        placeholder="john@example.com"
                        invalid={errors.email && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.email && (
                    <FormFeedback>{errors.email.message}</FormFeedback>
                  )}
                </div>
                <div className="mb-1">
                  <div className="d-flex justify-content-between">
                    <Link to="/forgot-password">
                      <small>{t("Forgot Password?")}</small>
                    </Link>
                    <Label
                      className="form-label"
                      for="login-password"
                      style={{ dir: i18n.language === "ir" ? "rtl" : "ltr " }}
                    >
                      {t("Password")}
                    </Label>
                  </div>
                  <Controller
                    id="password"
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <InputPasswordToggle
                        className="input-group-merge"
                        invalid={errors.password && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.password && (
                    <FormFeedback>{errors.password.message}</FormFeedback>
                  )}
                </div>
                <Button type="submit" color="primary" block className="mt-2">
                  {t("Sign in")}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
