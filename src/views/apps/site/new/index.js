// ** React Imports
import { Fragment, useState } from "react";

// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane, Form } from "reactstrap";
import toast from "react-hot-toast";

// ** Demo Components
import Tabs from "./Tabs";
import Breadcrumbs from "@components/breadcrumbs";
import BillingTabContent from "./BillingTabContent";
import AccountTabContent from "./AccountTabContent";
import SecurityTabContent from "./SecurityTabContent";
import ConnectionsTabContent from "./ConnectionsTabContent";
import NotificationsTabContent from "./NotificationsTabContent";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { t } from "i18next";
import { useForm } from "react-hook-form";

// ** Editor
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../../../@core/scss/react/libs/editor/editor.scss";
import draftToHtml from "draftjs-to-html";
import { hashConfig } from "../../../../utility/Utils";
import { useMutation } from "@apollo/client";
import { CREATE_ITEM_MUTATION, GET_ITEMS_QUERY } from "../gql";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const AccountSettings = () => {
  // ** States
  const [activeTab, setActiveTab] = useState("1");
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [logo, setLogo] = useState(null);
  const history = useNavigate();

  const FormSchema = yup.object().shape({
    title: yup.string().required(`${t("Title")} ${t("field is required")}`),
    slug: yup.string().required(`${t("Slug")} ${t("field is required")}`),
    type: yup.object().required(`${t("Type")} ${t("field is required")}`),
    category: yup
      .object()
      .required(`${t("Category")} ${t("field is required")}`),
  });

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(FormSchema) });

  const [create] = useMutation(CREATE_ITEM_MUTATION, {
    context: {
      headers: {
        "apollo-require-preflight": true,
      },
    },
    refetchQueries: [GET_ITEMS_QUERY],
    onCompleted: () => {
      toast.success(t("Data saved successfully"));
      history(`/apps/site`);
    },
    onError: (error) => {
      toast.error(t(error.message));
    },
  });

  const onSubmit = (data) => {
    const rawContentState = convertToRaw(description.getCurrentContent());
    const markup = draftToHtml(rawContentState, hashConfig, true);
    const logo = data.logo;

    delete data.logo;

    create({
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
              <TabPane tabId="4">
                <NotificationsTabContent />
              </TabPane>
              <TabPane tabId="5">
                <ConnectionsTabContent />
              </TabPane>
            </TabContent>
          </Col>
        </Form>
      </Row>
    </Fragment>
  );
};

export default AccountSettings;
