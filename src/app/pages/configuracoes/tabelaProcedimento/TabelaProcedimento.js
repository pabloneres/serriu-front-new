import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'
import { index, destroy, store, update, indexEspecialidade, indexPrecos, indexAll } from '~/app/controllers/procedimentoController'
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { Modal, Button, Form, Col, InputGroup } from 'react-bootstrap'
import { useFormik } from "formik";
import Select from 'react-select';
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
  const [ name, setName ] = useState('')
  const [ logout, setLogout ] = useState(false)
  const [show, setShow] = useState(false);
  const [reload, setReload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [tableEdit, setTableEdit] = useState([]);
  const history = useHistory();
  const [ tabelas, setTabelas ] = useState([])
  const [ especialidades, setEspecialidades ] = useState([])
  const [ procedimentos, setProcedimentos ] = useState([])
  
  let initialValues = {
    name: '',
    value: '',
    geral: '',
    preco: '',
    especialidade: ''
  }
  
  const tabelaSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    value: Yup.number()
      .required('Campo obrigatorio!'),
    geral: Yup.string()
      .min(1, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    preco: Yup.string()
      .min(2, "Minimum 3 symbols")
      .max(10, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    especialidade: Yup.string()
      .min(1, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!')
    });
  const tabelaSchema2 = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    value: Yup.string()
      .min(2, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    geral: Yup.string()
    .min(1, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required('Campo obrigatorio!'),
    preco: Yup.string()
    .min(1, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required('Campo obrigatorio!'),
    especialidade: Yup.string()
    .min(1, "Minimum 3 symbols")
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

  let initialValues2 = {
    name: tableEdit[1],
    value: tableEdit[2],
    geral: tableEdit[3],
    preco: tableEdit[4],
    especialidade: tableEdit[5]
  }

  const formik2 = useFormik({
    initialValues: initialValues2,
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
    indexPrecos(authToken)
      .then( ({data}) => {
        const serialiazedItems = data.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
        setTabelas(serialiazedItems)
      })
      .catch((err)=>{
        if (err.response.status === 401) {
          setLogout(true)
        }
      })
    indexEspecialidade(authToken)
      .then( ({data}) => {
        const serialiazedItems = data.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
        setEspecialidades(serialiazedItems)
      })
      .catch((err)=>{
        if (err.response.status === 401) {
          setLogout(true)
        }
      })

    indexAll(authToken)
      .then(({data}) => {
        setProcedimentos(data)
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

  function handleEdit({id, name, value, geral}) {
    setTableEdit([id, name, value, geral])
    setShowEdit(true)
  }

  function handleOpen(id) {
    setShowEdit(true)
  }
 

  function handleSelectEspecialidade(e) {
    if (!e) {
      setReload(!reload)
      return
    }
    index(authToken, e.value).then(({data}) => {
      setProcedimentos(data)
      return
    })
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

            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Geral *</Form.Label>
              <Form.Control
                as="select"
                name="geral"
                {...formik.getFieldProps("geral")}
              >
               <option value="" ></option>
               <option value="1" >Sim</option>
               <option value="0" >Não</option>
              </Form.Control>
              {formik.touched.geral && formik.errors.geral ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.geral}</div>
              </div>
              ) : null}
            </Form.Group>
              
          </Form.Row>

          <Form.Row>

            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Tabela de preços *</Form.Label>
              <Form.Control
                as="select"
                name="preco"
                {...formik.getFieldProps("preco")}
              >
               <option value="" ></option>
                
                {
                  tabelas.map(item => (
                    <option value={item.value} >{item.label}</option>
                  ))
                }
                
              </Form.Control>
              {formik.touched.preco && formik.errors.preco ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.preco}</div>
              </div>
              ) : null}
            </Form.Group>   

            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Especialidade *</Form.Label>
              <Form.Control
                as="select"
                name="especialidade"
                {...formik.getFieldProps("especialidade")}
              >
               <option value="" ></option>
                
                {
                  especialidades.map(item => (
                    <option value={item.value} >{item.label}</option>
                  ))
                }
                
              </Form.Control>
              {formik.touched.especialidade && formik.errors.especialidade ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.especialidade}</div>
              </div>
              ) : null}
            </Form.Group>   


          
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Valor *</Form.Label>
              <Form.Control 
                type="number"
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
          <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Geral *</Form.Label>
              <Form.Control
                as="select"
                name="geral"
                {...formik2.getFieldProps("geral")}
              >
               <option value="1" >Sim</option>
               <option value="0" >Não</option>
              </Form.Control>
              {formik2.touched.geral && formik2.errors.geral ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik2.errors.geral}</div>
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
      
      <CardHeader title={`Procedimentos`}>
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
        <Select
          placeholder="Selecione a tabela de preços"
          options={tabelas}
          onChange={(e)=> {handleSelectEspecialidade(e)}}
          isOptionDisabled={especialidades}
          defaultValue={0}
          isClearable={true}
        >
        </Select>
        <Table 
        striped bordered hover
        style={{marginTop: 10}}
        >
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tabela</th>
              <th>Especialidade</th>
              <th>Valor</th>
              <th style={{"width": 80}}>Ações</th>
            </tr>
          </thead>
          <tbody>
          {procedimentos.map( procedimento => (
            <tr key={procedimento.id} >
              <td>{procedimento.name}</td>
              <td>{procedimento.table_name}</td>
              <td>{procedimento.especialidade_name}</td>
              <td>{procedimento.value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
              </td>
              {/* <td>{procedimento.email}</td>
              <td>{'CNPJ'}</td>
              <td>{'TEMPO DE CONSULTA'}</td> */}
              <td><Link to={''} />
              <span onClick={() => { handleEdit(procedimento) } } className="svg-icon menu-icon">
                <SVG style={{"fill": "#3699FF", "color": "#3699FF"}} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
              </span>
              <span onClick={() => handleDelete(procedimento.id) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
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