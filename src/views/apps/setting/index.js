// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Third Party Components
import axios from "axios";

// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane } from "reactstrap";
import { useQuery } from "@apollo/client";

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
import { GET_ITEM_QUERY } from "./gql";
import CreateSite from "./CreateSite";
import DeleteAccount from "./DeleteAccount";
import TextSettingTab from "./TextSettingContent";
import SocialMediaContent from "./SocialMediaContent";
import ShopContent from "./Shop";
import QuestionsContent from "./QuestionsSetting";

const AccountSettings = () => {
  // ** States
  const [activeTab, setActiveTab] = useState("1");
  const [data, setData] = useState(null);

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  useQuery(GET_ITEM_QUERY, {
    fetchPolicy: "network-only", // Used for first execution
    onCompleted: ({ getSetting }) => {
      if (getSetting) {
        setData(getSetting);
      }
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  return (
    <Fragment>
      <Breadcrumbs
        title={`${t("Settings")}`}
        data={[{ title: t("Settings") }]}
      />
      {data !== null ? (
        <Row>
          <Col xs={12}>
            <Tabs
              className="mb-2"
              activeTab={activeTab}
              toggleTab={toggleTab}
            />

            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                {/* <AccountTabContent data={data} /> */}
              </TabPane>
              <TabPane tabId="2">
                <DeleteAccount />
              </TabPane>
              <TabPane tabId="3">
                <SocialMediaContent data={data} />
              </TabPane>
              <TabPane tabId="4">
                <TextSettingTab data={data} />
              </TabPane>
              <TabPane tabId="5">
                <NotificationsTabContent />
              </TabPane>
              <TabPane tabId="6">
                <ConnectionsTabContent />
              </TabPane>
              <TabPane tabId="7">
                <ShopContent data={data} />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      ) : (
        <CreateSite />
      )}
    </Fragment>
  );
};

export default AccountSettings;
