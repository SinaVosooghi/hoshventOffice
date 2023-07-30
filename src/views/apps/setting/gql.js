import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "categories";
export const ITEM_NAME_SINGULAR = "Category";

export const CREATE_ITEM_MUTATION = gql`
  mutation createSetting($input: CreateSettingInput!) {
    createSetting(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateSetting($input: UpdateSettingInput!) {
    updateSetting(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeCategory($id: Int!) {
    removeCategory(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query categories($input: GetCategoriesArgs!) {
    categories(input: $input) {
      categories {
        id
        title
        type
        category {
          title
        }
        status
        created
        updated
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query GetSetting {
    getSetting {
      title
      companyName
      address
      phoneNumber
      keywords
      email
      logo
      logo_second
      favicon
      description
      seodescription
      policy
      contact
      about
      faq
      maintenance
      copyright
      tax
      workinghours
      whatsapp
      instagram
      facebook
      twitter
      youtube
      linkedin
      support
    }
  }
`;
