import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody,  } from "~/_metronic/_partials/controls";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { Form, Table, Col, Button, CardGroup, Modal } from "react-bootstrap";
import SVG from 'react-inlinesvg'

import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import axios from 'axios';
import { store, index } from '~/app/controllers/orcamentoController';



import { conversorMonetario } from '~/app/modules/Util';


//COMPONENTES
import ProcedimentoGeral from "./components/formularios/procedimentoGeral";
import ProcedimentoSelecaoDente from "./components/formularios/procedimentoSelecaoDente";


import Select from 'react-select';

let data = new Date();

data = data.getFullYear() + "-" + ("0" + (data.getMonth() + 1)).slice(-2) + "-" + + data.getDate();


let listProcedimento = [];

export function AdicionarOrcamentoPage(props) {
    const { intl } = props;
    const { user: { authToken } } = useSelector((state) => state.auth);
    const [ tabelas, setTabelas ] = useState([])
    const [ dentistas, setDentistas ] = useState([])
    const [ clinicas, setClinicas ] = useState([])
    const [ procedimentos, setProcedimentos ] = useState([])
    const [ procedimentosFinalizados, setProcedimentosFinalizados ] = useState([])
    const [ dadosAPI, setDadosAPI ] = useState([])
    const [ modalOrcamento, setModalOrcamento ] = useState(false)
    const [ modalOrcamentoProcedimento, setModalOrcamentoProcedimento ] = useState({})

    const [procedimento,setProcedimento] = useState();

   

 

 

    const history = useHistory();
    const [ufs, setUfs] = useState([]);

    const initialValues = {
        clinica: '',
        dentista: '',
        data: data,
        tabela: ''
    };

 

    useEffect(() => {
        index(authToken)
        .then( ({data}) => {
           
      
            setDadosAPI(data);
            setTabelas(data.precos);
            setDentistas(data.dentistas);
            setClinicas([data.clinicas]);
           
        }).catch((err)=>{
          console.log(err)
          
        })
    },[])


    const openModalProcedimento = (proced) =>{

        console.log(proced);
        setModalOrcamentoProcedimento(proced);
        setModalOrcamento(true);
    }


    const handlerMudancaTabela = (e) => {



    }

    const handlerMudancaProcedimentos = (e) => {

      if(e.value)
        setProcedimento(e);
      else
        setProcedimento(undefined);

    }

    const addProcedimentoFinalizado = (e,proced) =>{

      
      setProcedimentosFinalizados([...procedimentosFinalizados, proced]);
      

     
      
     setProcedimento(undefined); 
    };

    const removerProcedimento = (key) =>{


    
      procedimentosFinalizados.splice(key, 1);
      setProcedimentosFinalizados([...procedimentosFinalizados]);

  
    

    };

    const alterarProcedimento = (key) =>{

     
      setProcedimento(procedimentosFinalizados[key]);
    

    };

    const getTotalProcedimentos = () =>{

      let total = 0;

      procedimentosFinalizados.map((row) =>{
          total += row.valor;
      })

      return total

    }

 
    const exibeFormularioProcedimento = () =>
    {
        let html = "";

        if(procedimento)
        {

            if(procedimento.geral)
            {
                html = (
                  <ProcedimentoGeral onFinish={addProcedimentoFinalizado} procedimento={procedimento} />
                );
            }
            else
            {
              html = (
                   <ProcedimentoSelecaoDente onFinish={addProcedimentoFinalizado} procedimento={procedimento} />
                );
            }


        }


        return html;
    }

 

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

     
      var options = [
        { value: '', label: 'Busque procedimento...' },
        { value: '1', label: 'procedimento1', id: 1, geral: 0, valor: 100.0 },
        { value: '2', label: 'procedimento2', id: 2, geral: 1, valor: 150.0 }
    ];
  return (
    <Card>
      <Modal
        show={modalOrcamento}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
          {modalOrcamentoProcedimento.label}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(() => {
              

              if(modalOrcamentoProcedimento.geral == 0){

                return(
                  <div className="relatorio">
                      <CardGroup>
                        <Card>
                          <CardHeader title="Informações"></CardHeader>
                          <CardBody>
                            <p>
                              
                            </p>

                          </CardBody>
                        </Card>
                        <Card>
                        <CardHeader title="Dentes"></CardHeader>
                            <CardBody>
                          
                            <ul className="listaDentes">
                                {modalOrcamentoProcedimento.dentes.map((dente,key)=>{
                                    return(
                                      <li key={key} className="ativo">
                                          <span>{dente.label}</span>
                                          <span>{modalOrcamentoProcedimento.labe}</span>
            
                                          <div className="faces">
                                                {dente.faces.map((face,key) =>{
                                                    return (
                                                    <div key={key}  className="face ativo" >{face.label}</div>
                                                    )
                                                })}
                                          </div>
                                        
                                    </li>
                                  )
                                })}
                              </ul>
                            </CardBody>
                        </Card>
                      </CardGroup>
                  </div>
                )

              }
              
           
           })()}
        
          <div className="text-left">
              <h2>Total : {conversorMonetario(modalOrcamentoProcedimento.valor)}</h2>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalOrcamento(!modalOrcamento)}>Fechar</Button>
        </Modal.Footer>
      </Modal>
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
             disabled
              as="select"
              name="clinica"
              {...formik.getFieldProps("clinica")}
            >
             
              
               {
                  clinicas.map(row =>{


                    return <option key={row.name}>{row.name}</option>

                  })
              }
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
               {
                  dentistas.map(row =>{
                   
                    return <option key={row.user_id} value={row.id}>{row.name}</option>

                  })
              }
              
             
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
              disabled
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
              as={"select"}
              name="tabela"
              onChange={(e) => handlerMudancaTabela(e)}
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

        <Form.Row>
            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Procedimentos *</Form.Label>
              <Select
                placeholder="Busque procedimento..."
                options={options}
                onChange={handlerMudancaProcedimentos}
              />
             
            </Form.Group>
       
        </Form.Row>


        <CardGroup>
          
          <Card>
              <CardHeader title="Procedimento"></CardHeader>
              <CardBody>
                {exibeFormularioProcedimento()}
                
              </CardBody>
          </Card>

          <Card >
              <CardHeader title="Orçamentos"></CardHeader>
              <CardBody>

                  <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Valor</th>
                          <th>Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        
                      {procedimentosFinalizados.map((row,key)=>{
                        return (
                          <tr key={key} >
                            <td >{row.label}</td>
                            <td >{conversorMonetario(row.valor)}</td>
                            <td>
                             {
                               /**
                                <span onClick={() => alterarProcedimento(key) } className="svg-icon menu-icon">
                                <SVG style={{"fill": "#3699FF", "color": "#3699FF", "cursor": "pointer"}} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
                                </span>
                                */
                             }
                             <span onClick={() => openModalProcedimento(row) } className="svg-icon menu-icon info">
                                <i style={{"fill": "#3699FF", "color": "#3699FF", "marginLeft": 8, "cursor": "pointer"}} className="fa fa-info-circle"></i>
                              </span>
                              <span onClick={() => removerProcedimento(key) } className="svg-icon menu-icon">
                                <SVG style={{"fill": "#3699FF", "color": "#3699FF", "marginLeft": 8, "cursor": "pointer"}} src={toAbsoluteUrl("/media/svg/icons/Design/delete.svg")} />
                              </span>
                            </td>
                        </tr>
                        )

                      })}
                          
                         
                        
                        
                  
                      </tbody>
                  </Table>

                  <div className="text-right">
                      <h2>Total : {conversorMonetario(getTotalProcedimentos())}</h2>
                  </div>

              </CardBody>
          </Card>
        </CardGroup>

        <div className="text-right">
          <Link to="/orcamento">
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
