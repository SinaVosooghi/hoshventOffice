// ** React Imports
import { Fragment, useState } from "react";

// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane, Form } from "reactstrap";
import toast from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Demo Components
import Tabs from "./Tabs";
import Breadcrumbs from "@components/breadcrumbs";
import BillingTabContent from "./BillingTabContent";
import AccountTabContent from "./AccountTabContent";
import SecurityTabContent from "./SecurityTabContent";
import ConnectionsTabContent from "./ConnectionsTabContent";
import NotificationsTabContent from "./NotificationsTabContent";
import { convertHtmlToDraft, sleep } from "../../../../utility/Utils";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { t } from "i18next";
import { useForm } from "react-hook-form";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import { hashConfig } from "../../../../utility/Utils";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  countryOptions,
  CREATE_ITEM_MUTATION,
  GET_ITEM_QUERY,
  GET_ITEMS_QUERY,
  languageOptions,
  timeZoneOptions,
  UPDATE_ITEM_MUTATION,
} from "../gql";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUser } from "../../../../utility/gqlHelpers/useGetUser";
import { useEffect } from "react";

const AccountSettings = () => {
  const FormSchema = yup.object().shape({
    title: yup.string().required(`${t("Title")} ${t("field is required")}`),
    slug: yup.string().required(`${t("Slug")} ${t("field is required")}`),
    type: yup.object().required(`${t("Type")} ${t("field is required")}`),
    category: yup
      .object()
      .required(`${t("Category")} ${t("field is required")}`),
  });

  // ** States
  const [activeTab, setActiveTab] = useState("1");
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [logo, setLogo] = useState(null);
  const [data, setData] = useState(null);

  const history = useNavigate();
  const { id } = useParams();

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  // ** Hooks
  const defaultValues = {
    title: "",
  };
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(FormSchema),
  });
  const { user, error } = useGetUser();

  const [update] = useMutation(UPDATE_ITEM_MUTATION, {
    context: {
      headers: {
        "apollo-require-preflight": true,
      },
    },
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const [getWebsite] = useLazyQuery(GET_ITEM_QUERY, {
    fetchPolicy: "network-only",
    onCompleted: async ({ site }) => {
      if (site) {
        setData(site);
        setDescription(convertHtmlToDraft(site.body));

        for (const [key, value] of Object.entries(site)) {
          setValue(key, value);
        }

        setLogo(site.logo);

        reset({
          ...site,
          status: site.status
            ? {
                label: t("Active"),
                value: site.status,
              }
            : {
                label: t("Deactive"),
                value: site.status,
              },
          country: {
            label: countryOptions.find((c) => c.value === site.country).label,
            value: site.country,
          },
          language: {
            label: languageOptions.find((c) => c.value === site.language).label,
            value: site.language,
          },
          timezone: {
            label: timeZoneOptions.find((c) => c.value === site.timezone).label,
            value: site.timezone,
          },
          ...(site.user && {
            user: {
              label: site.user?.firstName + "" + site.user?.lastName ?? "",
              value: site.user?.id,
            },
          }),
          category: {
            label: site.category?.title,
            value: site.category?.id,
          },
          plan: {
            label: site.plan?.title,
            value: site.plan?.id,
          },
          type: {
            label: t(site?.type),
            value: site?.type,
          },
        });
      }
    },
  });

  useEffect(() => {
    if (user?.site) {
      getWebsite({
        variables: {
          id: user?.site[0].id,
        },
      });
    }
  }, [user]);

  const onSubmit = (data) => {
    delete data.__typename;
    delete data.created;
    delete data.updated;
    const rawContentState = convertToRaw(description.getCurrentContent());
    const markup = draftToHtml(rawContentState, hashConfig, true);

    const logo = data.logo;

    delete data.logo;

    update({
      variables: {
        input: {
          ...data,
          body: markup,
          status: data.status?.value,
          featured: data.featured?.value,
          country:
            typeof data.country === "object" ? data.country?.value : null,
          language:
            typeof data.language === "object" ? data.language?.value : null,
          type: typeof data.type === "object" ? data.type?.value : null,
          timezone:
            typeof data.timezone === "object" ? data.timezone?.value : null,
          user: typeof data.user === "object" ? data.user?.value : null,
          category:
            typeof data.category === "object" ? data.category?.value : null,
          plan: typeof data.plan === "object" ? data.plan?.value : null,
          ...(typeof logo !== "string" && { logo }),
        },
      },
    });
  };

  return (
    <Fragment>
      <Breadcrumbs
        title={t("New Site")}
        data={[{ title: t("Pages") }, { title: t("New Site") }]}
      />
      <Row>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Col xs={12}>
            <Tabs
              className="mb-2"
              activeTab={activeTab}
              toggleTab={toggleTab}
            />

            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <AccountTabContent
                  control={control}
                  errors={errors}
                  handleSubmit={handleSubmit}
                  description={description}
                  setDescription={setDescription}
                  setLogo={setLogo}
                  logo={logo}
                />
              </TabPane>
              <TabPane tabId="2">
                <SecurityTabContent
                  control={control}
                  errors={errors}
                  handleSubmit={handleSubmit}
                />
              </TabPane>
              <TabPane tabId="3">
                <BillingTabContent
                  control={control}
                  errors={errors}
                  handleSubmit={handleSubmit}
                />
              </TabPane>
            </TabContent>
          </Col>
        </Form>
      </Row>
    </Fragment>
  );
};

export default AccountSettings;
