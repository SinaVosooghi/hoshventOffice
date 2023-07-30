// ** React Imports
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";
import toast from "react-hot-toast";

// ** Third Party Components
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Coffee, X } from "react-feather";

// ** Actions
import { handleLogin } from "@store/authentication";

// ** Context
import { AbilityContext } from "@src/utility/context/Can";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// ** Utils
import { getHomeRouteForLoggedInUser, isObjEmpty } from "@utils";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Alert,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  FormFeedback,
  UncontrolledTooltip,
} from "reactstrap";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/auth-v2-login-illustration-light.png";
import illustrationsDark from "@src/assets/images/pages/auth-v2-login-illustration-dark.png";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import useGetSetting from "../../../utility/gqlHelpers/useGetSetting";
import { t } from "i18next";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { renderUserImg } from "../../../utility/helpers/renderDashboardLogo";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

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
  const dispatch = useDispatch();
  const history = useNavigate();
  const ability = useContext(AbilityContext);
  const setting = useGetSetting();
  const { i18n } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(FormSchema) });

  const onSubmit = (data) => {
    const { email, password } = data;

    if (isObjEmpty(errors)) {
      axios
        .post(import.meta.env.VITE_BASE_API + "/auth/tenant", {
          email,
          password,
          remember: false,
        })
        .then(({ data }) => {
          const { type, firstName, lastName, access_token, site } = data;
          const loginData = {
            ...data,
            accessToken: access_token,
            site: site[0],
            ability: [
              {
                action: "manage",
                subject: "all",
              },
            ],
          };
          dispatch(handleLogin(loginData));
          ability.update([
            {
              action: "manage",
              subject: "all",
            },
          ]);

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
          if (errors.response.status === 403) {
            toast.error(t("You do not have access to login!"));
          } else {
            toast.error(t("Invalid login data"));
          }
        });
    }
  };

  return (
    <>
      <div className="auth-wrapper auth-basic px-2">
        <div className="auth-inner my-2">
          <Card className="mb-0">
            <CardBody>
              {setting?.logo && (
                <Link
                  className={`brand-logo d-flex align-items-center`}
                  style={{ right: `${i18n.language === "ir" ? 0 : ""}` }}
                  to="/"
                  onClick={(e) => e.preventDefault()}
                >
                  {setting?.logo && renderUserImg(setting, "logo")}
                </Link>
              )}
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
                <div className="form-check mb-1">
                  <Input type="checkbox" id="remember-me" />
                  <Label className="form-check-label" for="remember-me">
                    {t("Remember Me")}
                  </Label>
                </div>
                <Button type="submit" color="primary" block>
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
