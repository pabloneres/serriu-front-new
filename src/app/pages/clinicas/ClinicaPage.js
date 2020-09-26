import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { Modal, Button, Form, Col, InputGroup } from 'react-bootstrap'
import { useFormik } from "formik";
import * as Yup from "yup";
import { store, index, destroy } from '~/app/controllers/clinicaController'

import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "~/_metronic/_partials/controls";
import { id } from "date-fns/locale";
import { useRadioGroup } from "@material-ui/core";

export function ClinicasPage() {
  const {user: {authToken}} = useSelector((state) => state.auth);
  const [ users, setUsers ] = useState([])
  const [ logout, setLogout ] = useState(false)
  const [ redirect, setRedirect ] = useState(false)
  const [show, setShow] = useState(false);
  const [id, setId] = useState();
  const [deleted, setDeleted] = useState(false);
  const history = useHistory();

  useEffect(() => {
      index(authToken)
      .then( ({data}) => {
        setUsers(data)
      }).catch((err)=>{
        if (err.response.status === 401) {
          setLogout(true)
        }
      })
  }, [show, deleted])
  
  function handleDelete(id) {
    destroy(authToken, id).then(()=>{
       index(authToken)
       .then( () => setDeleted(!deleted))
       .catch((err)=>{
        if (err.response.status === 401) {
          setLogout(true)
        }
      })
    })
  }
  
  if (logout) {
    return <Redirect to="/logout" />
  }
 
  if (redirect) {
    return <Redirect to={`/clinicas/editar/${id}`} />
  }

  return (
    <Card>
      <CardHeader title="Clinicas">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => history.push("/clinicas/adicionar")}
          >
            Adicionar clínica
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Razão Social</th>
              <th>E-mail</th>
              <th>CPF/CNPJ</th>
              <th>Telefone</th>
              <th>UF</th>
              <th style={{"width": 80}}>Ações</th>
            </tr>
          </thead>
          <tbody>
          {users.map( user => (
            <tr key={user.id} >
              <td>{user.clinics[0].name}</td>
              <td>{user.clinics[0].name_fantasy}</td>
              <td>{user.email}</td>
              <td>{user.clinics[0].register}</td>
              <td>{user.clinics[0].tel}</td>
              <td>{user.clinics[0].uf}</td>
              <td><Link to={''} />
              <span onClick={() => history.push(`/clinicas/editar/${user.clinics[0].id}`) } className="svg-icon menu-icon">
                <SVG style={{"fill": "#3699FF", "color": "#3699FF", "cursor": "pointer"}} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
              </span>
              <span onClick={() => handleDelete(user.id) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
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