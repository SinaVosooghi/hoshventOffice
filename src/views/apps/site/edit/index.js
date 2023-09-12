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
import RegisterFields from "./RegisterFields";

const AccountSettings = () => {
  const FormSchema = yup.object().shape({
    title: yup.string().required(`${t("Title")} ${t("field is required")}`),
  });

  // ** States
  const [activeTab, setActiveTab] = useState("1");
  const [description, setDescription] = useState(EditorState.createEmpty());
  const [logo, setLogo] = useState(null);
  const [data, setData] = useState(null);
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(1);

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
    handleSubmit,
    getValues,
    reset,
    setValue,    register,
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
        setCount(site.registerFields?.length);

        reset({
          ...site,
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
    delete data.plan;
    const rawContentState = convertToRaw(description.getCurrentContent());
    const markup = draftToHtml(rawContentState, hashConfig, true);

    const logo = data.logo;

    delete data.logo;

    update({
      variables: {
        input: {
          ...data,
          body: markup,
          ...(typeof logo !== "string" && { logo }),
        },
      },
    });
  };

  const handleChangeItems = (item) => {
    const foundItem = items.findIndex((p) => p.idx === item.idx);
    delete foundItem.__typename;

    if (foundItem === -1) {
      setItems([...items, item]);
    } else {
      let newArr = [...items];
      newArr[foundItem] = item;

      setItems(newArr);
    }
  };

  const deleteItem = (i) => {
    const filter = items.filter((p) => p.idx !== i);

    setItems(filter);
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
                <RegisterFields
                  control={control}
                  errors={errors}
                  handleSubmit={handleSubmit}
                  defaultCount={count}
                  handleChangeItems={handleChangeItems}
                  items={items}
                  deleteItem={deleteItem}
                  register={register}
                  {...{
                    control,
                    register,
                    defaultValues,
                    getValues,
                    setValue,
                    errors,
                  }}
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
