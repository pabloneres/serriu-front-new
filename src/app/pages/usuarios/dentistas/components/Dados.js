import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { connect } from "react-redux";
import { Link } from 'react-router-dom'

import { Form, Col, Button, Navbar, Nav  } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import axios from 'axios'
import { update, show } from '~/app/controllers/dentistaController'
import { Input } from 'antd'
import InputMask from '~/utils/mask'


export function Dados(props) {
  const { params, url } = useRouteMatch()
  const { intl } = props;
  const { user: { authToken } } = useSelector((state) => state.auth);
  const history = useHistory();

  const [dentist, setDentist] = useState({})
  const [user, setUser] = useState({})
  const [ufs, setUfs] = useState([])
  const [recebeComissao, setRecebeComissao] = useState(false)


  const DentistaSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    cpf: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    nasc: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    gender: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    tel: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    status: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    cro: Yup.string()
      .min(2, "Minimum 2 symbols")
      .max(2, "Maximum 2 symbols")
      .required('Campo obrigatorio!'),
    cro_number: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    schedule: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    color_schedule: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    recebeComissao: Yup.bool()
      .required('Campo obrigatorio!'),
    comissao: Yup.number()
      .required('Campo obrigatorio!'),
    email: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
  });

  const formik = useFormik({
    initialValues: {...dentist, email: user.email},
    enableReinitialize: true,
    validationSchema: DentistaSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      console.log(values)
      update(authToken, params.id, {...values, recebeComissao: recebeComissao === true ? 1 : 0})
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

  useEffect(() => {
    show(authToken, params.id)
      .then(({data}) => {
        setDentist(data[0])
        setRecebeComissao(data[0].recebeComissao === 1 ? true : false)
        setUser(data[0].user)
      })
      .catch((err)=> history.push('/dentista'))
  }, [])

  return (
    <Card>
      <CardHeader title="Dados do Dentista"></CardHeader>
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
              <InputMask mask="999.999.999-99"  className="input-mask"
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
                name="nasc"
                {...formik.getFieldProps("nasc")}
              />
              {formik.touched.nasc && formik.errors.nasc ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.nasc}</div>
                </div>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Genêro *</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                {...formik.getFieldProps("gender")}
              >
                <option value=""></option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </Form.Control>
              {formik.touched.gender && formik.errors.gender ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.gender}</div>
                </div>
              ) : null}
            </Form.Group>

          </Form.Row>

          <Form.Row>

          <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Celular *</Form.Label>
              <InputMask mask="(99) 99999-9999"  className="input-mask"
                {...formik.getFieldProps("tel")}
              />
              {/* <Form.Control
                placeholder="Digite seu celular"
                name="tel"
                {...formik.getFieldProps("tel")}
              /> */}
              {formik.touched.tel && formik.errors.tel ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.tel}</div>
                </div>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Estado Civil *</Form.Label>
              <Form.Control
              as="select"
                name="status"
                {...formik.getFieldProps("status")}
              >
                <option value=""></option>
                <option value="solteiro">Solteiro(a)</option>
                <option value="casado">Casado(a)</option>
              </Form.Control>
              {formik.touched.status && formik.errors.status ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.status}</div>
                </div>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>CRO *</Form.Label>
              <Form.Control
                as="select"
                name="cro"
                {...formik.getFieldProps("cro")}
              >
                <option value="" ></option>
                {
                  ufs.map((uf) => {
                  return (
                  <option key={uf.sigla} value={uf.sigla} >{uf.sigla}</option>
                  )
                  })
                }
              </Form.Control>
              {formik.touched.cro && formik.errors.cro ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.cro}</div>
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
                name="cro_number"
                {...formik.getFieldProps("cro_number")}
              />
              {formik.touched.cro_number && formik.errors.cro_number ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.cro_number}</div>
                </div>
              ) : null}
            </Form.Group>

            </Col>

            <Form.Group as={Col} controlId="formGridAddress1">
            <Form.Label>Visualizar agenda *</Form.Label>
            <Form.Control
              as="select"
              name="schedule"
              {...formik.getFieldProps("schedule")}
            >
              <option value=""></option>
              <option value="propria">Própria</option>
              <option value="clinica">Cliníca</option>
            </Form.Control>
            {formik.touched.schedule && formik.errors.schedule ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.schedule}</div>
              </div>
            ) : null}
            </Form.Group>

            <Form.Group as={Col} controlId="formGridAddress1">
            <Form.Label>Cor da agenda *</Form.Label>
            <Form.Control
            type="color"
              name="color_schedule"
              {...formik.getFieldProps("color_schedule")}
            />
            
            {formik.touched.color_schedule && formik.errors.color_schedule ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.color_schedule}</div>
              </div>
            ) : null}
            </Form.Group>
          </Form.Row>
          
          <Form.Row>
            <Form.Group 
            // as={Col} 
            controlId="formGridAddress1">
              <Form.Label>Dentista recebe comissão ?</Form.Label>
              <Form.Check
                type="checkbox"
                name="recebeComissao"
                label="Sim"
                checked={recebeComissao}
                onChange={(e) => {
                  setRecebeComissao(e.target.checked)
                }}
              />
              
      
              </Form.Group>

              {
                recebeComissao ? 
                <Form.Group 
                // as={Col} 
                style={{marginLeft: 50}}
                controlId="formGridAddress1">
                <Form.Label>Comissão *</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ex: 50 => 50%"
                  name="comissao"
                  {...formik.getFieldProps("comissao")}
                />
                {formik.touched.comissao && formik.errors.comissao ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.comissao}</div>
                  </div>
                ) : null}
                </Form.Group>
                 : <></>
              }
          </Form.Row>

          <div className="separator separator-solid mt-4 mb-4"></div>
          <h4 className="mb-4">Dados do usúario</h4>

          <Form.Row>
    
            <Form.Group as={Col} controlId="formGridAddress1">
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
          </Form.Row>

          <div className="text-right">
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}
