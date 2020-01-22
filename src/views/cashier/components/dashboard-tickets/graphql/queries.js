import {gql} from 'apollo-boost';

const GET_TICKETS = gql`
  query tickets($filters: TicketFilters!) {
    tickets(filters: $filters) {
      id
      folio
      driver
      credit
      bill
      client {
        firstName
        lastName
        businessName
        address
        rfc
        credit
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
      }
      truck {
        id
        plates
        weight
      }
      product {
        name
        price
      }
      weight
      totalWeight
      totalPrice
      inTruckImage
      outTruckImage
    }
  }
`;

const TURN_ACTIVE = gql`
    query turnActive {
        turnActive {
          id
          start
          end
          period
        }
    }
`;

export {GET_TICKETS, TURN_ACTIVE};
