import {gql} from 'apollo-boost';

const GET_CLIENTS = gql`
  query clients($filters: ClientFilters!) {
    clients(filters: $filters) {
      id
      firstName
      lastName
      email
      role
      businessName
      rfc
      CFDIuse
      cellphone
      address
      prices {
        A4B
        A4D
        A5
        BASE
        CNC
        G2
        MIX
        SUBBASE
        SELLO
      }
      credit
    }
  }
`;

const GET_PRODUCTS = gql`
  query rocks($filters: RockFilters!) {
    rocks(filters: $filters) {
      name
      price
    }
  }
`;

export {GET_CLIENTS, GET_PRODUCTS};
