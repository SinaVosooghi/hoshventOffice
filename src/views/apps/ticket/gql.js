import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "chats";
export const ITEM_NAME_SINGULAR = "Chat";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateChat($input: CreateChatInput!) {
    createChat(input: $input)
  }
`;

export const CREATE_INVOICE_CHAT_ITEM_MUTATION = gql`
  mutation createInvoiceChat($input: CreateChatInput!) {
    createInvoiceChat(input: $input)
  }
`;

export const CREATE_MESSAGE_ITEM_MUTATION = gql`
  mutation createMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateChat($input: UpdateChatInput!) {
    updateChat(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeChat($id: Int!) {
    removeChat(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query chats($input: GetChatsArgs!) {
    chats(input: $input) {
      chats {
        id
        subject
        status
        sms
        from {
          id
          firstName
          lastName
        }
        invoice {
          id
          invoicenumber
          total
        }
        department {
          id
          title
        }
        messages {
          body
          created
        }
        repliable
        closed
        priority
        type
        starred
        created
        updated
        from_read
        to_read
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query chat($id: Int!) {
    chat(id: $id) {
      id
      subject
      status
      from {
        id
        firstName
        lastName
        email
      }
      to {
        id
        firstName
        lastName
        email
      }
      invoice {
        id
        invoicenumber
        total
      }
      messages {
        body
        created
        user {
          id
          firstName
          lastName
          email
          created
        }
      }
      type
      priority
      repliable
      closed
      starred
      created
      updated
    }
  }
`;
