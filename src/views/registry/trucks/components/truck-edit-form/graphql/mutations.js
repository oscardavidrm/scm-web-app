import { gql } from 'apollo-boost';

const EDIT_TRUCK = gql`
  mutation truckEdit($truck: TruckEditInput!) {
    truckEdit(truck: $truck) {
      id
      plates
      brand
      model
      client {
        id
        businessName
      }
      weight
      drivers
    }
  }
`;

export { EDIT_TRUCK };
