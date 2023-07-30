import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "blogs";
export const ITEM_NAME_SINGULAR = "Course";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateCourse($input: UpdateCourseInput!) {
    updateCourse(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeCourse($id: Int!) {
    removeCourse(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query courses($input: GetCoursesArgs!) {
    courses(input: $input) {
      courses {
        id
        title
        duration
        capacity
        video
        price
        offprice
        organizer {
          firstName
          lastName
        }
        slug
        category {
          title
        }
        featured
        status
        created
        updated
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query course($id: Int!) {
    course(id: $id) {
      id
      title
      seotitle
      image
      duration
      capacity
      video
      price
      offprice
      classlink
      sections {
        title
        lessons {
          order
          lesson {
            title
            id
          }
        }
      }
      prerequisite {
        title
      }
      organizer {
        id
        firstName
        lastName
      }
      attendees {
        id
        user {
          id
          email
          firstName
          lastName
          usertype
          updated
          mobilenumber
          created
          status
        }
      }
      slug
      body
      seobody
      category {
        title
      }
      featured
      status
      created
      updated
    }
  }
`;
