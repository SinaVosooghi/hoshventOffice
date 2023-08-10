import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "brands";
export const ITEM_NAME_SINGULAR = "Brand";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateBrand($input: CreateBrandInput!) {
    createBrand(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateBrand($input: UpdateBrandInput!) {
    updateBrand(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeBrand($id: Int!) {
    removeBrand(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query brands($input: GetBrandsArgs!) {
    brands(input: $input) {
      brands {
        id
        title
        image
        status
        featured
        created
        updated
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query brand($id: Int!) {
    brand(id: $id) {
      id
      title
      body
      status
      featured
      image
      created
      updated
    }
  }
`;
