import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody} from "../../../../_metronic/_partials/controls";
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import { Form, Col, Button, Navbar, Nav  } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { update, show } from '~/app/controllers/pacienteController'


import { Dados } from './components/Dados'
import { Orcamentos } from './components/Orcamentos'
import { FichaClinica } from './components/FichaClinica'
import { Financeiro } from './components/Financeiro'


import { AdicionarOrcamentoPage } from "~/app/pages/orcamento/AdicionarOrcamentoPage";

export function EditarPacientePage(props) {
  const { params, url } = useRouteMatch()
  const { intl } = props;
  const { user: { authToken } } = useSelector((state) => state.auth);
  const history = useHistory();
  

  const [patient, setPatient] = useState({})
  const [user, setUser] = useState({})
  const [ufs, setUfs] = useState([])
  const [menu, setMenu] = useState('dados')

  const pacienteSchema = Yup.object().shape({
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
    nasc: Yup.string()
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
    status: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    schooling: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
  });

  const formik = useFormik({
    initialValues: patient,
    enableReinitialize: true,
    validationSchema: pacienteSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      update(authToken, params.id, values)
        .then(() => history.push("/paciente"))
        .catch((err)=> {
          return 
          // retirar a linha debaixo e retornar o erro
          // setSubmitting(false);
        })
    },
  });

  useEffect(() => {
    show(authToken, params.id)
      .then(({data}) => {
        setPatient(data[0])
      })
      .catch((err)=> history.push('/pacientes'))
  }, [])


  function HandleChangeMenu() {

    const itensMenu = {
      'dados': () => <Dados/>,
      'orcamentos': () => <Orcamentos/>,
      'fichaClinica': () => <FichaClinica/>,
      'financeiro': () => <Financeiro/>
    }
   
  

    return itensMenu[menu]();
  }
  
  return (
    <Card>
    
        
        <Nav className="mr-auto" variant="tabs">
          {/* <Nav.Link><Link to={`${url}`}>Dados</Link></Nav.Link>
          <Nav.Link><Link to={`/orcamento/${params.id}/adicionar`}>Orçamento</Link></Nav.Link> */}

          <Nav.Item>
            <Nav.Link onClick={()=> { setMenu('dados') }} className={menu == 'dados' ? 'active' : ''} >Dados</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link onClick={()=> { setMenu('orcamentos') }}className={menu == 'orcamentos' ? 'active' : ''}  >Orçamentos</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link onClick={()=> { setMenu('financeiro') }}  className={menu == 'financeiro' ? 'active' : ''} >Financeiro</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link onClick={()=> { setMenu('fichaClinica') }}  className={menu == 'fichaClinica' ? 'active' : ''} >Ficha Clinica</Nav.Link>
          </Nav.Item>
        </Nav>

     
      <HandleChangeMenu/>
      {/* <CardHeader title="Editar Paciente"></CardHeader>
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
              <Form.Label>RG</Form.Label>
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
              <Form.Label>Data de Nascimento</Form.Label>
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
      </CardBody> */}
    </Card>
  );
}
