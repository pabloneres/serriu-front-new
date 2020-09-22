import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'
import { index, destroy } from '~/app/controllers/tabelaController'
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { Modal, Button, Form, Col, InputGroup } from 'react-bootstrap'
import { useFormik } from "formik";
import * as Yup from "yup";
import { store } from '~/app/controllers/pacienteController'

import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "~/_metronic/_partials/controls";

export function TabelaPreco() {
  const {user: {authToken}} = useSelector((state) => state.auth);
  const [ clinics, setClinics ] = useState([])
  const [ logout, setLogout ] = useState(false)
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [nameEditClinc, setNameEditClinc] = useState('');
  const history = useHistory();

  const tabelaSchema = Yup.object().shape({
    nome_tabela: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!')
    // especialidade: Yup.string()
    //   .min(3, "Minimum 3 symbols")
    //   .max(50, "Maximum 50 symbols")
    //   .required('Campo obrigatorio!'),
    // valor: Yup.string()
    //   .min(3, "Minimum 3 symbols")
    //   .max(50, "Maximum 50 symbols")
  });

  const formik = useFormik({
    initialValues: {
      nome_tabela: nameEditClinc
    },
    validationSchema: tabelaSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      console.log(values)
      // store(authToken, values)
      //   .then(() => setShow(false))
      //   .catch((err)=> {
      //     return 
      //     // retirar a linha debaixo e retornar o erro
      //     // setSubmitting(false);
      //   })
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

  function handleEdit(name) {
    setNameEditClinc(name)
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
                name="nome_tabela"
                {...formik.getFieldProps("nome_tabela")}
                />
              {formik.touched.nome_tabela && formik.errors.nome_tabela ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.nome_tabela}</div>
              </div>
              ) : null}
            </Form.Group>
          </Form.Row>

          {/* <Form.Row>
            <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Label>Especialidade *</Form.Label>
                <Form.Control
                as="select" defaultValue="option"
                  name="especialidade"
                  {...formik.getFieldProps("especialidade")}
                >
                  <option value="option">Opção</option>
                  <option value="option2">Opção 2</option>
                </Form.Control>
                {formik.touched.especialidade && formik.errors.especialidade ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.especialidade}</div>
                  </div>
                ) : null}
              </Form.Group>
          </Form.Row> */}


          {/* <Form.Row>
          <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Valor *</Form.Label>
              <Form.Control
                type="text"
                name="valor"
                {...formik.getFieldProps("valor")}
                />
              {formik.touched.valor && formik.errors.valor ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.valor}</div>
              </div>
              ) : null}
            </Form.Group>
          </Form.Row> */}
          
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
                name="nome_tabela"
                value={nameEditClinc}
                />
              {formik.touched.nome_tabela && formik.errors.nome_tabela ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.nome_tabela}</div>
              </div>
              ) : null}
            </Form.Group>
          </Form.Row>

          {/* <Form.Row>
            <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Label>Especialidade *</Form.Label>
                <Form.Control
                as="select" defaultValue="option"
                  name="especialidade"
                  {...formik.getFieldProps("especialidade")}
                >
                  <option value="option">Opção</option>
                  <option value="option2">Opção 2</option>
                </Form.Control>
                {formik.touched.especialidade && formik.errors.especialidade ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.especialidade}</div>
                  </div>
                ) : null}
              </Form.Group>
          </Form.Row> */}


          {/* <Form.Row>
          <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Valor *</Form.Label>
              <Form.Control
                type="text"
                name="valor"
                {...formik.getFieldProps("valor")}
                />
              {formik.touched.valor && formik.errors.valor ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.valor}</div>
              </div>
              ) : null}
            </Form.Group>
          </Form.Row> */}
          
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
              <th style={{"width": 80}}>Ações</th>
            </tr>
          </thead>
          <tbody>
          {clinics.map( clinic => (
            <tr key={clinic.id} >
              <td><Link to={`tabela-precos/${clinic.id}`} >{clinic.name}</Link></td>
              {/* <td>{clinic.email}</td>
              <td>{'CNPJ'}</td>
              <td>{'TEMPO DE CONSULTA'}</td> */}
              <td><Link to={''} />
              <span onClick={() => { handleEdit(clinic.name) } } className="svg-icon menu-icon">
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