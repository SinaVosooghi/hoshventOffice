import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "menus";
export const ITEM_NAME_SINGULAR = "Menu";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateMenu($input: CreateMenuInput!) {
    createMenu(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateMenu($input: UpdateMenuInput!) {
    updateMenu(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeMenu($id: Int!) {
    removeMenu(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query menus($input: GetMenusArgs!) {
    menus(input: $input) {
      menus {
        id
        title
        status
        order
        link
        created
        updated
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query menu($id: Int!) {
    menu(id: $id) {
      id
      title
      status
      link
      order
      created
      updated
    }
  }
`;
