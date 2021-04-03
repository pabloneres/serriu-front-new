import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardHeaderToolbar } from "~/_metronic/_partials/controls";
import { Link } from "react-router-dom";

import { Table, Modal, Button, Form, Col, InputGroup } from "react-bootstrap";

import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { index, update, show } from "~/app/controllers/controller";

import Select from 'react-select'

export function Comissoes(props) {
  // const { params, url } = useRouteMatch();
  const { intl } = props;
  const {
    user: {authToken, dentists}
  } = useSelector(state => state.auth);
  const history = useHistory();


  const [reload, setReload] = useState(false);
  const [dentistData, setDentistData] = useState({})
  const [config, setConfig] = useState({})
  
  const [option, setOption] = useState(undefined)
  const [values, setValues] = useState({})
  const [optionsStatus, setOptionsStatus] = useState([
    {
      label: 'Todos',
      value: undefined
    },
    {
      label: 'Pendente',
      value: 0
    },
    {
      label: 'Á Pagar',
      value: 1
    },
    {
      label: 'Pago',
      value: 2
    },
  ])

  const [pagamentos, setPagamentos] = useState([])

  useEffect(() => {
    show(authToken, '/dentist', dentists[0].id)
    .then(({data}) => {
      setDentistData(data[0])
    })
    .catch((err)=> history.push('/dentista'))

    index(authToken, `/configuracao/comissao/${dentists[0].id}`).then(({ data }) => {
      setConfig(data)
    })
 
    index(authToken, `/comissao/valores/${dentists[0].id}`).then(({ data }) => {
      console.log(data)
      setValues(data)
    })
  }, [authToken, reload]);

  useEffect(() => {
    index(authToken, `/comissao/${dentists[0].id}?status=${option}`).then(
      ({ data }) => {
        setPagamentos(data);
      }
    );
  }, [option])

  const convertMoney = (value) => {
    return Number(value).toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL"
    })
  }

  const returnPorcentagem = (value) => {
    let porcentagem = config.comissao_geral
    let valor = value

    return convertMoney((valor * porcentagem) / 100)
  }

  const returnStatusComissao = (status) => {
    switch (status) {
      case 0:
        return 'Aguardando Cliente' 
    
      case 1:
        return 'A Pagar' 
     
      case 2:
      return 'Pago' 
    
      default:
        return;
    }

    return 
  }

  return (
    <Card>
      <CardHeader title={`Comisões`}>
        <CardHeaderToolbar style={{flex: 1}}>
          <div style={{flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
            
            <Select
              className="select_agenda"
              placeholder="Filtro"
              options={optionsStatus}
              defaultValue={optionsStatus[0]}
              onChange={(value) => {
                setOption(value.value);
              }}
            />
            
            <div style={{display: 'flex', flexDirection: 'row'}}>


              <fieldset className="fildset-container" style={{marginRight: 20}} >
              <legend className="fildset-title">Á Pagar</legend>
                <span>{convertMoney(values.apagar)}</span>
              </fieldset>
             
              <fieldset className="fildset-container" >
              <legend className="fildset-title">Pendente</legend>
                <span>{convertMoney(values.pendentes)}</span>
              </fieldset>
            </div>

            <Button>Pagar</Button>

          </div>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Aprovar</th>
              <th>Data</th>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Paciente</th>
              <th>Status</th>
              <th>Aprovado</th>
              <th>Valor Orçamento</th>
              <th>Valor Comissão</th>
            </tr>
          </thead>
          <tbody>
            {
              pagamentos.map(item => (
                <tr>
                  <td>
                  <Form.Check 
                    type="checkbox" 
                    // label="Descontar Taxas de Pagamento" 
                    defaultChecked={config.requer_aprovacao === 0}
                    disabled={config.requer_aprovacao === 1}
                    // onChange={(e) => updateConfig({descontar_impostos: e.target.checked ? 1 : 0})}
                  />
                  </td>
                  <td>{item.criado_em}</td>
                  <td></td>
                  <td></td>
                  <td>{item.pacientes.name}</td>
                  <td>{returnStatusComissao(item.status_comissao)}</td>
                  <td>Sim</td>
                  <td>{convertMoney(item.valor)}</td>
                  <td>{convertMoney(item.comissao_valor)}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
