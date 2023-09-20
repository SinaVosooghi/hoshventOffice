import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "workshops";
export const ITEM_NAME_SINGULAR = "Workshop";

export const WORKSHOP_STATES = [
  { value: "not_started", label: t("Not started") },
  { value: "running", label: t("Running") },
  { value: "ended", label: t("Ended") },
  { value: "canceled", label: t("Canceled") },
];

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateWorkshop($input: CreateWorkshopInput!) {
    createWorkshop(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateWorkshop($input: UpdateWorkshopInput!) {
    updateWorkshop(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeWorkshop($id: Int!) {
    removeWorkshop(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query workshops($input: GetWorkshopsArgs!) {
    workshops(input: $input) {
      workshops {
        id
        title
        image
        hall {
          title
          site {
            title
          }
        }
        price
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
  query workshop($id: Int!) {
    workshop(id: $id) {
      id
      title
      body
      status
      featured
      image
      created
      updated
      slug
      state
      price
      capacity
      lecturers {
        id
        firstName
        lastName
        avatar
      }
      services {
        id
        title
        image
      }
      state
      start_date
      end_date
      hall {
        id
        title
        site {
          id
          title
        }
      }
    }
  }
`;
