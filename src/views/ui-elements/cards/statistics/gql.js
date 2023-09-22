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
