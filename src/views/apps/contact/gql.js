import { gql } from "@apollo/client";

export const ITEM_NAME = "contacts";
export const FA_ITEM_NAME = "پیام";

export const CREATE_ITEM_MUTATION = gql`
  mutation createContact($input: CreateContactInput!) {
    createContact(input: $input) {
      id
    }
  }
`;

export const GET_ITEMS_QUERY = gql`
  query contacts($input: GetContactsArgs!) {
    contacts(input: $input) {
      contacts {
        id
        name
        email
        body
        created
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query contact($id: Int!) {
    contact(id: $id) {
      id
      name
      email
      subject
      body
      created
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeContact($id: Int!) {
    removeContact(id: $id)
  }
`;
