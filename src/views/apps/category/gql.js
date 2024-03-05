import { gql } from "@apollo/client";

export const ITEM_NAME = "categories";
export const ITEM_NAME_SINGULAR = "Category";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeCategory($id: Int!) {
    removeCategory(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query categories($input: GetCategoriesArgs!) {
    categories(input: $input) {
      categories {
        id
        title
        type
        image
        category {
          title
        }
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
  query category($id: Int!) {
    category(id: $id) {
      id
      title
      titleen
      body
      status
      featured
      type
      image
      created
      updated
      slug
      category {
        id
        title
      }
    }
  }
`;
