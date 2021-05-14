import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'
import { index, destroy, store, update } from '~/app/controllers/tabelaController'
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { Modal, Button, Form, Col, InputGroup } from 'react-bootstrap'
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "~/_metronic/_partials/controls";


export function TabelaPreco() {
  const {user: {authToken}} = useSelector((state) => state.auth);
  const [ tabelas, setTabelas ] = useState([])
  const [ logout, setLogout ] = useState(false)
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [tableEdit, setTableEdit] = useState([]);
  const history = useHistory();
  
  let initialValues = {
    name: ''
  }
  
  const tabelaSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!')
    });
  const tabelaSchema2 = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!')
    });
    
  const formik = useFormik({
    initialValues,
    validationSchema: tabelaSchema,
    onSubmit: (values, { setStatus, setSubmitting, resetForm }) => {
      store(authToken, values)
        .then(() => {
          resetForm()
          setShow(false)
        })
        .catch((err)=> {
          return 
          // retirar a linha debaixo e retornar o erro
          // setSubmitting(false);
        })
    },
  });

  const formik2 = useFormik({
    initialValues: {
      name: tableEdit[1]
    },
    enableReinitialize: true,
    validationSchema: tabelaSchema2,
    onSubmit: (values, { setStatus, setSubmitting, resetForm }) => {
      update(authToken, tableEdit[0],  values)
        .then(() => {
          resetForm()
          setShowEdit(false)
          index(authToken)
          .then( ({data}) => {
            setTabelas(data)
          })
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
        setTabelas(data)
      }).catch((err)=>{
        if (err.response.status === 401) {
          setLogout(true)
        }
      })
  }, [show])

  if (logout) {
    return <Redirect to="/logout" />
  }

  function handleDelete(id) {
    destroy(authToken, id).then(()=>{
       index(authToken)
      .then( ({data}) => {
        setTabelas(data)
      }).catch((err)=>{
        if (err.response.status === 401) {
          setLogout(true)
        }
      })
    })
  }

  function handleEdit(id, name) {
    setTableEdit([id, name])
    console.log(name)
    setShowEdit(true)
  }

  function handleOpen(id) {
    setShowEdit(true)
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
              <Form.Label>Nome da tabela *</Form.Label>
              <Form.Control 
                type="text"
                name="name"
                {...formik.getFieldProps("name")}
                />
              {formik.touched.name && formik.errors.name ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.name}</div>
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
      <Modal show={showEdit}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>Cadastrar tabela</Modal.Header>
        <Modal.Body>
        <Form
          onSubmit={formik2.handleSubmit}
        >
        {formik2.status && (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik2.status}</div>
          </div>
        )}
          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Nome da tabela *</Form.Label>
              <Form.Control 
                type="text"
                name="name"
                {...formik2.getFieldProps("name")}
                />
              {formik2.touched.name && formik2.errors.name ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik2.errors.name}</div>
              </div>
              ) : null}
            </Form.Group>
          </Form.Row>
          <div className="text-right">
              <Button onClick={() => {setShowEdit(false)}} className="mr-2" variant="danger">
                Cancelar
              </Button>
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </div>

        </Form>
        </Modal.Body>
      </Modal>
      

      <CardHeader title="Tabelas de preço">
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
              {/* <th>E-mail</th>
              <th>CPF/CNPJ</th>
              <th>Tempo consulta</th> */}
              <th style={{"width": 100}}>Ações</th>
            </tr>
          </thead>
          <tbody>
          {tabelas.map( tabela => (
            <tr key={tabela.id} >
              <td><Link to={`/tabela-precos/${tabela.id}/procedimentos`} >{tabela.name}</Link></td>
              {/* <td>{tabela.email}</td>
              <td>{'CNPJ'}</td>
              <td>{'TEMPO DE CONSULTA'}</td> */}
              <td><Link to={''} />
              <span onClick={() => { handleEdit(tabela.id, tabela.name) } } className="svg-icon menu-icon">
                <SVG style={{"fill": "#3699FF", "color": "#3699FF"}} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
              </span>
              <span onClick={() => handleDelete(tabela.id) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
                <SVG style={{"fill": "#3699FF", "color": "#3699FF", "marginLeft": 8}} src={toAbsoluteUrl("/media/svg/icons/Design/delete.svg")} />
              </span>
              {/* <span onClick={() => history.push(`/tabela-precos/${tabela.id}/especialidades`) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
                <SVG style={{"fill": "#3699FF", "color": "#3699FF", "marginLeft": 8}} src={toAbsoluteUrl("/media/svg/icons/Design/view.svg")} />
              </span> */}
              </td>
            </tr>
          ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}