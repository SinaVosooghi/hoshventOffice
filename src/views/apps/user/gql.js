import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "users";
export const ITEM_NAME_SINGULAR = "User";

export const USER_TYPES = [
  { value: "instructor", label: `${t("Instructor")}` },
  { value: "user", label: `${t("User")}` },
  { value: "lecturer", label: `${t("Lecturer")}` },
  { value: "guest", label: `${t("Guest")}` },
];

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
    }
  }
`;

export const UPLOAD_CSV_USERS = gql`
  mutation uploadUsersCsv($input: UploadUsersPdfInput!) {
    uploadUsersCsv(input: $input)
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeUser($id: Int!) {
    removeUser(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query users($input: GetUsersApiArgs!) {
    users(input: $input) {
      users {
        id
        email
        firstName
        lastName
        firstNameen
        lastNameen
        usertype
        updated
        mobilenumber
        created
        updated
        status
        avatar
        gender
        category {
          id
          title
          titleen
        }
        role {
          id
          title
        }
      }
      count
    }
  }
`;

export const GET_TIMELINE_ITEMS_QUERY = gql`
  query userTimelines($input: GetTimelinsArgs!) {
    userTimelines(input: $input) {
      timelines {
        id
        user {
          id
          firstName
          lastName
          mobilenumber
        }
        workshop {
          id
          title
          slug
          hall {
            event {
              title
              image
            }
          }
        }
        seminar {
          id
          title
          slug
          hall {
            event {
              title
              image
            }
          }
        }
        service {
          id
          title
        }
        checkin
        checkout
        created
        updated
      }
      count
      total
    }
  }
`;

export const GET_BULK_CHECKIN = gql`
  mutation bulkcheckin($input: Bulkaction!) {
    bulkcheckin(input: $input)
  }
`;

export const GET_BULK_CHECKOUT = gql`
  mutation bulkcheckout($input: Bulkaction!) {
    bulkcheckout(input: $input)
  }
`;

export const GET_PDF = gql`
  query usersPdf($input: GetUsersApiArgs!) {
    usersPdf(input: $input)
  }
`;

export const GET_ITEM_QUERY = gql`
  query user($id: Int!) {
    user(id: $id) {
      id
      email
      address
      username
      firstName
      lastName
      mobilenumber
      phonenumber
      usertype
      status
      about
      avatar
      updated
      created
      registerFields
      seminars {
        id
        title
      }
      workshops {
        id
        title
      }
      services {
        id
        title
      }
      category {
        id
        title
      }
      site {
        id
        title
        logo
        plan {
          id
          title
          sms
        }
      }
      role {
        id
        title
      }
    }
  }
`;
