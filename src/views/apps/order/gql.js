import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "orders";
export const ITEM_NAME_SINGULAR = "Order";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateOrder($input: UpdateOrderInput!) {
    updateOrder(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeOrder($id: Int!) {
    removeOrder(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query orders($input: GetOrdersArgs!) {
    orders(input: $input) {
      orders {
        id
        payment {
          id
        }
        user {
          id
          firstName
          lastName
          mobilenumber
          phonenumber
        }
        items {
          id
        }
        shipping {
          id
          title
          cost
        }
        invoice {
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
          duedate
          total
          created
          updated
        }
        coupon {
          id
          title
          percent
        }
        status
        totalprice
        subtotal
        created
        updated
        readat
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query order($id: Int!) {
    order(id: $id) {
      id
      note
      type
      ordernumber
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
    }
  }
`;
