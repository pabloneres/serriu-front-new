
import React, { useEffect, useState } from "react";
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import { AdicionarOrcamentoPage } from "~/app/pages/orcamento/AdicionarOrcamentoPage";
import { Link } from 'react-router-dom'
import SVG from 'react-inlinesvg'
import { Table } from "react-bootstrap";
import { store, index, getProcedimentos, orcamento, show, destroy, aprovar } from '~/app/controllers/orcamentoController';
import { useSelector } from "react-redux";
import {format} from 'date-fns-tz'

import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody
} from "~/_metronic/_partials/controls";

import { Modal, Button, Form, Col, InputGroup } from 'react-bootstrap'
import { set } from "lodash";

export function Orcamentos() {
  const {user: {authToken}} = useSelector((state) => state.auth);
  const { params, url } = useRouteMatch()
  const [showForm, setShowForm] = useState(false)
  const [ logout, setLogout ] = useState(false)
  const [orcamentos, setOrcamentos] = useState([])
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState([])
  const [ getOrcamento, setGetOrcamento ] = useState([])
  const [showOrcamento, setShowOrcamento] = useState(false)
  const [reload, setReload] = useState(false)
  const history = useHistory();

  useEffect(() => {
    orcamento(authToken, params.id)
    .then( ({data}) => {
      console.log(data)
      setOrcamentos(data)
    }).catch((err)=>{
      if (err.response.status === 401) {
        setLogout(true)
      }
    })
}, [reload])

function handleDelete(id) {
  destroy(authToken, id).then(()=>{
    setReload(!reload)
  }).catch((err)=> console.log(err))
}
function handleEdit(orcamento) {
  setOrcamentoSelecionado(orcamento)
  setShowForm(true);

}

function handleShow(id) {
  show(authToken, id).then(({data}) => {
    // setGetOrcamento(data)
    console.log(data)
    setGetOrcamento({
      ...data,
      dentes: data.dentes.map(item => {
        return {
          ...item,
          faces: JSON.parse(item.faces)
        }
      })
    })
  })
  setShowOrcamento(true)
}

function handleAprovar(id) {
  aprovar(authToken, id).then(()=>{
    setReload(!reload)
    setShowOrcamento(false)
    setGetOrcamento([])
  })
}

function verifyAprovado(el) {
  switch (el) {
    case null:
      return (
        <strong style={{color: 'red'}}>Em aberto</strong>
      )
    case 1:
      return (
        <strong style={{color: 'green'}}>Aprovado</strong>
      )
    case 2:
      return (
        <strong style={{color: 'orange'}}>Em andamento</strong>
      )
    case 3:
      return (
        <strong style={{color: 'blue'}}>Executado</strong>
      )
  }
}

  function HandleOrcamento() {
    if (showForm) {
      return <AdicionarOrcamentoPage orcamento={orcamentoSelecionado} alterar={orcamentoSelecionado !== undefined} />
    }

    if (!showForm) {
      return (
        <Card>
          <CardHeader title="Orçamentos">
            <CardHeaderToolbar>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => { 
                  setShowForm(true) 
                  setOrcamentoSelecionado(undefined);
                }}
              >
                Adicionar Orcamento
                </button>
            </CardHeaderToolbar>
          </CardHeader>
          <CardBody>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Dentista</th>
                  <th>Status</th>
                  <th>Valor</th>
                  <th style={{ "width": 100 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
              {orcamentos.map( orcamento => (
                <tr key={orcamento.id} >
                  <td>{orcamento.criado_em}</td>
                  <td>{orcamento.dentistas.name}</td>
                  <td>{verifyAprovado(orcamento.aprovado)}</td>
                  <td>{ orcamento.total ? orcamento.total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) : '' }
                  </td>
                  <td><Link to={''} />
                  <span onClick={() => { 
                    // handleEdit(orcamento)
                     } } style={{"cursor": "pointer"}} className="svg-icon menu-icon">
                    <SVG style={{"fill": "#3699FF", "color": "#3699FF"}} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
                  </span>
                  <span onClick={() => handleDelete(orcamento.id) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
                    <SVG style={{"fill": "#3699FF", "color": "#3699FF", "marginLeft": 8}} src={toAbsoluteUrl("/media/svg/icons/Design/delete.svg")} />
                  </span>
                  <span onClick={() => handleShow(orcamento.id) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
                    <SVG style={{"fill": "#3699FF", "color": "#3699FF", "marginLeft": 8}} src={toAbsoluteUrl("/media/svg/icons/Design/view.svg")} />
                  </span>
                  </td>
                </tr>
              ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      )
    }
    return
  }

  return (
    <>
      <Modal
        show={showOrcamento}
        size="lg"
      >
        <Modal.Header>
          Orçamento
        </Modal.Header>
        <Modal.Body>
        <Table striped bordered hover>
            <thead>
                <tr>
                  <th>
                  Informações
                  </th>
                </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Dentista
                </td>
                <td>
                  {getOrcamento.dentistas ? getOrcamento.dentistas.name : ''}
                </td>
              </tr>
              <tr>
                <td>
                  Data
                </td>
                <td>
                  {getOrcamento.criado_em}
                </td>
              </tr>
              <tr>
                <td>
                  Status
                </td>
                <td>
                  {verifyAprovado(getOrcamento.aprovado)}
                </td>
              </tr>
            </tbody>
          </Table>
          <Table striped bordered hover>
            <thead>
                <tr>
                  <th>Procedimentos</th>
                  <th>Dente</th>
                  <th>Faces</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
            </thead>
            <tbody>
             { getOrcamento.dentes ? 
               getOrcamento.dentes.map( orcamento => (
                <tr key={orcamento.id}>
                <td>
                  {orcamento.procedimento_nome}
                </td>
                <td>
                  { orcamento.label ? orcamento.label : 'Geral' }
                </td>
                <td>
                  {orcamento.faces ? orcamento.faces.map(face => (
                    <span style={{color: 'red'}}>{face.label}
                    {' '}</span>
                  )): 'Geral'}
                </td>
                <td>
                  {orcamento.valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                </td>
                <td>
                  {orcamento.status === 1 ? <span style={{color: 'green'}}>Executado</span> : <span style={{color: 'red'}}>Pendente</span>}
                </td>
              </tr>
               )) : ''
             }
            </tbody>
          </Table>
          <Table striped bordered hover>
            <thead>
                <tr>
                  <th>
                  Forma de pagamento
                  </th>
                </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Total / Parcelado
                </td>
                <td>
                  {getOrcamento.formaCobranca === 'valor total' ? 'Total' : 'Parcelado'}
                </td>
              </tr>
              <tr>
                <td>
                  Forma de pagamento
                </td>
                <td>
                  {getOrcamento.formaPagamento === 'dinheiro' ? 'Dinheiro' : 'Boleto'}
                </td>
              </tr>
              
                {getOrcamento.tipoPagamento === 0 ? 
                  ''
                : (
                  <tr>
                    <td>
                      Parcelamento
                    </td>
                    <td>
                      {getOrcamento.total ? `Entrada de ${(getOrcamento.total*getOrcamento.valorEntrada).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} + ` : ''}
                      <span style={{color: 'red'}}>
                      {`${getOrcamento.parcelas} X ${((getOrcamento.total - (getOrcamento.total*getOrcamento.valorEntrada)) / getOrcamento.parcelas).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`}
                      </span>
                    </td>
                  </tr>
                )}
              
            </tbody>
          </Table>
          <div className="text-right" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span>Total <strong>{getOrcamento.total ? getOrcamento.total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) : ''}</strong></span>            
             <div>
              {getOrcamento.aprovado === 1 ? (
                <Button onClick={() => {handleAprovar(getOrcamento.id)}} className="mr-2" variant="primary">
                  Aprovar
                </Button>
              ) : ''}
              <Button onClick={() => {setShowOrcamento(false)}} className="mr-2" variant="danger">
                Fechar
              </Button>
             </div>
          </div>
        </Modal.Body>
      </Modal>
      <HandleOrcamento />
    </>
  );
}
