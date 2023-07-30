import { gql } from "@apollo/client";
import { t } from "i18next";

export const ITEM_NAME = "coupons";
export const ITEM_NAME_SINGULAR = "Coupon";

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateCoupon($input: CreateCouponInput!) {
    createCoupon(input: $input) {
      id
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation updateCoupon($input: UpdateCouponInput!) {
    updateCoupon(input: $input) {
      id
    }
  }
`;

export const DELETE_ITEM_MUTATION = gql`
  mutation removeCoupon($id: Int!) {
    removeCoupon(id: $id)
  }
`;

export const GET_ITEMS_QUERY = gql`
  query coupons($input: GetCouponsArgs!) {
    coupons(input: $input) {
      coupons {
        id
        title
        body
        code
        percent
        limit
        expiredate
        startdate
        type
        status
        created
        updated
      }
      count
    }
  }
`;

export const GET_ITEM_QUERY = gql`
  query coupon($id: Int!) {
    coupon(id: $id) {
      id
      title
      body
      code
      percent
      limit
      expiredate
      startdate
      type
      status
      created
      updated
    }
  }
`;
