import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "departments";
export const ITEM_NAME_SINGULAR = "Department";

export const CREATE_ITEM_MUTATION = gql`
  mutation createDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateDepartment($input: UpdateDepartmentInput!) {
    updateDepartment(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeDepartment($id: Int!) {
    removeDepartment(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query departments($input: GetDepartmentsArgs!) {
    departments(input: $input) {
      departments {
        id
        title
        body
        status
        created
        updated
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query department($id: Int!) {
    department(id: $id) {
      id
      title
      body
      status
      created
      updated
    }
  }
`;
