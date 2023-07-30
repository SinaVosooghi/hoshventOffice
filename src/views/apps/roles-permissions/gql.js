import { gql } from "@apollo/client";

export const ITEM_NAME = "roles";
export const ITEM_NAME_SINGULAR = "Role";

export const ROLES_ARRAY = [
  { title: "Categories", value: "categories" },
  { title: "Users", value: "users" },
  { title: "Roles", value: "roles" },
  { title: "Chats", value: "messages" },
  { title: "Setting", value: "setting" },
  { title: "Coupons", value: "coupons" },
];

export const CREATE_ITEM_MUTATION = gql`
  mutation createRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      title
    }
  }
`;

export const GET_ITEMS_QUERY = gql`
  query roles($input: GetRolesApiArgs!) {
    roles(input: $input) {
      roles {
        id
        title
        status
        created
        updated
        body
        users {
          id
        }
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query role($id: Int!) {
    role(id: $id) {
      title
      created
      updated
      permissions {
        read {
          key
          value
        }
        update {
          key
          value
        }
        create {
          key
          value
        }
        delete {
          key
          value
        }
      }
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeRole($id: Int!) {
    removeRole(id: $id)
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateRole($input: UpdateRoleInput!) {
    updateRole(input: $input) {
      title
    }
  }
`;
