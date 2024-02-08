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
  query certificates($input: GetCertificatesArgs!) {
    certificates(input: $input) {
      certificates {
        id
        title
        status
        image
        created
        updated
        type
      }
      count
    }
  }
`;

export const GET_SITE_ITEM = gql`
  query site($id: Int!) {
    site(id: $id) {
      id
      title
      email
      company
      banner
      isNationalCode
      cardlayout
      phonenumber
      address
      city
      country
      language
      timezone
      zipcode
      cardnumber
      sheba
      slug
      seobody
      seotitle
      body
      logo
      created
      updated
      registerFields {
        order
        type
        title
        required
      }
      plan {
        id
        title
      }
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
      type
      itemLayout
    }
  }
`;
