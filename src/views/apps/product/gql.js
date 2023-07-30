import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "blogs";
export const ITEM_NAME_SINGULAR = "Product";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeProduct($id: Int!) {
    removeProduct(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query products($input: GetProductsArgs!) {
    products(input: $input) {
      products {
        id
        title
        seotitle
        image
        price
        offprice
        slug
        body
        seobody
        category {
          title
        }
        featured
        status
        created
        updated
        quantity
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query product($id: Int!) {
    product(id: $id) {
      id
      title
      seotitle
      image
      price
      offprice
      slug
      body
      seobody
      variations {
        idx
        value
        variation {
          title
          value
        }
      }
      category {
        title
      }
      featured
      hascomment
      status
      created
      updated
      quantity
    }
  }
`;
