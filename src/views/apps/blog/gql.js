import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "blogs";
export const ITEM_NAME_SINGULAR = "Blog";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateBlog($input: CreateBlogInput!) {
    createBlog(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateBlog($input: UpdateBlogInput!) {
    updateBlog(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeBlog($id: Int!) {
    removeBlog(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query blogs($input: GetBlogsArgs!) {
    blogs(input: $input) {
      blogs {
        id
        title
        slug
        image
        category {
          title
        }
        featured
        status
        created
        updated
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query blog($id: Int!) {
    blog(id: $id) {
      id
      title
      body
      status
      featured
      image
      created
      updated
      slug
      seotitle
      readtime
      seobody
      category {
        id
        title
      }
    }
  }
`;
