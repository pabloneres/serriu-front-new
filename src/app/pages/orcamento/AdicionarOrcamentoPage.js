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
import axios from 'axios';
import { store } from '~/app/controllers/orcamentoController';
import { index } from '~/app/controllers/tabelaController';




export function AdicionarOrcamentoPage(props) {
    const { intl } = props;
    const { user: { authToken } } = useSelector((state) => state.auth);
    const [ tabelas, setTabelas ] = useState([])

    const history = useHistory();
    const [ufs, setUfs] = useState([]);

    const initialValues = {
        clinica: '',
        dentista: '',
        data: '',
        tabela: ''
    };

    useEffect(() => {
        index(authToken)
        .then( ({data}) => {
            setTabelas(data);
            console.log(tabelas);
           
        }).catch((err)=>{
          if (err.response.status === 401) {
            console.log('beeeee');
          }
        })
    },[])

 

    const OrcamentoSchema = Yup.object().shape({
        clinica: Yup.string()
          .min(3, "Minimum 3 symbols")
          .max(50, "Maximum 50 symbols")
          .required('Campo obrigatorio!'),
        dentista: Yup.string()
          .min(3, "Minimum 3 symbols")
          .max(50, "Maximum 50 symbols")
          .required('Campo obrigatorio!'),
        data: Yup.string()
          .min(3, "Minimum 3 symbols")
          .max(50, "Maximum 50 symbols")
          .required('Campo obrigatorio!'),
        tabela: Yup.string()
          .min(3, "Minimum 3 symbols")
          .max(50, "Maximum 50 symbols")
          .required('Campo obrigatorio!'),
        
      });

      const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: OrcamentoSchema,
        onSubmit: (values, { setStatus, setSubmitting }) => {
          store(authToken, values)
            .then(() => history.push("/orcamento"))
            .catch((err)=> {
              return 
              // retirar a linha debaixo e retornar o erro
              // setSubmitting(false);
            })
        },
      });

     

  return (
    <Card>
    <CardHeader title="Adicionar Orcamento"></CardHeader>
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

          <Form.Group as={Col} controlId="formGridAddress1">
            <Form.Label>Clinica *</Form.Label>
            <Form.Control
              as="select"
              name="clinica"
              {...formik.getFieldProps("clinica")}
            >
              <option value=""></option>
              <option value="masculino">Clinica1</option>
              <option value="feminino">Clinica2</option>
            </Form.Control>
            {formik.touched.clinica && formik.errors.clinica ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.clinica}</div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group as={Col} controlId="formGridAddress1">
            <Form.Label>Dentista *</Form.Label>
            <Form.Control
              as="select"
              name="dentista"
              {...formik.getFieldProps("dentista")}
            >
              <option value=""></option>
              <option value="masculino">Dentista1</option>
              <option value="feminino">Dentista2</option>
            </Form.Control>
            {formik.touched.dentista && formik.errors.dentista ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.dentista}</div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Data *</Form.Label>
            <Form.Control
              type="date"
              name="data"
              {...formik.getFieldProps("data")}
            />
            {formik.touched.data && formik.errors.data ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.data}</div>
              </div>
            ) : null}
          </Form.Group>

        </Form.Row>

        <Form.Row>

        <Form.Group as={Col} controlId="formGridAddress1">
            <Form.Label>Tabela *</Form.Label>
            <Form.Control
              as="select"
              name="tabela"
              {...formik.getFieldProps("tabela")}
            >
              <option value=""></option>
              
              {
                  tabelas.map(row =>{

                    return <option key={row.id} value={row.id}>{row.name}</option>

                  })
              }
            </Form.Control>
            {formik.touched.tabela && formik.errors.tabela ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.tabela}</div>
              </div>
            ) : null}
          </Form.Group>
       
        </Form.Row>

        <div className="text-right">
          <Link to="/dentista">
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
