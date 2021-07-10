import React from 'react';

import { Container } from './styles';
import { Table } from 'antd'

function Equipamentos() {

  const columns = [
    {
      title: 'ESP Id',
      dataIndex: 'espid'
    },
    {
      title: 'Status ESP',
      dataIndex: 'status'
    },
    {
      title: 'Ultima conexão',
      dataIndex: 'updated_at'
    },
    {
      title: 'Clinica',
      dataIndex: 'clinicRelated'
    },
    {
      title: 'Ações',
    }
  ]

  return (
    <Container>
      <Table
        columns={columns}
      />
    </Container>
  )
}

export default Equipamentos;