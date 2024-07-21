import { gql } from "@apollo/client";

export const GET_SCANS_ITEMS = gql`
  query scans($input: GetScansArgs!) {
    scans(input: $input) {
      scans {
        id
        created
        type
      }
      count
    }
  }
`;

export const GET_PRINT_ITEMS = gql`
  query prints($input: GetPrintsArgs!) {
    prints(input: $input) {
      prints {
        id
      }
      count
    }
  }
`;
