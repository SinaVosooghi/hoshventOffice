import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "variations";
export const ITEM_NAME_SINGULAR = "Variation";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateVariation($input: CreateVariationInput!) {
    createVariation(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateVariation($input: UpdateVariationInput!) {
    updateVariation(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeVariation($id: Int!) {
    removeVariation(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query variations($input: GetVariationsArgs!) {
    variations(input: $input) {
      variations {
        id
        title
        body
        status
        created
        updated
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query variation($id: Int!) {
    variation(id: $id) {
      id
      title
      body
      status
      created
      updated
    }
  }
`;
