import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'
import { index, destroy } from '~/app/controllers/pacienteController'
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { InputGroup, FormControl, Button } from 'react-bootstrap'

import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "~/_metronic/_partials/controls";

export function PacientePage() {
  const {user: {authToken}} = useSelector((state) => state.auth);
  const [ patients, setPatients ] = useState([])
  const [ logout, setLogout ] = useState(false)
  const history = useHistory();

  useEffect(() => {
      index(authToken)
      .then( ({data}) => {
        setPatients(data)
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
        setPatients(data)
      }).catch((err)=>{
        if (err.response.status === 401) {
          setLogout(true)
        }
      })
    })
  }

  return (
    <Card>
      <CardHeader title="Pacientes">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => history.push("/paciente/adicionar")}
          >
            Adicionar paciente
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar paciente"
          aria-label="Buscar paciente"
          aria-describedby="basic-addon2"
        />  
        <InputGroup.Append>
          <Button variant="outline-secondary">Buscar</Button>
        </InputGroup.Append>
      </InputGroup>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Codigo</th>
              <th>E-mail</th>
              <th>Celular</th>
              <th>Sexo</th>
              <th style={{"width": 80}}>Ações</th>
            </tr>
          </thead>
          <tbody>
          {patients.map( patient => (
            <tr key={patient.id} >
              <td><Link to={`/paciente/editar/${patient.id}`}>{patient.name}</Link></td>
              <td>{patient.cpf}</td>
              <td>{patient.id_acesso}</td>
              <td>{patient.email}</td>
              <td>{patient.tel}</td>
              <td>{patient.gender}</td>
              <td><Link to={''} />
              <span onClick={() => history.push(`/paciente/editar/${patient.id}`) } className="svg-icon menu-icon">
                  <SVG style={{"fill": "#3699FF", "color": "#3699FF"}} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
              </span>
              <span onClick={() => handleDelete(patient.id) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
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