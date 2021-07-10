import React, { useState, useEffect } from 'react';

import { Table, Button } from 'antd'

import { convertMoney } from '~/modules/Util'

import TableTotal from './TableTotal'
// import { Container } from './styles';

function ReturnTable({ orcamento, executarProcedimento }) {

  const TableReturn = ({ orcamento }) => {
    if (!orcamento) {
      return <></>
    }

    if (orcamento.pagamento.condicao === 'total') {
      return (
        <TableTotal orcamento={orcamento} executarProcedimento={executarProcedimento} />
      )
    }

    return <Table
      pagination={false}
      dataSource={orcamento.procedimentos}
      columns={[
        {
          title: 'Dente',
          dataIndex: 'dente',
          render: (data) => <span>{data ? data : "Geral"}</span>
        },
        {
          title: 'Procedimento',
          dataIndex: 'procedimento',
          render: (data) => <span>{data.name}</span>
        },
        {
          title: 'Face',
          dataIndex: 'faces',
          render: (data) => <span>{data ? data.map(item => {
            return (
              <span style={{ color: "red" }}>
                {item.label}
              </span>
            )
          }) : '-'}</span>
        },
        {
          title: 'Dentista',
          dataIndex: 'dentista',
          render: (data) => <span>{data.firstName} {orcamento.lastName}</span>,
        },
        {
          title: 'Valor',
          dataIndex: 'desconto',
          render: (data) => <span>{convertMoney(data)}</span>
        },
        {
          width: 120,
          render: (data) => (
            <Button
              type="primary"
              disabled={data.desconto > orcamento.saldo || data.status_execucao === 'executado'}
              onClick={(e) =>
                executarProcedimento(e, orcamento, data)
              }
            >
              {data.status_execucao === 'executado' ? 'Executado' : 'Executar'}
            </Button>)
        },
      ]}
    />
  }


  return (
    <TableReturn
      orcamento={orcamento}
    />
  )
}

export default ReturnTable;