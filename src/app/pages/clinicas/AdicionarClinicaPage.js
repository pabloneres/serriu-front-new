import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import { Form, Col, Button } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import axios from 'axios'

import { store } from '~/app/controllers/clinicaController'

const initialValues = {
  name: '',
  name_fantasy: '',
  tel: '',
  address:'',
  uf: '',
  register: '',
  email: '',
  password: ''
}

export function AdicionarClinicaPage(props) {
  const { params, url } = useRouteMatch()
  const { intl } = props;
  const {user: {authToken}} = useSelector((state) => state.auth);
  const history = useHistory();

  const [ufs, setUfs] = useState([])

  const ClinicSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    name_fantasy: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    tel: Yup.string()
      .min(9, "Número de telefone inváldo")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    address: Yup.string()
      .min(4, "Endereço invalido")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    uf: Yup.string()
      .min(2, "Selecione um estado")
      .max(2, "Maximum 2 symbols")
      .required('Campo obrigatorio!'),
    register: Yup.string()
      .min(10, "CPF/CNPJ Inválidos")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    email: Yup.string()
      .email('Email inválido')
      .required('Campo obrigatorio!'),
    password: Yup.string()
      .min(8, "Senha fraca")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!')
  });

  const formik = useFormik({
    initialValues,
    validationSchema: ClinicSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      store(authToken, values)
        .then(() => history.push("/clinicas"))
        .catch((err)=> {
          return 
          // retirar a linha debaixo e retornar o erro
          // setSubmitting(false);
        })
    },
  });

  useEffect(()=> {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(({data})=>{
      setUfs(data)
    }).catch(()=>{
      return
    })
  },[])

  return (
    <Card>
      <CardHeader title="Adicionar nova cliníca"></CardHeader>
      <CardBody>
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
                placeholder="Digite seu nome"
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

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Razão social *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a Razão social da sua empresa"
                name="name_fantasy"
                {...formik.getFieldProps("name_fantasy")}
              />
              {formik.touched.name_fantasy && formik.errors.name_fantasy ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.name_fantasy}</div>
              </div>
              ) : null}
            </Form.Group>
          </Form.Row>

          <Form.Row >

          <Form.Group  as={Col} controlId="formGridAddress2">
            <Form.Label>Telefone *</Form.Label>
            <Form.Control
             placeholder="Digite o telefone da clínica"
             name="tel"
             {...formik.getFieldProps("tel")}
             />
              {formik.touched.tel && formik.errors.tel ? (
                <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.tel}</div>
              </div>
              ) : null}
          </Form.Group>

          <Form.Group as={Col}>
              <Form.Label>CPF/CPNJ  *</Form.Label>
              <Form.Control
              placeholder="Digite o CPF ou register"
              type="text"
              name="register"
              {...formik.getFieldProps("register")}
              />
              {formik.touched.register && formik.errors.register ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.register}</div>
              </div>
              ) : null}
            </Form.Group>
          
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>Endereço  *</Form.Label>
              <Form.Control
                placeholder="Digite o endereço da clínica"
                 name="address"
                 {...formik.getFieldProps("address")}
              />
              {formik.touched.address && formik.errors.address ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.address}</div>
              </div>
              ) : null}
            </Form.Group>

            <Form.Group controlId="formGridAddress1">
              <Form.Label>UF *</Form.Label>
              <Form.Control
                as="select"
                name="uf"
                {...formik.getFieldProps("uf")}
              >
                <option value="" ></option>
                {
                  ufs.map((uf) => {
                  return (
                  <option value={uf.sigla} >{uf.sigla}</option>
                  )
                  })
                }
              </Form.Control>
              {formik.touched.uf && formik.errors.uf ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.uf}</div>
                </div>
              ) : null}
            </Form.Group>
          </Form.Row>

          <div className="separator separator-solid mt-4 mb-4"></div>
          <h4 className="mb-4">Dados do usúario</h4>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                placeholder="Digite um email"
                type="email"
                name="email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.email}</div>
                </div>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Senha *</Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite uma senha"
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
            <Link to="/clinicas">
              <Button className="mr-2" variant="danger">
                Cancelar
              </Button>
            </Link>
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}
