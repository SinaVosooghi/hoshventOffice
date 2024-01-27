import { gql } from "@apollo/client";

export const GET_ATTENDEES_ITEMS = gql`
  query attendees($input: GetAttendeesArgs!) {
    attendees(input: $input) {
      attends {
        id
        created
        user {
          id
          email
          firstName
          lastName
          firstNameen
          lastNameen
          usertype
          updated
          mobilenumber
          category {
            title
            titleen
          }
          created
          status
        }
      }
      count
    }
  }
`;
