import {gql} from 'apollo-boost';

const GET_TICKETS = gql`
  query tickets($filters: TicketFilters!) {
    tickets(filters: $filters) {
      id
      folio
      driver
      credit
      client {
        firstName
        lastName
        businessName
        address
        rfc
        credit
        bill
        prices {
          N4B
          N4D
          N5
          BASE
          CNC
          GRAVA2
          MIXTO
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
