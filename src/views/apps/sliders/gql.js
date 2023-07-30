import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "sliders";
export const ITEM_NAME_SINGULAR = "Slider";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateSlider($input: CreateSliderInput!) {
    createSlider(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateSlider($input: UpdateSliderInput!) {
    updateSlider(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeSlider($id: Int!) {
    removeSlider(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query sliders($input: GetSlidersArgs!) {
    sliders(input: $input) {
      sliders {
        id
        link
        image
        alt
        status
        featured
        created
        updated
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query slider($id: Int!) {
    slider(id: $id) {
      id
      body
      status
      alt
      link
      image
      featured
      created
      updated
    }
  }
`;
