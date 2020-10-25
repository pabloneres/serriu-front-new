import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, } from "~/_metronic/_partials/controls";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { Form, Table, Col, Button, CardGroup, Modal, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import SVG from 'react-inlinesvg'

import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import axios from 'axios';
import { store, index, getProcedimentos } from '~/app/controllers/orcamentoController';



import { conversorMonetario } from '~/app/modules/Util';


//COMPONENTES
import ProcedimentoGeral from "./components/formularios/procedimentoGeral";
import ProcedimentoSelecaoDente from "./components/formularios/procedimentoSelecaoDente";


import Select from 'react-select';

let data = new Date();

data = data.getFullYear() + "-" + ("0" + (data.getMonth() + 1)).slice(-2) + "-" + + data.getDate();


let listProcedimento = [];

var batata;

export function AdicionarOrcamentoPage(props) {
  const { intl } = props;
  const { user: { authToken } } = useSelector((state) => state.auth);
  const [tabelas, setTabelas] = useState([])
  const [procedimentos, setProcedimentos] = useState([])
  const [dentistas, setDentistas] = useState([])
  const [dentista, setDentista] = useState([])
  const [clinicas, setClinicas] = useState([])
  const [procedimentosFinalizados, setProcedimentosFinalizados] = useState([])
  const [dadosAPI, setDadosAPI] = useState([])

  const [modalFormaPagamento, setModalFormaPagamento] = useState(false)
  const [formaPagamento, setFormaPagamento] = useState({})


  const { params, url } = useRouteMatch()


  const [tabela, setTabela] = useState()
  


  const [procedimento, setProcedimento] = useState(undefined);



  const history = useHistory();
  const [ufs, setUfs] = useState([]);

  // const initialValues = {
  //   clinica: '',
  //   dentista: '',
  //   data: data,
  //   tabela: ''
  // };

  useEffect(() => {
    index(authToken)
      .then(({ data }) => {
        setDadosAPI(data);
        setTabelas(data.precos);
        setDentistas(data.dentistas);
        setClinicas([data.clinicas]);

      }).catch((err) => {
        console.log(err)

      })
  }, [])


  useEffect(() => {
    if(tabela !== undefined)
    {
      getProcedimentos(authToken, tabela)
        .then(({ data }) => {
          data = data.map(row =>{
            row.nomeTabela =  getTabelaName(tabela);
            return row;
          })
          setProcedimentos(data)
        }).catch((err) => {
          console.log(err)
        })
    }
    
  }, [tabela])


  const getDentistaName = value =>{
    let dentistaName = dentistas.filter( row => row.user_id == value);


    return dentistaName[0] !== undefined ? dentistaName[0].name : ''
  }


  const getTabelaName = value =>{

    let tabelaName = tabelas.filter( row => row.value == value);
    return tabelaName[0].label

  }


  const exibeModalFormaPagamento = () => {

    
    setModalFormaPagamento(true);
  }


  const handlerMudancaTabela = (e) => {
    
    setTabela(e.target.value)
  }

  const handlerMudancaDentista = (e) => {
    setDentista(e.target.value)
  }

  const handlerMudancaProcedimentos = (procedimento,action) => {


    
    if (procedimento && procedimento.value)
      setProcedimento({...procedimento});
    else
      setProcedimento(undefined);

  }

  const addProcedimentoFinalizado = (e, proced) => {

    

    //let newProced = proced.assign({},proced)

    if(proced.acao === undefined)
    {
      setProcedimentosFinalizados([...procedimentosFinalizados,proced]);
    }




    setProcedimento(undefined);
  };

  const removerProcedimento = (key) => {
    procedimentosFinalizados.splice(key, 1);
    setProcedimentosFinalizados([...procedimentosFinalizados]);
  };

  const alterarProcedimento = (procedimento) => {

    procedimento.acao = "alterar";
   
    setProcedimento(procedimento);


  };

  const getTotalProcedimentos = () => {

    let total = 0;

    procedimentosFinalizados.map((row) => {
      total += row.valorTotal;
    })

    return total

  }


  const exibeFormularioProcedimento = () => {
    let html = "";

    if (procedimento) {

      if (procedimento.geral) {
        html = (
          <ProcedimentoGeral onFinish={addProcedimentoFinalizado} procedimento={procedimento} dentista={dentista} />
        );
      }
      else {
        html = (
          <ProcedimentoSelecaoDente onFinish={addProcedimentoFinalizado} procedimento={procedimento} dentista={getDentistaName(dentista)} />
        );
      }


    }


    return html;
  }



  // const OrcamentoSchema = Yup.object().shape({
  //   clinica: Yup.string()
  //     .min(3, "Minimum 3 symbols")
  //     .max(50, "Maximum 50 symbols")
  //     .required('Campo obrigatorio!'),
  //   dentista: Yup.string()
  //     .min(3, "Minimum 3 symbols")
  //     .max(50, "Maximum 50 symbols")
  //     .required('Campo obrigatorio!'),
  //   data: Yup.string()
  //     .min(3, "Minimum 3 symbols")
  //     .max(50, "Maximum 50 symbols")
  //     .required('Campo obrigatorio!'),
  //   tabela: Yup.()
  //     .required('Campo obrigatorio!'),


  // });

  // const formik = useFormik({
  //   initialValues,
  //   enableReinitialize: true,
  //   validationSchema: OrcamentoSchema,
  //   onSubmit: (values, { setStatus, setSubmitting }) => {


  //     store(authToken, values)
  //       .then(() => history.push("/orcamento"))
  //       .catch((err) => {
  //         return
  //         // retirar a linha debaixo e retornar o erro
  //         // setSubmitting(false);
  //       })
  //   },
  // });

  const getFacesProcedimentoFormatado = (procedimento) =>{
    let strFaces = '';
    procedimento.dentes.map(dente =>{

        strFaces = strFaces.concat(dente.label);

        if(dente.faces !== undefined)
        {
            dente.faces.map(face =>{

                strFaces = strFaces.concat(face.label);

            })
        }

        strFaces = strFaces.concat(', ');

    })

    strFaces = strFaces.slice(0,-2);

    return strFaces;

}


  const handleSubmit = (e) => {
    e.preventDefault()

    store(authToken, {procedimentos:procedimentosFinalizados, dentista, paciente_id: params.id})
      .then(() => history.push(`${url}`))
      .catch((err) => {
        return
        // retirar a linha debaixo e retornar o erro
        // setSubmitting(false);
      })
  }

  var options = [
    { value: '', label: 'Busque procedimento...' },
    { value: '1', label: 'procedimento1', id: 1, geral: 0, valor: 100.0 },
    { value: '2', label: 'procedimento2', id: 2, geral: 1, valor: 150.0 }
  ];
  return (
    <Card>
      <Modal show={modalFormaPagamento} size="lg" >
        <Modal.Header closeButton>
          <Modal.Title>Forma de Pagamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form> 
            <Form.Row>
                <Form.Group as={Col} controlId="formGridAddress1">
                    <Form.Check type="radio" value={'valor total'} id="valorTotal" name="formaCobranca" label={"Valor Total"} inline selected  />
                    <Form.Check type="radio" name="formaCobranca" id="proProcedimento" value={'por procedimento'} label={"Por procedimento executado"} inline />
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} controlId="formGridAddress1">
                    <Form.Check type="radio" value={'dinheiro'} id="dinheiro" name="formaPagamento" label={"Dinheiro"} inline selected  />
                    <Form.Check type="radio" value={'boleto'} id="boleto" name="formaPagamento"  label={"Boleto"} inline />
                </Form.Group>
            </Form.Row>
        </Form>
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalFormaPagamento(false)}>
            Fechar
          </Button>
          <Button variant="primary" onClick={() => setModalFormaPagamento(false)}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
      <CardHeader title="Adicionar Orcamento"></CardHeader>
      <CardBody>
        <Form
          onSubmit={handleSubmit}
        >
 
          <Form.Row>

            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Clinica *</Form.Label>
              <Form.Control
                disabled
                as="select"
                name="clinica"
              >
                {
                  clinicas.map(row => {
                    return <option key={row.name}>{row.name}</option>
                  })
                }
              </Form.Control>
           
            </Form.Group>

            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Dentista *</Form.Label>
              <Form.Control
                as="select"
                name="dentista"
                onChange={(e) => handlerMudancaDentista(e)}
              >
                <option value=""></option>
                {
                  dentistas.map(row => {
                    return <option key={row.user_id} value={row.user_id}>{row.name}</option>
                  })
                }
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Data *</Form.Label>
              <Form.Control
                disabled
                type="date"
                name="data"
                value={data}
              />
              
            </Form.Group>

          </Form.Row>

          <Form.Row>

            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Tabela *</Form.Label>
              <Form.Control
                as="select"
                name="tabela"
                onChange={(e) => handlerMudancaTabela(e)}
              >
                <option value=""></option>
                {
                  tabelas.map(tabela => (
                    <option key={tabela.id} value={tabela.value}>{tabela.label}</option>
                  ))
                }

              </Form.Control>
            
            </Form.Group>

            </Form.Row>

            <Form.Row>

       
            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Procedimentos *</Form.Label>
                
              <Select
                isClearable={true}
               
                placeholder="Busque procedimento..."
                options={procedimentos}
                //options={options}
                onChange={(value,action) => { handlerMudancaProcedimentos(value,action)}}
                
                isOptionDisabled={procedimentos}
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

            <Card className="card-orcamento">
              <CardHeader title="Orçamentos" ></CardHeader>
              <CardBody>

                   <div className="todosOrcamentos">
                   {procedimentosFinalizados.map((row, key) => {
                     
                      return (
                        <div className="orcamento" key={key} >
                          <div className="conteudo" >
                            <div className="linha">{row.label}</div>
                            <div className="linha">{getDentistaName(dentista)}</div>
                            <div className="linha">{row.nomeTabela}</div>
                            <div className="linha">{getFacesProcedimentoFormatado(row)}</div>
                           
                            
                            </div>
                          <div className="total" >
                            <p className="texto">{conversorMonetario(row.valorTotal)}</p>

                                <div className="acoes">
                                {
                                  /**
                                   <span onClick={() => alterarProcedimento(key) } className="svg-icon menu-icon">
                                  <SVG style={{"fill": "#3699FF", "color": "#3699FF", "cursor": "pointer"}} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
                                  </span>
                                  */
                                }
                              

                                <span onClick={() => alterarProcedimento(row)} className="svg-icon menu-icon">
                                    <SVG style={{"fill": "#fff", "color": "#fff", "cursor": "pointer"}} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
                                </span>
                                <span onClick={() => removerProcedimento(key)} className="svg-icon menu-icon">
                                  <SVG style={{ "fill": "#fff", "color": "#fff", "marginLeft": 8, "cursor": "pointer" }} src={toAbsoluteUrl("/media/svg/icons/Design/delete.svg")} />
                                </span>
                              </div>
                            </div>
                         
                        </div>
                      )

                    })}
                   </div>





                <div className="text-right">
                  <h2>Total : {conversorMonetario(getTotalProcedimentos())}</h2>
                </div>
                <div className="text-right">
                <span onClick={() => exibeModalFormaPagamento()} className="svg-icon menu-icon btn-formapagamento">
                   <SVG style={{ "fill": "#3699FF", "color": "#3699FF",  "marginRight": 8, "cursor": "pointer" }} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
                   DEFINIR FORMA DE PAGAMENTO
                </span>
                </div>

              </CardBody>
            </Card>
          </CardGroup>

          <div className="text-right">
            <Link to={`${url}`}>
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
