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
import { store, index, destroy } from '~/app/controllers/recepcionistController'

import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "~/_metronic/_partials/controls";
import { id } from "date-fns/locale";

export function RecepcionistaPage() {
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
        console.log(data)
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
    return <Redirect to={`/recepcionista/editar/${id}`} />
  }

  return (
    <Card>
      <CardHeader title="Dentistas">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => history.push('/recepcionista/adicionar')}
          >
            Adicionar dentista
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Nascimento</th>
              <th>Telefone</th>
              <th>Genêro</th>
              <th style={{"width": 80}}>Ações</th>
            </tr>
          </thead>
          <tbody>
          {users.map( recepcionist => (
            <tr key={recepcionist.id} >
              <td>{recepcionist.name}</td>
              <td>{recepcionist.email}</td>
              <td>{recepcionist.cpf}</td>
              <td>{recepcionist.nasc}</td>
              <td>{recepcionist.tel}</td>
              <td>{recepcionist.gender}</td>
              <td><Link to={''} />
              <span onClick={() => history.push(`/recepcionista/editar/${recepcionist.id}`) } className="svg-icon menu-icon">
                <SVG style={{"fill": "#3699FF", "color": "#3699FF", "cursor": "pointer"}} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
              </span>
              <span onClick={() => handleDelete(recepcionist.id) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
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