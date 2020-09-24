import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import { Form, Col, Button } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { mask, unMask } from 'remask'

import { register } from '~/app/controllers/clinicaController'

const initialValues = {
  name: '',
  name_fantasy: '',
  tel: '',
  address:'',
  register: ''
}

export function AdicionarClinicaPage(props) {
  const { params, url } = useRouteMatch()
  const { intl } = props;
  const {user: {authToken}} = useSelector((state) => state.auth);
  const history = useHistory();
  const [maskCpf, setMaskCpf] = useState()

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
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    address: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    register: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!')
  });

  const formik = useFormik({
    initialValues,
    validationSchema: ClinicSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      register(authToken, {...values, user_id: params.id})
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
                name="name_fantasy"
                {...formik.getFieldProps("name_fantasy")}
              />
              {formik.touched.name && formik.errors.name_fantasy ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.name_fantasy}</div>
              </div>
              ) : null}
            </Form.Group>
          </Form.Row>

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
              placeholder="Digite o CPF ou register"
              type="text"
              name="register"
              {...formik.getFieldProps("register")}
              />
              {formik.touched.name && formik.errors.register ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.register}</div>
              </div>
              ) : null}
            </Form.Group>
          </Form.Row>

          <div className="separator separator-solid mt-4 mb-4"></div>

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
