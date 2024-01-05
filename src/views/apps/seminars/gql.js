import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "seminars";
export const ITEM_NAME_SINGULAR = "Seminar";

export const WORKSHOP_STATES = [
  { value: "not_started", label: t("Not started") },
  { value: "running", label: t("Running") },
  { value: "ended", label: t("Ended") },
  { value: "canceled", label: t("Canceled") },
];

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateSeminar($input: CreateSeminarInput!) {
    createSeminar(input: $input) {
      id
    }
  }
`;

export const GET_SEMINAR_PDF = gql`
  query seminarsPdf($input: GetSeminarsArgs!) {
    seminarsPdf(input: $input)
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateSeminar($input: UpdateSeminarInput!) {
    updateSeminar(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeSeminar($id: Int!) {
    removeSeminar(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query seminars($input: GetSeminarsArgs!) {
    seminars(input: $input) {
      seminars {
        id
        title
        capacity
        hall {
          title
          site {
            title
          }
        }
        scans {
          id
          type
        }
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
  query seminar($id: Int!) {
    seminar(id: $id) {
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
