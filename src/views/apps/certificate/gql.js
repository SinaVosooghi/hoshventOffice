import { gql } from "@apollo/client";

export const ITEM_NAME = "certificates";
export const ITEM_NAME_SINGULAR = "Certificate";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateCertificate($input: CreateCertificateInput!) {
    createCertificate(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateCertificate($input: UpdateCertificateInput!) {
    updateCertificate(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeCertificate($id: Int!) {
    removeCertificate(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query certificates($input: GetCategoriesArgs!) {
    certificates(input: $input) {
      certificates {
        id
        title
        status
        created
        updated
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query certificate($id: Int!) {
    certificate(id: $id) {
      id
      status
      image
      created
      updated
      title
    }
  }
`;
