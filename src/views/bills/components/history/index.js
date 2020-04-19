import React, { useEffect, useState } from 'react';
import { withApollo } from 'react-apollo';
import { useDebounce } from 'use-lodash-debounce';
import PropTypes from 'prop-types';
import moment from 'moment';
import shortid from 'shortid';
import { notification, Table, Tag, Row, Tooltip, Button } from 'antd';
import Title from './components/title';
import { Card, TableContainer } from './elements';
import { GET_BILLS, GET_PDF } from './graphql/queries';

const History = ({ client }) => {
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [filters, setFilters] = useState({ search: '' });
  const debouncedFilters = useDebounce(filters, 1000);

  const handleFilterChange = (key, value) => {
    const filtersToSet = { ...filters, [key]: value };

    setFilters(filtersToSet);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const {
          data: { bills: billsToSet }
        } = await client.query({
          query: GET_BILLS,
          variables: { filters: debouncedFilters }
        });

        setBills(billsToSet);
        setLoading(false);
      } catch (e) {
        notification.open({
          message: 'No se han podido cargar las boletas correctamente.'
        });
      }
    };

    getData();
  }, [debouncedFilters, client]);

  const downloadPDF = async ({ id, folio }) => {
    const {
      data: { billPDF }
    } = await client.query({
      query: GET_PDF,
      variables: {
        id
      }
    });

    const link = document.createElement('a');
    link.href = encodeURI(billPDF);
    link.download = `Factura-${folio}-${moment().format('lll')}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      render: date => moment(date).format('YYYY-MM-DD HH:MM:SS')
    },
    {
      title: 'Folio',
      dataIndex: 'folio',
      key: 'folio',
      render: folio => <Tag>{folio}</Tag>
    },
    {
      title: 'Cliente',
      dataIndex: 'client',
      key: 'client',
      render: ({ businessName }) => businessName
    },
    {
      title: 'Días de crédito',
      dataIndex: 'creditDays',
      key: 'creditDays'
    },
    {
      title: 'Tipo',
      dataIndex: 'bill',
      key: 'bill',
      render: bill => (bill ? <Tag color="green">FACTURA</Tag> : <Tag color="blue">REMISIÓN</Tag>)
    },
    {
      title: 'Impuestos',
      dataIndex: 'tax',
      key: 'tax',
      render: tax => `$${tax.toFixed(2)}`
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: total => `$${total.toFixed(2)}`
    },
    {
      title: 'Acciones',
      key: 'actions',
      align: 'right',
      render: row => (
        <Row>
          <Tooltip placement="top" title="Descargar PDF">
            <Button onClick={() => downloadPDF(row)} type="primary" icon="file-pdf" size="small" />
          </Tooltip>
        </Row>
      )
    }
  ];

  return (
    <TableContainer>
      <Card>
        <Table
          loading={loading}
          columns={columns}
          title={() => <Title handleFilterChange={handleFilterChange} />}
          size="small"
          scroll={{ x: true, y: true }}
          pagination={{ defaultPageSize: 20 }}
          dataSource={bills.map(billMapped => ({ ...billMapped, key: shortid.generate() }))}
        />
      </Card>
    </TableContainer>
  );
};

History.propTypes = {
  client: PropTypes.object.isRequired
};

export default withApollo(History);
