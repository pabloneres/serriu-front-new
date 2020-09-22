import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'
import { index, destroy } from '~/app/controllers/pacienteController'
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";

import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "~/_metronic/_partials/controls";

export function RecepcionistaPage() {
  const {user: {authToken}} = useSelector((state) => state.auth);
  const [ clinics, setClinics ] = useState([])
  const [ logout, setLogout ] = useState(false)
  const history = useHistory();

  useEffect(() => {
      index(authToken)
      .then( ({data}) => {
        setClinics(data)
      }).catch((err)=>{
        if (err.response.status === 401) {
          setLogout(true)
        }
      })
  }, [])

  if (logout) {
    return <Redirect to="/logout" />
  }

  function handleDelete(id) {
    destroy(authToken, id).then(()=>{
       index(authToken)
      .then( ({data}) => {
        setClinics(data)
      }).catch((err)=>{
        if (err.response.status === 401) {
          setLogout(true)
        }
      })
    })
  }

  return (
    <Card>
      <CardHeader title="Recepcionista">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => history.push("/recepcionista/adicionar")}
          >
            Adicionar recepcionista
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>CPF/CNPJ</th>
              <th>Tempo consulta</th>
              <th style={{"width": 80}}>Ações</th>
            </tr>
          </thead>
          <tbody>
          {clinics.map( clinic => (
            <tr key={clinic.id} >
              <td>{clinic.name}</td>
              <td>{clinic.email}</td>
              <td>{'CNPJ'}</td>
              <td>{'TEMPO DE CONSULTA'}</td>
              <td><Link to={''} />
              <span className="svg-icon menu-icon">
                <Link to="/clinicas/editar">
                  <SVG style={{"fill": "#3699FF", "color": "#3699FF"}} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
                </Link>
              </span>
              <span onClick={() => handleDelete(clinic.id) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
                <SVG style={{"fill": "#3699FF", "color": "#3699FF", "marginLeft": 8}} src={toAbsoluteUrl("/media/svg/icons/Design/delete.svg")} />
              </span>
              </td>
            </tr>
          ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}