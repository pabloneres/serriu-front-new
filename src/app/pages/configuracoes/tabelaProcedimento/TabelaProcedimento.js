import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'
import { index, destroy, store, update } from '~/app/controllers/procedimentoController'
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


export function TabelaProcedimento() {
  const { params, url } = useRouteMatch()
  const {user: {authToken}} = useSelector((state) => state.auth);
  const [ tabelas, setTabelas ] = useState([])
  const [ name, setName ] = useState('')
  const [ logout, setLogout ] = useState(false)
  const [show, setShow] = useState(false);
  const [reload, setReload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [tableEdit, setTableEdit] = useState([]);
  const history = useHistory();
  
  let initialValues = {
    name: '',
    value: ''
  }
  
  const tabelaSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    value: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!')
    });
  const tabelaSchema2 = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    value: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!')
    });
    
  const formik = useFormik({
    initialValues,
    validationSchema: tabelaSchema,
    onSubmit: (values, { setStatus, setSubmitting, resetForm }) => {
      store(authToken, {...values, especialidade_id: params.id})
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
      name: tableEdit[1],
      value: tableEdit[2]
    },
    enableReinitialize: true,
    validationSchema: tabelaSchema2,
    onSubmit: (values, { setStatus, setSubmitting, resetForm }) => {
      update(authToken, tableEdit[0], values)
        .then(() => {
          resetForm()
          setShowEdit(false)
          setReload(!reload)
        })
        .catch((err)=> {
          return 
          // retirar a linha debaixo e retornar o erro
          // setSubmitting(false);
        })
    },
  });

  useEffect(() => {
      index(authToken, params.id)
      .then( ({data}) => {
        setTabelas(data[0])
        setName(data[1].name)
      }).catch((err)=>{
        if (err.response.status === 401) {
          setLogout(true)
        }
      })
  }, [show, reload])

  if (logout) {
    return <Redirect to="/logout" />
  }

  function handleDelete(id) {
    destroy(authToken, id).then(()=>{
      setReload(!reload)
    })
  }

  function handleEdit({id, name, value}) {
    setTableEdit([id, name, value])
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
        <Modal.Header>Cadastrar procedimento</Modal.Header>
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
              <Form.Label>Nome do procedimento *</Form.Label>
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
          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Valor *</Form.Label>
              <Form.Control 
                type="text"
                name="value"
                {...formik.getFieldProps("value")}
                />
              {formik.touched.name && formik.errors.value ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.value}</div>
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
        <Modal.Header>Editar procedimento</Modal.Header>
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
              <Form.Label>Nome do procedimento *</Form.Label>
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
          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Valor *</Form.Label>
              <Form.Control 
                type="text"
                name="value"
                {...formik2.getFieldProps("value")}
                />
              {formik2.touched.value && formik2.errors.value ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik2.errors.value}</div>
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
      

      <CardHeader title={`Procedimentos - ${name}`}>
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShow(true)}
          >
            Adicionar procedimento
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th style={{"width": 80}}>Ações</th>
            </tr>
          </thead>
          <tbody>
          {tabelas.map( tabela => (
            <tr key={tabela.id} >
              <td>{tabela.name}</td>
              <td>{tabela.value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
              </td>
              {/* <td>{tabela.email}</td>
              <td>{'CNPJ'}</td>
              <td>{'TEMPO DE CONSULTA'}</td> */}
              <td><Link to={''} />
              <span onClick={() => { handleEdit(tabela) } } className="svg-icon menu-icon">
                <SVG style={{"fill": "#3699FF", "color": "#3699FF"}} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
              </span>
              <span onClick={() => handleDelete(tabela.id) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
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