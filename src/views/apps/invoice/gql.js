import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "invoices";
export const ITEM_NAME_SINGULAR = "Invoice";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateInvoice($input: CreateInvoiceInput!) {
    createInvoice(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateInvoice($input: UpdateInvoiceInput!) {
    updateInvoice(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeInvoice($id: Int!) {
    removeInvoice(id: $id)
  }
`;

export const DELETE_ORDER_ITEM_MUTATION = gql`
  mutation removeItem($id: Int!) {
    removeItem(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query invoices($input: GetInvoicesArgs!) {
    invoices(input: $input) {
      invoices {
        id
        note
        type
        invoicenumber
        issuedate
        user {
          id
          firstName
          lastName
          mobilenumber
          phonenumber
          address
          email
        }
        duedate
        total
        created
        updated
        readat
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query invoice($id: Int!, $read: Boolean) {
    invoice(id: $id, read: $read) {
      id
      note
      type
      invoicenumber
      issuedate
      salesperson
      donepayment
      user {
        id
        firstName
        lastName
        mobilenumber
        phonenumber
        address
        email
      }
      order {
        id
        totalprice
        subtotal
        shipping {
          id
          cost
          title
        }
        coupon {
          id
          percent
          title
        }
        items {
          id
          created
          price
          quantity
          product {
            id
            title
            price
            offprice
          }
        }
      }
      duedate
      total
      created
      updated
      readat
    }
  }
`;
