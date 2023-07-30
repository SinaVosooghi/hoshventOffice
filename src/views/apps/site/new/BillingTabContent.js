// ** React Imports
import { Fragment } from "react";

// ** Demo Components
import PaymentMethods from "./PaymentMethods";
import BillingAddress from "./BillingAddress";
import BillingHistory from "./BillingHistory";
import BillingCurrentPlan from "./BillingCurrentPlan";

const BillingTabContent = ({ control, errors, handleSubmit }) => {
  return (
    <Fragment>
      <PaymentMethods
        errors={errors}
        control={control}
        handleSubmit={handleSubmit}
      />
    </Fragment>
  );
};

export default BillingTabContent;
