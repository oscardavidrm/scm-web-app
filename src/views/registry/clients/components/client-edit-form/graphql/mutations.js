import { gql } from 'apollo-boost';

const EDIT_CLIENT = gql`
  mutation clientEdit($client: ClientEditInput!) {
    clientEdit(client: $client) {
      id
      uniqueId
      firstName
      lastName
      email
      role
      businessName
      rfc
      CFDIuse
      cellphone
      defaultCreditDays
      hasSubscription
      address {
        country
        state
        municipality
        city
        suburb
        street
        extNumber
        intNumber
        zipcode
      }
    }
  }
`;

export { EDIT_CLIENT };
