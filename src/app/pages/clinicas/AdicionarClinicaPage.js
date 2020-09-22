import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import { Form, Col, Button } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { mask, unMask } from 'remask'

import { store } from '~/app/controllers/clinicaController'

const initialValues = {
  name: '',
  company: '',
  email:'',
  tel: '',
  address:'',
  cnpj: '',
  user: '',
  password: '',
  password_confirmation: ''
}

export function AdicionarClinicaPage(props) {
  const { intl } = props;
  const {user: {authToken}} = useSelector((state) => state.auth);
  const history = useHistory();
  const [maskCpf, setMaskCpf] = useState()

  const ClinicSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    company: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    tel: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    address: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    cnpj: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    user: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    password_confirmation: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: ClinicSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      store(authToken, {name: values.name, email: values.email, password: values.password})
        .then(() => history.push("/clinicas"))
        .catch((err)=> {
          return 
          // retirar a linha debaixo e retornar o erro
          // setSubmitting(false);
        })
    },
  });

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
                name="company"
                {...formik.getFieldProps("company")}
              />
              {formik.touched.name && formik.errors.company ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.company}</div>
              </div>
              ) : null}
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formGridAddress1">
            <Form.Label>Email *</Form.Label>
            <Form.Control 
              placeholder="Digite seu email"
              name="email"
              {...formik.getFieldProps("email")}
              />
              {formik.touched.name && formik.errors.email ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.email}</div>
              </div>
              ) : null}
          </Form.Group>

          <Form.Group controlId="formGridAddress2">
            <Form.Label>Telefone *</Form.Label>
            <Form.Control
             placeholder="Digite o telefone da clínica"
             name="tel"
              {...formik.getFieldProps("tel")}
             />
              {formik.touched.name && formik.errors.tel ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.tel}</div>
              </div>
              ) : null}
          </Form.Group>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>Endereço  *</Form.Label>
              <Form.Control
                placeholder="Digite o endereço da clínica"
                 name="address"
                 {...formik.getFieldProps("address")}
              />
              {formik.touched.name && formik.errors.address ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.address}</div>
              </div>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>CPF/CPNJ  *</Form.Label>
              <Form.Control
              placeholder="Digite o CPF ou CNPJ"
              type="text"
              name="cnpj"
              {...formik.getFieldProps("cnpj")}
              />
              {formik.touched.name && formik.errors.cnpj ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.cnpj}</div>
              </div>
              ) : null}
            </Form.Group>
          </Form.Row>

          <div className="separator separator-solid mt-4 mb-4"></div>
          <h4 className="mb-4">Login</h4>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Usuário *</Form.Label>
              <Form.Control
                placeholder="Digite um nome de usuário"
                type="text"
                name="user"
                {...formik.getFieldProps("user")}
              />
              {formik.touched.name && formik.errors.user ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.user}</div>
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
              {formik.touched.name && formik.errors.password ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.password}</div>
              </div>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Repita a senha *</Form.Label>
              <Form.Control 
                type="password"
                placeholder="Repita a senha"
                name="password_confirmation"
                {...formik.getFieldProps("password_confirmation")}
                />
              {formik.touched.name && formik.errors.password ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.password}</div>
              </div>
              ) : null}
            </Form.Group>
          </Form.Row>

          <div className="text-right">
            <Link to="/dashboard">
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
