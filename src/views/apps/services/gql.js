import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "services";
export const ITEM_NAME_SINGULAR = "Service";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateService($input: UpdateServiceInput!) {
    updateService(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeService($id: Int!) {
    removeService(id: $id)
  }
`;

export const DELETE_IMAGE_MUTATION = gql`
  mutation removeImage($id: Int!) {
    removeImage(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query services($input: GetServicesArgs!) {
    services(input: $input) {
      services {
        id
        title
        price
        image
        events {
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
  query service($id: Int!) {
    service(id: $id) {
      id
      title
      body
      status
      image
      created
      updated
      price
      quantity
      start_date
      end_date
      perperson
      events {
        id
        title
        image
      }
    }
  }
`;
