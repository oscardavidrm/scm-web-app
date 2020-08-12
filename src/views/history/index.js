import React, { useEffect, useState } from 'react';
import { withApollo } from '@apollo/react-hoc';
import { useDebounce } from 'use-lodash-debounce';
import moment from 'moment-timezone';
import { useAuth } from 'components/providers/withAuth';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { format, printPDF } from 'utils/functions';
import { Button, notification, Row, Table, Tag, Tooltip, Typography } from 'antd';
import Title from './components/title';
import Audit from './components/audit';
import { Card, HistoryContainer, TableContainer } from './elements';
import { GET_HISTORY_TICKETS, GET_PDF } from './graphql/queries';

const { Text } = Typography;

const History = ({ client }) => {
  const [filters, setFilters] = useState({
    range: {
      start: moment().subtract(1, 'month'),
      end: moment()
    },
    turnId: '',
    billType: null,
    paymentType: null,
    clientIds: [],
    truckId: '',
    productId: '',
    folio: ''
  });
  const { isAdmin, isManager } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [results, setResults] = useState(0);
  const [ticketAuditing, setTicketAuditing] = useState(null);
  const debouncedFolio = useDebounce(filters.folio, 500);

  const handleFilterChange = (key, value) => {
    // eslint-disable-next-line no-param-reassign
    if (key === 'type' && value === '') value = null;
    const filtersToSet = { ...filters, [key]: value };

    setFilters(filtersToSet);
  };

  const handleDateFilterChange = dates => {
    const start = dates[0];
    const end = dates[1];

    setFilters({
      ...filters,
      range: {
        start,
        end
      }
    });
  };

  const downloadPDF = async id => {
    const {
      data: { ticketPDF }
    } = await client.query({
      query: GET_PDF,
      variables: {
        idOrFolio: id
      }
    });

    await printPDF(ticketPDF);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const {
          data: { archivedTickets }
        } = await client.query({
          query: GET_HISTORY_TICKETS,
          variables: {
            range: filters.range,
            turnId: filters.turnId,
            billType: filters.billType,
            paymentType: filters.paymentType,
            clientIds: filters.clientIds.map(composedId => composedId.split(':')[1]),
            truckId: filters.truckId,
            productId: filters.productId,
            folio: debouncedFolio,
            client: filters.client
          }
        });

        const archivedTicketsToSet = archivedTickets.map(ticket => ({
          ...ticket,
          subtotal: ticket.totalPrice - ticket.tax,
          businessName: ticket.client.businessName,
          plates: ticket.truck.plates,
          product: ticket.product.name
        }));

        setTickets(archivedTicketsToSet);
        setResults(archivedTicketsToSet.length);
        setLoading(false);
      } catch (e) {
        notification.open({
          message: '¡No se han podido cargar las boletas correctamente!'
        });
      }
    };

    getData();
  }, [
    filters.range,
    filters.turnId,
    filters.billType,
    filters.paymentType,
    filters.clientIds,
    filters.truckId,
    filters.productId,
    debouncedFolio,
    filters.client,
    client
  ]);

  const columns = [
    {
      title: 'Folio',
      dataIndex: 'folio',
      key: 'folio',
      width: 80
    },
    {
      title: 'Fecha',
      dataIndex: 'out',
      key: 'out',
      width: 130,
      render: out => (
        <>
          <Tag color="geekblue">{moment(out).format('DD/MM/YYYY')}</Tag>
          <Tag color="purple">{moment(out).format('HH:MM A')}</Tag>
        </>
      )
    },
    {
      title: 'Negocio',
      dataIndex: 'businessName',
      key: 'businessName',
      width: 250
    },
    {
      title: 'Placas',
      dataIndex: 'plates',
      key: 'plates',
      width: 100
    },
    {
      title: 'Producto',
      dataIndex: 'product',
      key: 'product',
      width: 100
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: 120,
      render: subtotal => <Tag>{format.currency(subtotal)}</Tag>
    },
    {
      title: 'Impuesto',
      dataIndex: 'tax',
      key: 'tax',
      width: 120,
      render: tax => <Tag>{format.currency(tax)}</Tag>
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 120,
      render: total => <Tag>{format.currency(total)}</Tag>
    },
    {
      title: 'Acciones',
      key: 'actions',
      align: 'right',
      render: row => (
        <Row>
          <Tooltip placement="top" title="Imprimir">
            <Button
              onClick={() => downloadPDF(row.id)}
              type="primary"
              icon="printer"
              size="small"
            />
          </Tooltip>
          {(isAdmin || isManager) && (
            <Tooltip placement="top" title="Auditoría">
              <Button
                style={{ marginLeft: 5 }}
                onClick={() => setTicketAuditing(row.id)}
                icon="monitor"
                size="small"
              />
            </Tooltip>
          )}
        </Row>
      )
    }
  ];

  return (
    <HistoryContainer>
      <Audit
        ticketAuditing={ticketAuditing}
        visible={!!ticketAuditing}
        onClose={() => setTicketAuditing(null)}
      />
      <TableContainer>
        <Card bordered={false}>
          <Table
            loading={loading}
            columns={columns}
            title={() => (
              <Title
                style={{ margin: 'auto 10px' }}
                level={3}
                filters={filters}
                results={results}
                handleFilterChange={handleFilterChange}
                handleDateFilterChange={handleDateFilterChange}
              />
            )}
            footer={ticketsToAdd => {
              let subtotal = 0;
              let tax = 0;
              let total = 0;

              ticketsToAdd.forEach(
                ({ subtotal: ticketSubtotal, tax: ticketTax, totalPrice: ticketTotal }) => {
                  subtotal += ticketSubtotal;
                  tax += ticketTax;
                  total += ticketTotal;
                }
              );

              return (
                <div style={{ display: 'flex' }}>
                  <Text style={{ marginRight: 10 }}>
                    Subtotal <Tag>{format.currency(subtotal)}</Tag>
                  </Text>
                  <Text style={{ marginRight: 10 }}>
                    Impuestos <Tag>{format.currency(tax)}</Tag>
                  </Text>
                  <Text style={{ marginRight: 10 }}>
                    Total <Tag>{format.currency(total)}</Tag>
                  </Text>
                </div>
              );
            }}
            size="small"
            scroll={{ x: true, y: '42vh' }}
            pagination={{ defaultPageSize: 40 }}
            dataSource={tickets.map(ticket => ({ ...ticket, key: shortid.generate() }))}
          />
        </Card>
      </TableContainer>
    </HistoryContainer>
  );
};

History.propTypes = {
  client: PropTypes.object.isRequired
};

export default withApollo(History);
