import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "blogs";
export const ITEM_NAME_SINGULAR = "Review";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateReview($input: UpdateReviewInput!) {
    updateReview(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeReview($id: Int!) {
    removeReview(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query reviews($input: GetReviewsArgs!) {
    reviews(input: $input) {
      reviews {
        id
        status
        created
        updated
        type
        product {
          id
          title
        }
        course {
          id
          title
        }
        blog {
          id
          title
        }
        comment {
          id
          body
        }
        user {
          firstName
          lastName
          email
        }
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query review($id: Int!) {
    review(id: $id) {
      id
      body
      status
      created
      updated
      product {
        id
        title
      }
      blog {
        id
        title
      }
      course {
        id
        title
      }
      user {
        firstName
        lastName
        email
      }
    }
  }
`;
