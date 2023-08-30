import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "payments";
export const ITEM_NAME_SINGULAR = "Payment";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation UpdatePayment($input: UpdatePaymentInput!) {
    updatePayment(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removePayment($id: Int!) {
    removePayment(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query payments($input: GetPaymentsArgs!) {
    payments(input: $input) {
      payments {
        id
        refid
        authority
        statusCode
        amount
        updated
        created
        user {
          firstName
          lastName
          mobilenumber
        }
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query payment($id: Int!) {
    payment(id: $id) {
      id
      refid
      authority
      statusCode
      user {
        firstName
        lastName
      }
      amount
      updated
      created
    }
  }
`;
