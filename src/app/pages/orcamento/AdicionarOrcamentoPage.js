import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, } from "~/_metronic/_partials/controls";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { Form, Table, Col, Button, CardGroup, Modal, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import SVG from 'react-inlinesvg'

import moment from 'moment'
import { format } from 'date-fns-tz'

import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import axios from 'axios';
import { store, index, update, getProcedimentos } from '~/app/controllers/orcamentoController';

import { conversorMonetario, formatDate } from '~/app/modules/Util';


//COMPONENTES
import ProcedimentoGeral from "./components/formularios/procedimentoGeral";
import ProcedimentoSelecaoDente from "./components/formularios/procedimentoSelecaoDente";


import Select from 'react-select';



let listProcedimento = [];

var batata;

export function AdicionarOrcamentoPage({ orcamento, alterar }) {

  const formaPagamentoInicial = {
    formaCobranca: null,
    formaPagamento: null,
    tipoPagamento: 0,
    valorEntrada: null,
    parcelas: null,
    salvo: false

  };


  const date_now = new Date()

  const data = format(date_now, `dd/MM/yyyy HH:mm:ss`, {
    timeZone: 'America/Sao_Paulo',
  })

  console.log(data)

  const { user: { authToken } } = useSelector((state) => state.auth);
  const [tabelas, setTabelas] = useState([])
  const [procedimentos, setProcedimentos] = useState([])
  const [dentistas, setDentistas] = useState([])
  const [dentista, setDentista] = useState([])
  const [clinicas, setClinicas] = useState([])
  const [procedimentosFinalizados, setProcedimentosFinalizados] = useState([])
  const [dadosAPI, setDadosAPI] = useState([])

  const [modalFormaPagamento, setModalFormaPagamento] = useState(false)


  const [formFormaPagamento, setFormFormaPagamento] = useState(formaPagamentoInicial)



  useEffect(() => {

    if (orcamento !== undefined) {
      console.log(orcamento)
      let procedimentos = JSON.parse(orcamento.procedimento);
      console.log(procedimentos)

      procedimentos.map((row) => {

        row.label = row.procedimento
        row.habilitado = true;
      })
      setProcedimentosFinalizados(procedimentos)
      setDentista(orcamento.dentista);
    }

  }, [orcamento])



  const setFormaCobranca = (formaCobranca) => {
    formFormaPagamento.formaCobranca = formaCobranca;
    setFormFormaPagamento({ ...formFormaPagamento })
  }

  const setFormaPagamento = (formaPagamento) => {
    formFormaPagamento.formaPagamento = formaPagamento;

    setFormFormaPagamento({ ...formFormaPagamento })
  }

  const setTipoPagamento = (tipoPagamento) => {
    formFormaPagamento.tipoPagamento = tipoPagamento;
    setFormFormaPagamento({ ...formFormaPagamento })
  }

  const setEntrada = (entrada) => {
    formFormaPagamento.entrada = entrada;
    setFormFormaPagamento({ ...formFormaPagamento })
  }
  const setValorEntrada = (valorEntrada) => {
    formFormaPagamento.valorEntrada = valorEntrada / 100;
    setFormFormaPagamento({ ...formFormaPagamento })
  }
  const setParcelas = (parcelas) => {
    formFormaPagamento.parcelas = parcelas;
    setFormFormaPagamento({ ...formFormaPagamento })
  }

  const getValorEntrada = () => {

    return getTotalProcedimentos() * formFormaPagamento.valorEntrada;

  }



  const handleSubmitFormaPagamento = (e) => {

    e.preventDefault();

    formFormaPagamento.salvo = true;

    console.log(formFormaPagamento);

    setModalFormaPagamento(false);

  };



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
    if (tabela !== undefined) {
      getProcedimentos(authToken, tabela)
        .then(({ data }) => {
          data = data.map(row => {
            row.nomeTabela = getTabelaName(tabela);
            return row;
          })
          setProcedimentos(data)
        }).catch((err) => {
          console.log(err)
        })
    }

  }, [tabela])


  const getDentistaName = value => {
    let dentistaName = dentistas.filter(row => row.user_id == value);


    return dentistaName[0] !== undefined ? dentistaName[0].name : ''
  }


  const getTabelaName = value => {

    let tabelaName = tabelas.filter(row => row.value == value);
    return tabelaName[0].label

  }


  const exibeModalFormaPagamento = () => {


    setModalFormaPagamento(true);
  }


  const handlerMudancaTabela = (e) => {

    setProcedimento(undefined);
    setTabela(e.target.value)
  }

  const handlerMudancaDentista = (e) => {
    setDentista(e.target.value)
  }

  const handlerMudancaProcedimentos = (procedimento, action) => {



    if (procedimento && procedimento.value)
      setProcedimento({ ...procedimento });
    else
      setProcedimento(undefined);

  }

  const addProcedimentoFinalizado = (e, proced) => {



    //let newProced = proced.assign({},proced)

    if (proced.acao === undefined) {
      proced.habilitado = true;
      setProcedimentosFinalizados([...procedimentosFinalizados, proced]);
    }




    setProcedimento(undefined);
  };

  const removerProcedimento = (key) => {
    procedimentosFinalizados.splice(key, 1);
    setProcedimentosFinalizados([...procedimentosFinalizados]);
  };
  const alternarProcedimento = (proced) => {

    proced.habilitado = !proced.habilitado;

    setProcedimentosFinalizados([...procedimentosFinalizados]);
  }

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

  const getFacesProcedimentoFormatado = (procedimento) => {
    let strFaces = '';
    procedimento.dentes.map(dente => {

      strFaces = strFaces.concat(dente.label);

      if (dente.faces !== undefined) {
        dente.faces.map(face => {

          strFaces = strFaces.concat(face.label);

        })
      }

      strFaces = strFaces.concat(', ');

    })

    strFaces = strFaces.slice(0, -2);

    return strFaces;

  }


  function handleSubmit(type) {

    if (alterar) {
      console.log(orcamento.id)

      if (type === 'aprovar') {
        update(authToken, orcamento.id, { procedimentos: procedimentosFinalizados, dentista, paciente_id: params.id, formaPagamento: formFormaPagamento, aprovado: 1 })
          .then(() => {
            return history.push(`${url}`)
          })
          .catch((err) => {
            return
            // retirar a linha debaixo e retornar o erro
            // setSubmitting(false);
          })
      }

      update(authToken, orcamento.id, { procedimentos: procedimentosFinalizados, dentista, paciente_id: params.id, formaPagamento: formFormaPagamento })
        .then(() => {
          return history.push(`${url}`)
        })
        .catch((err) => {
          return
          // retirar a linha debaixo e retornar o erro
          // setSubmitting(false);
        })

      return

    }

    if (type === 'aprovar') {
      store(authToken, { procedimentos: procedimentosFinalizados, dentista, paciente_id: params.id, formaPagamento: formFormaPagamento, aprovado: 1 })
        .then(() => history.push(`${url}`))
        .catch((err) => {
          return
          // retirar a linha debaixo e retornar o erro
          // setSubmitting(false);
        })
    }

    if (type === 'salvar') {
      store(authToken, { procedimentos: procedimentosFinalizados, dentista, paciente_id: params.id, formaPagamento: formFormaPagamento })
        .then(() => history.push(`${url}`))
        .catch((err) => {
          return
          // retirar a linha debaixo e retornar o erro
          // setSubmitting(false);
        })
    }

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
          <Form onSubmit={handleSubmitFormaPagamento}>
            <Form.Row className="justify-content-md-center" >
              <Form.Group controlId="formGridAddress1">
                <Form.Check
                  type="radio"
                  value={'valor total'}
                  id="valorTotal"
                  name="formaCobranca"
                  label={"Valor Total"}
                  inline
                  onClick={(e) => { setFormaCobranca(e.target.value) }}
                  checked={formFormaPagamento.formaCobranca == 'valor total'}
                  required
                />
                <Form.Check
                  type="radio"
                  value={'por procedimento'}
                  id="proProcedimento"
                  name="formaCobranca"
                  label={"Por procedimento executado"}
                  inline
                  required
                  onClick={(e) => {
                    setFormaCobranca(e.target.value);
                    setTipoPagamento(0);
                    setFormaPagamento('dinheiro');

                  }}
                  checked={formFormaPagamento.formaCobranca == 'por procedimento'}
                />
                <Form.Control.Feedback type="invalid">
                  Esse campo é necessario!
                     </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row className="justify-content-md-center">
              <Form.Group controlId="formGridAddress1">
                <Form.Check
                  type="radio"
                  value={'dinheiro'}
                  id="dinheiro"
                  name="formaPagamento"
                  label={"Dinheiro"}
                  inline
                  onClick={(e) => {
                    setFormaPagamento(e.target.value)
                    setTipoPagamento(0);
                  }}

                  required
                  checked={formFormaPagamento.formaPagamento == 'dinheiro'}
                />
                <Form.Check
                  type="radio"
                  value={'boleto'}
                  id="boleto"
                  name="formaPagamento"
                  label={"Boleto"}
                  inline
                  required
                  onClick={(e) => {
                    setFormaPagamento(e.target.value)
                    setTipoPagamento(1)
                  }}
                  disabled={formFormaPagamento.formaCobranca == 'por procedimento'}
                  checked={formFormaPagamento.formaPagamento == 'boleto'}
                />
              </Form.Group>
              <Form.Control.Feedback type="invalid">
                Esse campo é necessario!
                </Form.Control.Feedback>
            </Form.Row>

            <Form.Row className="justify-content-md-center">
              <Form.Group controlId="formGridAddress1">
                <Form.Check
                  type="radio"
                  value={0}
                  id="avista"
                  name="tipoPagamento"
                  label={"À vista"}
                  inline
                  onClick={(e) => {
                    setTipoPagamento(e.target.value)

                  }}
                  checked={formFormaPagamento.tipoPagamento == 0}
                  disabled={formFormaPagamento.formaPagamento == 'boleto'}
                  required
                />

                <Form.Check
                  type="radio"
                  value={1}
                  id="parcelado"
                  name="tipoPagamento"
                  label={"Parcelado/À prazo"}
                  inline
                  onClick={(e) => setTipoPagamento(e.target.value)}
                  checked={formFormaPagamento.tipoPagamento == 1}
                  disabled={formFormaPagamento.formaCobranca == 'por procedimento' || !formFormaPagamento.formaCobranca || formFormaPagamento.formaPagamento == 'dinheiro'}
                  required
                />
              </Form.Group>
              <Form.Control.Feedback type="invalid">
                Esse campo é necessario!
                </Form.Control.Feedback>
            </Form.Row>

            {(() => {

              if (formFormaPagamento.tipoPagamento == 1) {
                return (
                  <Form.Row className="justify-content-md-center">

                    <Form.Group as={Col}   >
                      <Form.Label>Porcentagem Entrada</Form.Label>
                      <Form.Control type="number" name="valorEntrada" defaultValue={formFormaPagamento.valorEntrada * 100} onChange={(e) => setValorEntrada(e.target.value)} required />
                      <Form.Control.Feedback type="invalid">
                        Esse campo é necessario!
                          </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}  >
                      <Form.Label>Total</Form.Label>
                      <Form.Control type="text" name="valorEntrada" disabled value={conversorMonetario((getTotalProcedimentos() - getValorEntrada()))} />
                      <Form.Control.Feedback type="invalid">
                        Esse campo é necessario!
                          </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}  >
                      <Form.Label>Valor Entrada</Form.Label>
                      <Form.Control type="text" name="valorEntrada" disabled value={conversorMonetario(getValorEntrada())} required />
                      <Form.Control.Feedback type="invalid">
                        Esse campo é necessario!
                          </Form.Control.Feedback>
                    </Form.Group>


                    <Form.Group as={Col}  >{/*sm={3}*/}
                      <Form.Label>parcelas</Form.Label>
                      <Form.Control as="select" name="parcelas" required onChange={(e) => setParcelas(e.target.value)}>
                        {(() => [...Array(10).keys()].map(row => {

                          return <option key={row + 1} value={row + 1} selected={formFormaPagamento.parcelas == row + 1} >  {row + 1} X {conversorMonetario((getTotalProcedimentos() - getValorEntrada()) / (row + 1))}</option>

                        }))()}

                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        Esse campo é necessario!
                          </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                )
              }

            })()}


            <Modal.Footer>
              <Button variant="secondary" onClick={() => {
                setFormFormaPagamento(formaPagamentoInicial);
                setModalFormaPagamento(false);
              }}>
                Fechar
          </Button>
              <Button variant="primary" type="submit" >
                Salvar
          </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <CardHeader title="Adicionar Orcamento"></CardHeader>
      <CardBody>
        <Form>

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
                    return <option key={row.user_id} value={row.user_id} selected={dentista == row.user_id} >{row.name}</option>
                  })
                }
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Data *</Form.Label>
              <Form.Control
                disabled
                type="text"
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
                value={procedimento}
                placeholder="Busque procedimento..."
                options={procedimentos}
                //options={options}
                onChange={(value, action) => { handlerMudancaProcedimentos(value, action) }}

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

                    console.log(row)

                    return (
                      <div className={"orcamento " + (!row.habilitado ? 'desabilitado' : '')} key={key} >
                        <div>
                          <Form.Check onChange={() => alternarProcedimento(row)} defaultChecked={row.habilitado} />
                        </div>
                        <div className="conteudo" >
                          <div className="linha">{row.label}</div>
                          <div className="linha">{getDentistaName(dentista)}</div>
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
                              <SVG style={{ "fill": "#fff", "color": "#fff", "cursor": "pointer" }} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
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
                  {(() => {


                    return (
                      <span onClick={() => exibeModalFormaPagamento()} className="svg-icon menu-icon btn-formapagamento">
                        <SVG style={{ "fill": "#3699FF", "color": "#3699FF", "marginRight": 8, "cursor": "pointer" }} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
                          DEFINIR FORMA DE PAGAMENTO
                      </span>
                    )

                  })()}
                </div>

              </CardBody>
            </Card>
          </CardGroup>

          <div className="text-right">
            {(() => {
              if (formFormaPagamento.salvo) {

                return (
                  <div>
                    <div style={{
                      width: '165px',
                      marginLeft: 'auto',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <Button variant="success" onClick={() => { handleSubmit('aprovar') }}>
                        Aprovar
                  </Button>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '10px'
                      }}>
                        <Link to={`${url}`}>
                          <Button className="" variant="danger">
                            Cancelar
                     </Button>
                        </Link>
                        <Button variant="primary" onClick={() => { handleSubmit('salvar') }}>
                          {alterar ? 'Alterar' : 'Salvar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              }
            })()}
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}
