import { gql } from "@apollo/client";

export const ITEM_NAME = "plans";
export const ITEM_NAME_SINGULAR = "Plan";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreatePlan($input: CreatePlanInput!) {
    createPlan(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updatePlan($input: UpdatePlanInput!) {
    updatePlan(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removePlan($id: Int!) {
    removePlan(id: $id)
  }
`;

export const DELETE_IMAGE_MUTATION = gql`
  mutation removeImage($id: Int!) {
    removeImage(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query plans($input: GetPlansArgs!) {
    plans(input: $input) {
      plans {
        id
        title
        slug
        services {
          title
        }
        price
        sms
        image
        status
        created
        updated
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query plan($id: Int!) {
    plan(id: $id) {
      id
      title
      subtitle
      body
      slug
      status
      services {
        id
        title
        image
      }
      image
      sms
      created
      updated
      price
    }
  }
`;
