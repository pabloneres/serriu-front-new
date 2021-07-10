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
import { store } from '~/controllers/controller'
import InputMask from '~/utils/mask'
import axios from 'axios'


const initialValues = {
  firstName: '',
  lastName: '',
  cpf: '',
  rg: '',
  address: '',
  city: '',
  birth: '',
  email: '',
  gender: '',
  tel: '',
  marital_status: '',
  schooling: '',
}



export function AdicionarPacientePage(props) {
  const { intl } = props;
  const { token } = useSelector((state) => state.auth);
  const { selectedClinic } = useSelector((state) => state.clinic);
  const history = useHistory();
  const [ufs, setUfs] = useState([])

  useEffect(()=> {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(({data})=>{
      setUfs(data)
    }).catch(()=>{
      return
    })
  },[])

  const pacienteSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required('Campo obrigatorio!'),
    lastName: Yup.string()
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
    address: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    uf: Yup.string()
      .min(2, "Minimum 2 symbols")
      .max(10, "Maximum 50 symbols"),
    city: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    birth: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    gender: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    tel: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    marital_status: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    schooling: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
  });


  const formik = useFormik({
    initialValues,
    validationSchema: pacienteSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      store(token, 'patient', {...values, clinic_id: selectedClinic.id})
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

              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Nome *</Form.Label>
                <Form.Control
                  placeholder="Digite seu nome"
                  type="text"
                  name="firstName"
                  {...formik.getFieldProps("firstName")}
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.firstName}</div>
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Sobrenome *</Form.Label>
                <Form.Control
                  placeholder="Digite seu sobrenome"
                  type="text"
                  name="lastName"
                  {...formik.getFieldProps("lastName")}
                />
                {formik.touched.lastName && formik.errors.lastName ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.lastName}</div>
                  </div>
                ) : null}
              </Form.Group>
          
          </Form.Row>


          <Form.Row>

          <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>CPF *</Form.Label>
               <InputMask
                mask="999.999.999-99" 
                className="input-mask"
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
            <Form.Label>RG</Form.Label>
             <InputMask
                mask="99.999.999-9" 
                type="text"
                className="input-mask"
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
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu Endereço"
                name="address"
                {...formik.getFieldProps("address")}
              />
              {formik.touched.address && formik.errors.address ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.address}</div>
                </div>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Cidade</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite sua Cidade"
                name="city"
                {...formik.getFieldProps("city")}
              />
              {formik.touched.city && formik.errors.city ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.city}</div>
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

          <Form.Row>

          <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Data de Nascimento</Form.Label>
              <Form.Control
                type="date"
                name="birth"
                {...formik.getFieldProps("birth")}
              />
              {formik.touched.birth && formik.errors.birth ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.birth}</div>
                </div>
              ) : null}
            </Form.Group>

            <Col xs={6}>
            <Form.Group controlId="formGridAddress1">
              <Form.Label>Email</Form.Label>
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
              <Form.Label>Genêro</Form.Label>
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
              <Form.Label>Celular</Form.Label>
              <Form.Control
                placeholder="Digite seu celular"
                name="tel"
                {...formik.getFieldProps("tel")}
              />
              {formik.touched.tel && formik.errors.tel ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.tel}</div>
                </div>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Estado Civil</Form.Label>
              <Form.Control
              as="select"
                name="marital_status"
                {...formik.getFieldProps("marital_status")}
              >
                <option value=""></option>
                <option value="solteiro">Solteiro(a)</option>
                <option value="casado">Casado(a)</option>
              </Form.Control>
              {formik.touched.marital_status && formik.errors.marital_status ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.marital_status}</div>
                </div>
              ) : null}
            </Form.Group>


            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Escolaridade</Form.Label>
              <Form.Control
              as="select"
                name="schooling"
                {...formik.getFieldProps("schooling")}
              >
                <option value=""></option>
                <option value="analfabeto">Analfabeto</option>
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
              {formik.touched.schooling && formik.errors.schooling ? (
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
