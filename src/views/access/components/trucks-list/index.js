import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from '@apollo/react-hoc';
import { List } from 'antd';
import { ListContainer } from './elements';
import { GET_ACTIVE_TICKETS } from './graphql/queries';
import { ACTIVE_TICKETS } from './graphql/subscriptions';

class TrucksList extends Component {
  componentDidMount = () => {
    const {
      data: { subscribeToMore }
    } = this.props;

    if (!this.unsubscribeToActiveTickets)
      this.unsubscribeToActiveTickets = this.subscribeToActiveTickets(subscribeToMore);
  };

  componentWillUnmount = () => {
    this.unsubscribeToActiveTickets();
  };

  subscribeToActiveTickets = subscribeToMore => {
    return subscribeToMore({
      document: ACTIVE_TICKETS,
      updateQuery: (prev, { subscriptionData: { data } }) => {
        const { activeTickets } = data;
        if (!activeTickets) return prev;

        return { activeTickets: [...activeTickets] };
      }
    });
  };

  render() {
    const { data } = this.props;
    const { loading, error, activeTickets: tickets } = data;

    return (
      <ListContainer>
        {error ? (
          <div>¡No se han podido cargar los camiones!</div>
        ) : loading ? (
          <div>Cargando camiones activos...</div>
        ) : (
          <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={tickets}
            size="small"
            renderItem={ticket => (
              <List.Item>
                <List.Item.Meta
                  title={`${ticket.truck.plates} : ${ticket.product.name}`}
                  description={`${ticket.client.businessName}`}
                />
              </List.Item>
            )}
          />
        )}
      </ListContainer>
    );
  }
}

TrucksList.propTypes = {
  data: PropTypes.object.isRequired
};

export default graphql(GET_ACTIVE_TICKETS, { options: () => ({ variables: { filters: {} } }) })(
  TrucksList
);
