import { gql } from "@apollo/client";

export const ITEM_NAME = "shippings";
export const ITEM_NAME_SINGULAR = "Shipping";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateShipping($input: CreateShippingInput!) {
    createShipping(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateShipping($input: UpdateShippingInput!) {
    updateShipping(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeShipping($id: Int!) {
    removeShipping(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query shippings($input: GetShippingsArgs!) {
    shippings(input: $input) {
      shippings {
        id
        title
        body
        cost
        status
        created
        updated
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query shipping($id: Int!) {
    shipping(id: $id) {
      id
      title
      body
      cost
      status
      created
      updated
    }
  }
`;
