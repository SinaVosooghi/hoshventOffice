import { gql } from "@apollo/client";

export const ITEM_NAME = "scans";
export const ITEM_NAME_SINGULAR = "Scan";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateScan($input: CreateScanInput!) {
    createScan(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateScan($input: UpdateScanInput!) {
    updateScan(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeScan($id: Int!) {
    removeScan(id: $id)
  }
`;

export const DELETE_IMAGE_MUTATION = gql`
  mutation removeImage($id: Int!) {
    removeImage(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query scans($input: GetScansArgs!) {
    scans(input: $input) {
      scans {
        id
        created
        type
        user {
          firstName
          lastName
        }
        scanby {
          firstName
          lastName
        }
        workshop {
          title
        }
        seminar {
          title
        }
        updated
        senmiarstimeline {
          id
          type
        }
        workshopstimeline {
          id
          type
        }
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query scan($id: Int!) {
    scan(id: $id) {
      id
      created
      type
      user {
        firstName
        lastName
      }
      workshop {
        title
      }
      seminar {
        title
      }
    }
  }
`;
