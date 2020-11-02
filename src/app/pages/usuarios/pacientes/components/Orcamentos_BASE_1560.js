
import React, { useEffect, useState } from "react";
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import { AdicionarOrcamentoPage } from "~/app/pages/orcamento/AdicionarOrcamentoPage";
import { Link } from 'react-router-dom'
import SVG from 'react-inlinesvg'
import { Table } from "react-bootstrap";
import { store, index, getProcedimentos, orcamento, show } from '~/app/controllers/orcamentoController';
import { useSelector } from "react-redux";

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
}, [])

function handleDelete() {}
function handleEdit(orcamento) {
  setOrcamentoSelecionado(orcamento);
  setShowForm(true);

}
function handleShow(id) {
  show(authToken, id).then(({data}) => {
    console.log(data)
    setGetOrcamento(data)
  })
  setShowOrcamento(true)
}


  function HandleOrcamento() {
    if (showForm) {
      return <AdicionarOrcamentoPage orcamento={orcamentoSelecionado} />
    }

    if (!showForm) {
      return (
        <Card>
          <CardHeader title="Orçamentos">
            <CardHeaderToolbar>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => { setShowForm(true) }}
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
                  <th>Valor</th>
                  <th style={{ "width": 100 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
              {orcamentos.map( orcamento => (
                <tr key={orcamento.id} >
                  <td>{orcamento.created_at}</td>
                  <td>{orcamento.dentista}</td>
                  <td>{ orcamento.total ? orcamento.total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) : '' }
                  </td>
                  <td><Link to={''} />
                  <span onClick={() => { handleEdit(orcamento) } } className="svg-icon menu-icon">
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
                  {getOrcamento.dentista}
                </td>
              </tr>
              <tr>
                <td>
                  Data
                </td>
                <td>
                  {getOrcamento.created_at}
                </td>
              </tr>
              <tr>
                <td>
                  Status
                </td>
                <td>
                  {getOrcamento.aprovado === null ? 'Em aberto' : ''}
                </td>
              </tr>
            </tbody>
          </Table>
          <Table striped bordered hover>
            <thead>
                <tr>
                  <th>Procedimentos</th>
                  <th>Qntd. dentes</th>
                  <th>Detalhes</th>
                  <th>Valor</th>
                </tr>
            </thead>
            <tbody>
             { getOrcamento.procedimento ? 
               getOrcamento.procedimento.map( orcamento => (
                <tr key={orcamento.id}>
                <td>
                  {orcamento.procedimento}
                </td>
                <td>
                  { orcamento.dentes.length === 0 ? 'Geral' : orcamento.dentes.length }
                </td>
                <td>
                  {orcamento.dentes.map(dente => (
                    <span key={dente.id}>{dente.label}<span style={{color: 'red'}}>{dente.faces}</span>,{' '}</span>
                  ))}
                </td>
                <td>
                  {orcamento.valorTotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                </td>
              </tr>
               )) : ''
             }
            </tbody>
          </Table>
  
          <div className="text-right" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span>Total <strong>{getOrcamento.total ? getOrcamento.total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) : ''}</strong></span>            
              <Button onClick={() => {setShowOrcamento(false)}} className="mr-2" variant="danger">
                Fechar
              </Button>
          </div>
        </Modal.Body>
      </Modal>
      <HandleOrcamento />
    </>
  );
}
