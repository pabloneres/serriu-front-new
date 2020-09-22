import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "../../../../_metronic/_partials/controls";
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import { Form, Col, Button } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { store } from '~/app/services/pacienteCrud'


const initialValues = {
  name: '',
  cpf: '',
  nascimento: '',
  email: '',
  genero: '',
  celular: '',
  estado_civil: '',
  escolaridade: ''
}

export function AdicionarPacientePage(props) {
  const { intl } = props;
  const { user: { authToken } } = useSelector((state) => state.auth);
  const history = useHistory();
  const [ufs, setUfs] = useState([])


  const ClinicSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    cpf: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    rg: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    nascimento: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    genero: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    celular: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    estado_civil: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    escolaridade: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: ClinicSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      console.log(values)
      store(authToken, {name: values.name, email: values.email, password: values.password})
        .then(() => history.push("/paciente"))
        .catch((err)=> {
          return 
          // retirar a linha debaixo e retornar o erro
          // setSubmitting(false);
        })
    },
  });

  return (
    <Card>
      <CardHeader title="Adicionar novo paciente"></CardHeader>
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

            <Col xs={7}>
              <Form.Group controlId="formGridEmail">
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
            </Col>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>CPF *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu CPF"
                name="cpf"
                {...formik.getFieldProps("cpf")}
              />
              {formik.touched.cpf && formik.errors.cpf ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.cpf}</div>
                </div>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>RG *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu RG"
                name="rg"
                {...formik.getFieldProps("rg")}
              />
              {formik.touched.rg && formik.errors.rg ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.rg}</div>
                </div>
              ) : null}
            </Form.Group>
          </Form.Row>

          <Form.Row>

          <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Data de Nascimento *</Form.Label>
              <Form.Control
                type="date"
                name="nascimento"
                {...formik.getFieldProps("nascimento")}
              />
              {formik.touched.nascimento && formik.errors.nascimento ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.nascimento}</div>
                </div>
              ) : null}
            </Form.Group>

            <Col xs={6}>
            <Form.Group controlId="formGridAddress1">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                placeholder="Digite seu email"
                name="email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.email}</div>
                </div>
              ) : null}
            </Form.Group>
            </Col>

            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Genêro *</Form.Label>
              <Form.Control
                as="select" defaultValue="Masculino"
                name="genero"
                {...formik.getFieldProps("genero")}
              >
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </Form.Control>
              {formik.touched.genero && formik.errors.genero ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.genero}</div>
                </div>
              ) : null}
            </Form.Group>

          </Form.Row>

          <Form.Row>

          <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Celular *</Form.Label>
              <Form.Control
                placeholder="Digite seu celular"
                name="celular"
                {...formik.getFieldProps("celular")}
              />
              {formik.touched.celular && formik.errors.celular ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.celular}</div>
                </div>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Estado Civil *</Form.Label>
              <Form.Control
              as="select" defaultValue="solteiro"
                name="email"
                {...formik.getFieldProps("estado_civil")}
              >
                <option value="solteiro">Solteiro(a)</option>
                <option value="solteiro">Casado(a)</option>
              </Form.Control>
              {formik.touched.estado_civil && formik.errors.estado_civil ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.estado_civil}</div>
                </div>
              ) : null}
            </Form.Group>


            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Escolaridade *</Form.Label>
              <Form.Control
              as="select" defaultValue="solteiro"
                name="escolaridade"
                {...formik.getFieldProps("escolaridade")}
              >
                <option value="casado">Analfabeto</option>
                <option value="funtamental_incompleto">Fundamental - Incompleto</option>
                <option value="funtamental_completo">Fundamental - Completo</option>
                <option value="ensino_medio_incompleto">Ensino Médio - Incompleto</option>
                <option value="ensino_medio_completo">Ensino Médio - Completo</option>
                <option value="superior_incompleto">Nível Superior - Incompleto</option>
                <option value="superior_completo">Nível Superior - Completo</option>
                <option value="pos_incompleto">Pós Graduação - Incompleto</option>
                <option value="pos_completo">Pós Graduação - Completo</option>
                <option value="mestrado_completo">Mestrado - Incompleto</option>
                <option value="mestrado_completo">Mestrado - Completo</option>
                <option value="doutorado_incompleto">Doutorado - Incompleto</option>
                <option value="doutorado_completo">Doutorado - Completo</option>

              </Form.Control>
              {formik.touched.escolaridade && formik.errors.escolaridade ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.escolaridade}</div>
                </div>
              ) : null}
            </Form.Group>

            
            
          </Form.Row>

          <div className="text-right">
            <Link to="/paciente">
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
