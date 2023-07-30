import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "questions";
export const ITEM_NAME_SINGULAR = "Question";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateQuestion($input: CreateQuestionInput!) {
    createQuestion(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateQuestion($input: UpdateQuestionInput!) {
    updateQuestion(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeQuestion($id: Int!) {
    removeQuestion(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query questions($input: GetQuestionsArgs!) {
    questions(input: $input) {
      questions {
        id
        title
        status
        type
        created
        updated
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query question($id: Int!) {
    question(id: $id) {
      id
      title
      type
      questions {
        title
      }
      status
      created
      updated
    }
  }
`;
