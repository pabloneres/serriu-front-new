
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

export function Orcamentos() {
  const {user: {authToken}} = useSelector((state) => state.auth);
  const { params, url } = useRouteMatch()
  const [showForm, setShowForm] = useState(false)
  const [ logout, setLogout ] = useState(false)
  const [orcamentos, setOrcamentos] = useState([])
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
                  <th>Procedimento</th>
                  <th>Dentista</th>
                  <th>Valor</th>
                  <th style={{ "width": 80 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
              {orcamentos.map( orcamento => (
                <tr key={orcamento.id} >
                  <td>{orcamento.procedimento[0].procedimento}</td>
                  <td>{orcamento.dentista}</td>
                  <td>{orcamento.procedimento[0].valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                  </td>
                  <td><Link to={''} />
                  <span onClick={() => { handleEdit(orcamento) } } className="svg-icon menu-icon">
                    <SVG style={{"fill": "#3699FF", "color": "#3699FF"}} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
                  </span>
                  <span onClick={() => handleDelete(orcamento.id) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
                    <SVG style={{"fill": "#3699FF", "color": "#3699FF", "marginLeft": 8}} src={toAbsoluteUrl("/media/svg/icons/Design/delete.svg")} />
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
      <HandleOrcamento />
    </>
  );
}
