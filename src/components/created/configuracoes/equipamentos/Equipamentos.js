import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'
import { index, destroy, store } from '~/controllers/machineController'
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { Modal, Button, Form, Col, InputGroup } from 'react-bootstrap'
import { useFormik } from "formik";
import api from '~/services/api'
import * as Yup from "yup";

import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "~/_metronic/_partials/controls";

export function Equipamentos() {
  const { user: { authToken } } = useSelector((state) => state.auth);
  const [machines, setMachines] = useState([])
  const [logout, setLogout] = useState(false)
  const [show, setShow] = useState(false);
  const [changed, setChanged] = useState(false);
  const [showOn, setShowOn] = useState(false);
  const [id_maquina, setIdMaquina] = useState();
  const [showEdit, setShowEdit] = useState(false);
  const [nameEditClinc, setNameEditClinc] = useState('');
  const history = useHistory();

  const tabelaSchema = Yup.object().shape({
    id_machine: Yup.string()
      .min(1, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    name_machine: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!')
  });

  const onSchema = Yup.object().shape({
    id_dentista: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    id_cliente: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!')
  });

  const formik = useFormik({
    initialValues: {
      name_machine: '',
      id_machine: ''
    },
    validationSchema: tabelaSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      store(authToken, values)
        .then(() => setShow(false))
        .catch((err)=> {
          return 
          // retirar a linha debaixo e retornar o erro
          // setSubmitting(false);
        })
    },
  });

  const formik_2 = useFormik({
    initialValues: {
      id_cliente: '',
      id_dentista: ''
    },
    validationSchema: onSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      api.get(`/on?id_cliente=${values.id_cliente}&id_colaborador=${values.id_dentista}&id_maquina=${id_maquina}`)
        .then(() => {
          setShowOn(false)
          setChanged(!changed)
        })
    },
  });


  useEffect(() => {
    index(authToken)
      .then(({ data }) => {
        setMachines(data)
      }).catch((err) => {
        if (err.response.status === 401) {
          setLogout(true)
        }
      })
  }, [show, changed])

  if (logout) {
    return <Redirect to="/logout" />
  }

  function handleDelete(id) {
    console.log(id)
    destroy(authToken, id).then(() => {
      index(authToken)
        .then(({ data }) => {
          setMachines(data)
        }).catch((err) => {
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

  function handleOn(id) {
    setShowOn(true)
    setIdMaquina(id)
    setChanged(!changed)
  }

  async function handleOff(id_maquina, id_dentista, id_cliente) {
    api.get(`/off?id_cliente=${id_cliente}&id_colaborador=${id_dentista}&id_maquina=${id_maquina}`)
    .then(() => {
      setChanged(!changed)
    })
  }

  return (
    <Card>
      <Modal show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>Cadastrar Equipamento</Modal.Header>
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
                <Form.Label>Id do equipamento *</Form.Label>
                <Form.Control
                  type="text"
                  name="id_machine"
                  {...formik.getFieldProps("id_machine")}
                />
                {formik.touched.id_machine && formik.errors.id_machine ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.id_machine}</div>
                  </div>
                ) : null}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Nome do equipamento *</Form.Label>
                <Form.Control
                  type="text"
                  name="name_machine"
                  {...formik.getFieldProps("name_machine")}
                />
                {formik.touched.name_machine && formik.errors.name_machine ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.name_machine}</div>
                  </div>
                ) : null}
              </Form.Group>
            </Form.Row>

            <div className="text-right">
              <Button onClick={() => { setShow(false) }} className="mr-2" variant="danger">
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Salvar
            </Button>
            </div>

          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showOn}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>Iniciar conexão</Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={formik_2.handleSubmit}
          >
            {formik_2.status && (
              <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
                <div className="alert-text font-weight-bold">{formik_2.status}</div>
              </div>
            )}
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Id do dentista *</Form.Label>
                <Form.Control
                  type="text"
                  name="id_dentista"
                  {...formik_2.getFieldProps("id_dentista")}
                />
                {formik_2.touched.id_dentista && formik_2.errors.id_dentista ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik_2.errors.id_dentista}</div>
                  </div>
                ) : null}
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Id do cliente *</Form.Label>
                <Form.Control
                  type="text"
                  name="id_cliente"
                  {...formik_2.getFieldProps("id_cliente")}
                />
                {formik_2.touched.id_cliente && formik_2.errors.id_cliente ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik_2.errors.id_cliente}</div>
                  </div>
                ) : null}
              </Form.Group>
            </Form.Row>

            <div className="text-right">
              <Button onClick={() => { setShowOn(false) }} className="mr-2" variant="danger">
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Salvar
            </Button>
            </div>

          </Form>
        </Modal.Body>
      </Modal>
      <CardHeader title="Equipamentos">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShow(true)}
          >
            Adicionar equipamento
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ "width": 80 }} >Id</th>
              <th style={{ "width": 80 }} >Estado</th>
              <th>Nome</th>
              <th>Dentista</th>
              <th>Paciente</th>
              <th style={{ "width": 80 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {machines.map(machine => (
              <tr key={machines.id} >
                <td>{machine.id_machine}</td>
                <td>{machine.status === 0 ? 'Off' : 'On'}</td>
                <td>{machine.name_machine}</td>
                <td>{machine.id_collaborator}</td>
                <td>{machine.id_patient}</td>
                <td><Link to={''} />
                  {machine.status === 0 ? 
                  <span onClick={() => { handleOn(machine.id_machine) }} style={{ "cursor": "pointer" }} className="svg-icon menu-icon" className="svg-icon menu-icon">
                    <SVG style={{ "fill": "#3699FF", "color": "#3699FF" }} src={toAbsoluteUrl("/media/svg/icons/Navigation/power.svg")} />
                  </span> :
                  <span onClick={() => { handleOff(machine.id_machine, machine.id_collaborator, machine.id_patient ) }} style={{ "cursor": "pointer" }} className="svg-icon menu-icon" className="svg-icon menu-icon">
                    <SVG style={{ "fill": "#3699FF", "color": "#3699FF" }} src={toAbsoluteUrl("/media/svg/icons/Navigation/power_off.svg")} />
                  </span>
                }
                  <span onClick={() => handleDelete(machine.id_machine)} style={{ "cursor": "pointer" }} className="svg-icon menu-icon" className="svg-icon menu-icon">
                    <SVG style={{ "fill": "#3699FF", "color": "#3699FF", "marginLeft": 8 }} src={toAbsoluteUrl("/media/svg/icons/Design/delete.svg")} />
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