import { UseSelectStateChangeTypes } from 'downshift';
import React, {useEffect, useState} from 'react';
import { 
  Container,
  Span,
  AInput,
  AForm,
  ACheckBox,
  ASelect,
  ARadio,
  ARow,
  AButton
} from './styles';
import { index } from '~/controllers/controller'
import { useSelector } from 'react-redux'
import Form from 'antd/lib/form/Form';

function Boleto(props) {
  const { token } = useSelector(state => state.auth)
  const { selectedClinic } = useSelector(state => state.clinic)
  const [cargos, setCargos] = useState([])

  useEffect(() => {
    index(token, '/cargo').then(({data}) => {
      setCargos(data)
    })
  }, [])

  return (
    <Container title="Boleto">
      <AForm layout="vertical" onFinish={(e) => {console.log(e)}} >
        <ARow>
          <AForm.Item 
            label="Essa clinica trabalha com boletos ?"
            name="recebe_comissao" 
          >
            <ARadio.Group
              options={[
                {
                  label: 'Sim',
                  value: 'sim'
                },
                {
                  label: 'Não',
                  value: 'nao'
                },
              ]}
            />
          </AForm.Item>
        </ARow>
        <ARow>
          <AForm.Item 
            label="Quantidade máxima de parcelas"
            name="max_boletos"
          >
            <ASelect
              options={[...Array(10).keys()].map((item, index) => ({
                label: `${index + 1 }X`,
                value: index + 1
              }))}
            />
          </AForm.Item>
        </ARow>
        <ARow>
          <AForm.Item
            label="Entrada mínima permitida"
            name="min_entrada"
          >
            <AInput
              suffix="%"
            />
          </AForm.Item>
        </ARow>
        <AButton htmlType="submit" >
          Enviar
        </AButton>
      </AForm>
    </Container>
  )
}

export default Boleto;