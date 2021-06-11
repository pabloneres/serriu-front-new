import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import { Form, Col, Button } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import axios from 'axios'
import { store } from '../../../services/dentistaCrud'


const initialValues = {
  name: '',
  cpf: '',
  nascimento: '',
  email: '',
  celular: '',
  estado_civil: '',
  uf: '',
  cro: '',
  visualizar: '',
  cor: '',
  user: '',
  password: '',
  password_confirmation: ''
}

export function AdicionarDentistaPage(props) {
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
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    celular: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    nascimento: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    genero: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    estado_civil: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    uf: Yup.string()
      .min(2, "Minimum 2 symbols")
      .max(2, "Maximum 2 symbols")
      .required('Campo obrigatorio!'),
    cro: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    visualizar: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    cor: Yup.string()
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
      console.log(values)
      store(authToken, {name: values.name, email: values.email, password: values.password})
        .then(() => history.push("/dentista"))
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
      <CardHeader title="Adicionar novo dentista"></CardHeader>
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
                <option value="solteiro">Solteiro</option>
                <option value="solteiro">Casado</option>
              </Form.Control>
              {formik.touched.estado_civil && formik.errors.estado_civil ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.estado_civil}</div>
                </div>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>CRO *</Form.Label>
              <Form.Control
                as="select" defaultValue="SP"
                name="uf"
                {...formik.getFieldProps("uf")}
              >
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

          <Form.Row>
          <Col xs={6}>

            <Form.Group controlId="formGridAddress1">
              <Form.Label>CRO Número *</Form.Label>
              <Form.Control
                placeholder="Digite seu CRO"
                name="cro"
                {...formik.getFieldProps("cro")}
              />
              {formik.touched.cro && formik.errors.cro ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.cro}</div>
                </div>
              ) : null}
            </Form.Group>

            </Col>

            <Form.Group as={Col} controlId="formGridAddress1">
            <Form.Label>Visualizar agenda *</Form.Label>
            <Form.Control
              as="select" defaultValue="visualizar"
              name="visualizar"
              {...formik.getFieldProps("visualizar")}
            >
              <option value="propria">Própria</option>
              <option value="clinica">Cliníca</option>
            </Form.Control>
            {formik.touched.visualizar && formik.errors.visualizar ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.visualizar}</div>
              </div>
            ) : null}
            </Form.Group>

            <Form.Group as={Col} controlId="formGridAddress1">
            <Form.Label>Cor da agenda *</Form.Label>
            <Form.Control
            type="color"
              name="cor"
              {...formik.getFieldProps("cor")}
            />
            
            {formik.touched.cor && formik.errors.cor ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.cor}</div>
              </div>
            ) : null}
            </Form.Group>
          </Form.Row>

          <div className="separator separator-solid mt-4 mb-4"></div>
          <h4 className="mb-4">Dados do usúario</h4>

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
              {formik.touched.name && formik.errors.password_confirmation ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.password_confirmation}</div>
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
