import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "halls";
export const ITEM_NAME_SINGULAR = "Hall";

export const WORKSHOP_STATES = [
  { value: "not_started", label: t("Not started") },
  { value: "running", label: t("Running") },
  { value: "ended", label: t("Ended") },
  { value: "canceled", label: t("Canceled") },
];

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateHall($input: CreateHallInput!) {
    createHall(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateHall($input: UpdateHallInput!) {
    updateHall(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeHall($id: Int!) {
    removeHall(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query halls($input: GetHallsArgs!) {
    halls(input: $input) {
      halls {
        id
        title
        event {
          title
          site {
            title
          }
        }
        status
        created
        updated
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query hall($id: Int!) {
    hall(id: $id) {
      id
      title
      body
      status
      featured
      image
      created
      updated
      event {
        id
        title
        site {
          title
        }
      }
    }
  }
`;
