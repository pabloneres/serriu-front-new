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
import { store, index, destroy  } from '~/app/controllers/clinicaController'

import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "~/_metronic/_partials/controls";
import { id } from "date-fns/locale";

export function ClinicasPage() {
  const {user: {authToken}} = useSelector((state) => state.auth);
  const [ clinics, setClinics ] = useState([])
  const [ logout, setLogout ] = useState(false)
  const [ redirect, setRedirect ] = useState(false)
  const [show, setShow] = useState(false);
  const [id, setId] = useState();
  const [nameEditClinc, setNameEditClinc] = useState('');
  const history = useHistory();


  const initialValues = {
    username: '',
    email: '',
    password: ''
  }

  const tabelaSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    email: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!')
  });

  const formik = useFormik({
    initialValues,
    validationSchema: tabelaSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      store(authToken, values)
        .then(({data: {id}}) => {
          setId(id)
          setShow(false)
          setRedirect(true)
        })
        .catch((err)=> {
          return 
          // retirar a linha debaixo e retornar o erro
          // setSubmitting(false);
        })
    },
  });

  useEffect(() => {
      index(authToken)
      .then( ({data}) => {
        setClinics(data)
      }).catch((err)=>{
        if (err.response.status === 401) {
          setLogout(true)
        }
      })
  }, [show])
  
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
  
  if (logout) {
    return <Redirect to="/logout" />
  }
 
  if (redirect) {
    return <Redirect to={`/clinicas/${id}`} />
  }

  return (
    <Card>
      <Modal show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>Cadastrar tabela</Modal.Header>
        <Modal.Body>
        <Form
          onSubmit={formik.handleSubmit}
        >
        {formik.status && (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        )}
          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Nome *</Form.Label>
              <Form.Control 
                type="text"
                name="username"
                {...formik.getFieldProps("username")}
                />
              {formik.touched.username && formik.errors.username ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.username}</div>
              </div>
              ) : null}
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email *</Form.Label>
              <Form.Control 
                type="text"
                name="email"
                {...formik.getFieldProps("email")}
                />
              {formik.touched.email && formik.errors.email ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.email}</div>
              </div>
              ) : null}
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Senha *</Form.Label>
              <Form.Control 
                type="password"
                name="password"
                {...formik.getFieldProps("password")}
                />
              {formik.touched.password && formik.errors.password ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.password}</div>
              </div>
              ) : null}
            </Form.Group>
          </Form.Row>
          <div className="text-right">
              <Button onClick={() => {setShow(false)}} className="mr-2" variant="danger">
                Cancelar
              </Button>
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </div>

        </Form>
        </Modal.Body>
      </Modal>
      <CardHeader title="Clinicas">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShow(true)}
          >
            Adicionar tabela
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th style={{"width": 80}}>Ações</th>
            </tr>
          </thead>
          <tbody>
          {clinics.map( clinic => (
            <tr key={clinic.id} >
              <td>{clinic.username}</td>
              <td>{clinic.email}</td>
              <td><Link to={''} />
              <span onClick={() => {} } className="svg-icon menu-icon">
                <SVG style={{"fill": "#3699FF", "color": "#3699FF"}} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
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