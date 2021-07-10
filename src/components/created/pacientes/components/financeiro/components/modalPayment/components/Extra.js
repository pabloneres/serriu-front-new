import React, { useState } from 'react';

// import { Container } from './styles';

import { index, update } from '~/controllers/controller'
import { useSelector } from 'react-redux';

import { Select } from 'antd'

const Extra = ({ pagamento, callback, pagamentos }) => {
  const [condicao, setCondicao] = useState(undefined)

  const { token } = useSelector(state => state.auth)

  const handleChange = (e) => {
    update(token, 'forma_pagamento', pagamento.id, {
      condicao: e
    }).then(_ => {
      callback()
    })
  }

  return (
    <Select
      style={{ width: "50%" }}
      onChange={e => handleChange(e)}
      defaultValue={pagamento.condicao}
      disabled={pagamentos.length > 0}
      options={[
        {
          label: "Total",
          value: "total",
        },
        {
          label: "Procedimento",
          value: "procedimento",
        },
        {
          label: "Boleto",
          value: "boleto",
        },
      ]}
    />
  )
}

export default Extra;