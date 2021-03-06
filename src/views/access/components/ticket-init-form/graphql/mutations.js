import { gql } from 'apollo-boost';

const REGISTER_TICKET_INIT = gql`
  mutation ticketInit($ticket: TicketInitInput!) {
    ticketInit(ticket: $ticket) {
      id
      truck {
        id
        plates
      }
    }
  }
`;

export { REGISTER_TICKET_INIT };
