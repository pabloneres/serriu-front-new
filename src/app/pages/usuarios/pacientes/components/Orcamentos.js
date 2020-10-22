
import React, { useEffect, useState } from "react";
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import { AdicionarOrcamentoPage } from "~/app/pages/orcamento/AdicionarOrcamentoPage";
import { Link } from 'react-router-dom'
import SVG from 'react-inlinesvg'
import { Table } from "react-bootstrap";
import { store, index, getProcedimentos, orcamento } from '~/app/controllers/orcamentoController';
import { useSelector } from "react-redux";

import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody
} from "~/_metronic/_partials/controls";

import { Modal, Button, Form, Col, InputGroup } from 'react-bootstrap'

export function Orcamentos() {
  const {user: {authToken}} = useSelector((state) => state.auth);
  const { params, url } = useRouteMatch()
  const [showForm, setShowForm] = useState(false)
  const [ logout, setLogout ] = useState(false)
  const [orcamentos, setOrcamentos] = useState([])
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
function handleEdit() {}


  function HandleOrcamento() {
    if (showForm) {
      return <AdicionarOrcamentoPage />
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
                  <td>{orcamento.total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                  </td>
                  <td><Link to={''} />
                  <span onClick={() => { handleEdit(orcamento) } } className="svg-icon menu-icon">
                    <SVG style={{"fill": "#3699FF", "color": "#3699FF"}} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
                  </span>
                  <span onClick={() => handleDelete(orcamento.id) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
                    <SVG style={{"fill": "#3699FF", "color": "#3699FF", "marginLeft": 8}} src={toAbsoluteUrl("/media/svg/icons/Design/delete.svg")} />
                  </span>
                  <span onClick={() => setShowOrcamento(true) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
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
                  Pablo Neres
                </td>
              </tr>
              <tr>
                <td>
                  Data
                </td>
                <td>
                  22/10/2020
                </td>
              </tr>
              <tr>
                <td>
                  Status
                </td>
                <td>
                  Pendente
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
              <tr>
                <td>
                  Restauração
                </td>
                <td>
                  3
                </td>
                <td>
                  22<span style={{color: 'red'}}>VD</span>,{' '}
                  25<span style={{color: 'red'}}>ML</span>,{' '}
                  26<span style={{color: 'red'}}>O</span>
                </td>
                <td>
                  R$ 500,00
                </td>
              </tr>
              <tr>
                <td>
                  Restauração
                </td>
                <td>
                  3
                </td>
                <td>
                  22<span style={{color: 'red'}}>VD</span>,{' '}
                  25<span style={{color: 'red'}}>ML</span>,{' '} 
                  26<span style={{color: 'red'}}>O</span>
                </td>
                <td>
                  R$ 500,00
                </td>
              </tr>
              <tr>
                <td>
                  Restauração
                </td>
                <td>
                  3
                </td>
                <td>
                  22<span style={{color: 'red'}}>VD</span>,{' '}
                  25<span style={{color: 'red'}}>ML</span>,{' '} 
                  26<span style={{color: 'red'}}>O</span>
                </td>
                <td>
                  R$ 500,00
                </td>
              </tr>
              <tr>
                <td>
                  Restauração
                </td>
                <td>
                  3
                </td>
                <td>
                  22<span style={{color: 'red'}}>VD</span>,{' '}
                  25<span style={{color: 'red'}}>ML</span>,{' '} 
                  26<span style={{color: 'red'}}>O</span>
                </td>
                <td>
                  R$ 500,00
                </td>
              </tr>
            </tbody>
          </Table>

          <div className="text-right" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              Total R$ 2.000,00
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
