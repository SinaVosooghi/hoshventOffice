import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "blogs";
export const ITEM_NAME_SINGULAR = "Lesson";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateLesson($input: CreateLessonInput!) {
    createLesson(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateLesson($input: UpdateLessonInput!) {
    updateLesson(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeLesson($id: Int!) {
    removeLesson(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query lessons($input: GetLessonsArgs!) {
    lessons(input: $input) {
      lessons {
        id
        title
        duration
        excerpt
        public
        user {
          id
          firstName
          lastName
        }
        course {
          id
          title
        }
        type
        slug
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
  query lesson($id: Int!) {
    lesson(id: $id) {
      id
      title
      duration
      excerpt
      type
      public
      order
      body
      seotitle
      image
      seobody
      duration
      conferenceoptions {
        startdate
        enddate
        password
        joinanytime
        host
        requireauth
        joinlink
        schedule_for
        repeat_interval
        weekly_days
      }
      videooptions {
        type
        video
        link
        width
      }
      user {
        id
        firstName
        lastName
      }
      course {
        id
        title
      }
      slug
      featured
      status
      created
      updated
    }
  }
`;
