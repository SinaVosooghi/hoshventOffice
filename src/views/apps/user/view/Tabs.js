// ** React Imports
import { Fragment } from "react";

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

// ** Icons Imports
import { Clock, Code } from "react-feather";

// ** User Components
import UserAttends from "./UserAttends";
import Scanner from "./scanner";

const UserTabs = ({ active, toggleTab, user, type }) => {
  return (
    <Fragment>
      <Nav pills className="mb-2">
        {type === "user" || type === "guest" || (
          <NavItem>
            <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
              <Clock className="font-medium-3 me-50" />
              <span className="fw-bold">نتایج</span>
            </NavLink>
          </NavItem>
        )}

        {type === "instructor" && (
          <NavItem>
            <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
              <Code className="font-medium-3 me-50" />
              <span className="fw-bold">اسکن ها</span>
            </NavLink>
          </NavItem>
        )}

        {/* <NavItem>
          <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
            <Lock className='font-medium-3 me-50' />
            <span className='fw-bold'>Security</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
            <Bookmark className='font-medium-3 me-50' />
            <span className='fw-bold'>Billing & Plans</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '4'} onClick={() => toggleTab('4')}>
            <Bell className='font-medium-3 me-50' />
            <span className='fw-bold'>Notifications</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === '5'} onClick={() => toggleTab('5')}>
            <Link className='font-medium-3 me-50' />
            <span className='fw-bold'>Connections</span>
          </NavLink>
        </NavItem> */}
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId="1">
          <UserAttends user={user} />
          {/* <UserTimeline />
          <InvoiceList /> */}
        </TabPane>
        <TabPane tabId="2">
          <Scanner user={user} />
        </TabPane>
        {/* <TabPane tabId='2'>
          <SecurityTab />
        </TabPane>
        <TabPane tabId='3'>
          <BillingPlanTab />
        </TabPane>
        <TabPane tabId='4'>
          <Notifications />
        </TabPane>
        <TabPane tabId='5'>
          <Connections />
        </TabPane> */}
      </TabContent>
    </Fragment>
  );
};
export default UserTabs;
