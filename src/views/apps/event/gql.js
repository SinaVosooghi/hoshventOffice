import { gql } from "@apollo/client";

export const ITEM_NAME = "events";
export const ITEM_NAME_SINGULAR = "Event";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateEvent($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeEvent($id: Int!) {
    removeEvent(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query events($input: GetEventsArgs!) {
    events(input: $input) {
      events {
        id
        title
        slug
        image
        duration
        site {
          title
        }
        category {
          title
        }
        featured
        status
        price
        created
        updated
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query event($id: Int!) {
    event(id: $id) {
      id
      title
      body
      status
      featured
      image
      created
      updated
      slug
      pdf
      seotitle
      start_date
      end_date
      price
      seobody
      capacity
      duration
      category {
        id
        title
      }
      site {
        id
        title
      }
    }
  }
`;
