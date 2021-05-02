import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import {
  Form,
  Table,
  Col,
  Button,
  CardGroup,
  Modal,
  ButtonToolbar,
  ButtonGroup,
  Alert
} from "react-bootstrap";
import SVG from "react-inlinesvg";

import moment from "moment";
import { format } from "date-fns-tz";

import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  store,
  index,
  update,
  getProcedimentos,
} from "~/app/controllers/orcamentoController";
import { index as indexAll } from "~/app/controllers/controller";
import { conversorMonetario, formatDate } from "~/app/modules/Util";

//COMPONENTES
import ProcedimentoGeral from "./components/formularios/procedimentoGeral";
import ProcedimentoSelecaoDente from "./components/formularios/procedimentoSelecaoDente";

import Select from "react-select";

const options = {
  cobranca: [
    {value: 'total', label: 'Total'},
    {value: 'procedimento', label: 'Procedimento executado'}
  ],
  pagamento: [
    {value: 'dinheiro', label: 'Dinheiro'},
    {value: 'boleto', label: 'Boleto'}
  ],
  condicao: [
    {value: 'vista', label: 'À vista'},
    {value: 'parcelado', label: 'Parcelado'}
  ]
}

function AdicionarOrcamentoPage({ orcamento, alterar }) {
  const {user: { authToken }} = useSelector((state) => state.auth);
  const history = useHistory();
  const { params, url } = useRouteMatch();
  const [tabela, setTabela] = useState();
  const [procedimento, setProcedimento] = useState(undefined);

  const date_now = new Date();
  const data = format(date_now, `dd/MM/yyyy HH:mm:ss`, {
    timeZone: "America/Sao_Paulo",
  });

  const [tabelas, setTabelas] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [dentistas, setDentistas] = useState([]);
  const [dentista, setDentista] = useState([]);
  const [clinicas, setClinicas] = useState([]);
  const [procedimentosFinalizados, setProcedimentosFinalizados] = useState([]);
  const [dadosAPI, setDadosAPI] = useState([]);

  const [modalFormaPagamento, setModalFormaPagamento] = useState(false);

  const [cobranca, setCobranca] = useState({})
  const [pagamento, setPagamento] = useState({})
  const [condicao, setCondicao] = useState({})
  const [entrada, setEntrada] = useState()
  const [parcelas, setParcelas] = useState()
  const [showAlert, setShowAlert] = useState(false)

  const [opcoesPagamento, setOpcoesPagamento] = useState(undefined)

  useEffect(() => {
    if (orcamento !== undefined) {
      console.log(orcamento);
      let procedimentos = JSON.parse(orcamento.procedimento);
      console.log(procedimentos);

      procedimentos.map((row) => {
        row.label = row.procedimento;
        row.habilitado = true;
      });
      setProcedimentosFinalizados(procedimentos);
      setDentista(orcamento.dentista);
    }
  }, [orcamento]);


  const handleSubmitFormaPagamento = (e) => {
    e.preventDefault()

    let opcoesPagamento = {
      cobranca,
      pagamento: cobranca.value === 'procedimento' ? options['pagamento'][0] : pagamento,
      condicao: cobranca.value === 'procedimento' ? options['condicao'][0] : condicao,
      entrada,
      parcelas,
    }
    setOpcoesPagamento(opcoesPagamento)
    setModalFormaPagamento(false);
  };

  useEffect(() => {
    index(authToken)
      .then(({ data }) => {
        console.log(data);
        setDadosAPI(data);
        setTabelas(data.precos);
        setDentistas(data.dentistas);
        setClinicas([data.clinicas]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (tabela !== undefined) {
      getProcedimentos(authToken, tabela)
        .then(({ data }) => {
          console.log(data)
          setProcedimentos(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [tabela]);

  const getDentistaName = (value) => {
    let dentistaName = dentistas.filter((row) => row.dentista_id == value);
    return dentistaName[0] !== undefined ? dentistaName[0].name : "";
  };


  const handlerMudancaTabela = (e) => {
    setProcedimento(undefined);
    setTabela(e.target.value);
  };

  const handlerMudancaDentista = async ({value, label}) => {
    setDentista(value)

    indexAll(authToken, `/configuracao/comissao/${value}`).then(({ data }) => {
      console.log(data)
      
      if (data.comissao_geral === 0.00) {
        setShowAlert(true)
      }
    })

  };

  const handlerMudancaProcedimentos = (procedimento, action) => {
    if (procedimento && procedimento.value)
      setProcedimento({ ...procedimento });
    else setProcedimento(undefined);
  };

  const addProcedimentoFinalizado = (e, proced) => {
    console.log(proced);
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
  };

  const alterarProcedimento = (procedimento) => {
    procedimento.acao = "alterar";
    setProcedimento(procedimento);
  };

  const getTotalProcedimentos = () => {
    let total = 0;
    procedimentosFinalizados.map((row) => {
      total += row.valorTotal;
    });

    return total;
  };

  const exibeFormularioProcedimento = () => {
    let html = "";

    if (procedimento) {
      if (procedimento.geral) {
        html = (
          <ProcedimentoGeral
            onFinish={addProcedimentoFinalizado}
            procedimento={procedimento}
          />
        );
      } else {
        html = (
          <ProcedimentoSelecaoDente
            onFinish={addProcedimentoFinalizado}
            procedimento={procedimento}
            dentista={getDentistaName(dentista)}
          />
        );
      }
    }

    return html;
  };

  const getFacesProcedimentoFormatado = (procedimento) => {
    let strFaces = "";
    procedimento.dentes.map((dente) => {
      strFaces = strFaces.concat(dente.label);

      if (dente.faces !== undefined) {
        dente.faces.map((face) => {
          strFaces = strFaces.concat(face.label);
        });
      }

      strFaces = strFaces.concat(", ");
    });

    strFaces = strFaces.slice(0, -2);

    return strFaces;
  };

  function handleSubmit(type) {
    if (alterar) {
      console.log(orcamento.id);

      if (type === "aprovar") {
        update(authToken, orcamento.id, {
          procedimentos: procedimentosFinalizados,
          dentista,
          paciente_id: params.id,
          formaPagamento: opcoesPagamento,
          status: 1,
        })
          .then(() => {
            return history.push(`${url}`);
          })
          .catch((err) => {
            return;
            // retirar a linha debaixo e retornar o erro
            // setSubmitting(false);
          });
      }

      update(authToken, orcamento.id, {
        procedimentos: procedimentosFinalizados,
        dentista,
        paciente_id: params.id,
        formaPagamento: opcoesPagamento,
      })
        .then(() => {
          return history.push(`${url}`);
        })
        .catch((err) => {
          return;
          // retirar a linha debaixo e retornar o erro
          // setSubmitting(false);
        });

      return;
    }

    if (type === "aprovar") {
      store(authToken, {
        procedimentos: procedimentosFinalizados,
        dentista,
        paciente_id: params.id,
        formaPagamento: opcoesPagamento,
        status: 1,
        valorTotal: getTotalProcedimentos(),
      })
        .then(() => history.push(`${url}`))
        .catch((err) => {
          return;
          // retirar a linha debaixo e retornar o erro
          // setSubmitting(false);
        });
    }

    if (type === "salvar") {
      store(authToken, {
        procedimentos: procedimentosFinalizados,
        dentista,
        paciente_id: params.id,
        formaPagamento: opcoesPagamento,
        valorTotal: getTotalProcedimentos(),
        status: 0
      })
        .then(() => history.push(`${url}`))
        .catch((err) => {
          return;
          // retirar a linha debaixo e retornar o erro
          // setSubmitting(false);
        });
    }
  }
  return (
    <Card>
      <Modal show={showAlert} onHide={() => setShowAlert(false)} centered>
        <Modal.Body>Esse dentista não tem uma comissão configurada, deseja criar ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAlert(false)}>
            Cancelar
          </Button>
          <Link 
            to={{
            pathname: "/dentista/editar/" + dentista,
            state: { rota: 'configComissoes' }
          }}
          >
            <Button variant="primary">
              Criar
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>
      <Modal show={modalFormaPagamento && getTotalProcedimentos() > 0} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Forma de Pagamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitFormaPagamento}>

            <Form.Row className="justify-content-md-center">
              <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Forma de Cobrança</Form.Label>
                <Select
                  required
                  value={cobranca}
                  placeholder="Selecione a forma de cobrança..."
                  options={options['cobranca']}
                  onChange={(value) => {
                    setCobranca(value)
                  }}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row className="justify-content-md-center">
              <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Forma de Pagamento</Form.Label>
                <Select
                  required
                  value={cobranca.value === 'procedimento' ? options['pagamento'][0] : pagamento}
                  isDisabled={cobranca.value === 'procedimento'}
                  placeholder="Selecione a forma de pagamento..."
                  options={options['pagamento']}
                  onChange={(value) => {
                    setPagamento(value)
                  }}
                />
              </Form.Group>
            </Form.Row>
            
            
            <Form.Row className="justify-content-md-center">
              <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Condição de Pagamento</Form.Label>
                <Select
                  required
                  value={pagamento.value === 'boleto' ? options['condicao'][0] : cobranca.value === 'procedimento' ? options['condicao'][0] : condicao}
                  isDisabled={cobranca.value === 'procedimento'}
                  placeholder="Selecione a condição de pagamento..."
                  options={options['condicao']}
                  onChange={(value) => {
                    setCondicao(value)
                  }}
                />
              </Form.Group>
            </Form.Row>

            {(() => {
              if (condicao.value === 'parcelado') {
                return (
                  <Form.Row className="justify-content-md-center">
                     <Form.Group as={Col}>
                      <Form.Label>Valor Entrada</Form.Label>
                      <Form.Control
                        type="number"
                        name="valorEntrada"
                        value={entrada}
                        required
                        onChange={(e) => {
                          setEntrada(e.target.value)
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        Esse campo é necessario!
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Total</Form.Label>
                      <Form.Control
                        type="text"
                        name="valorEntrada"
                        disabled
                        value={conversorMonetario(
                          getTotalProcedimentos()
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        Esse campo é necessario!
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col}>
                      {/*sm={3}*/}
                      <Form.Label>parcelas</Form.Label>
                      <Form.Control
                        as="select"
                        name="parcelas"
                        required
                        onChange={(e) => {
                          setParcelas(e.target.value)
                        }}
                      >
                        {(() =>
                          [...Array(10).keys()].map((row) => {
                            return (
                              <option
                                key={row + 1}
                                value={row + 1}
                              >
                                {" "}
                                {row + 1} X{" "}
                                {conversorMonetario( (getTotalProcedimentos() - entrada) / (row + 1) )}
                              </option>
                            );
                          }))()}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        Esse campo é necessario!
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                );
              }
            })()}

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setModalFormaPagamento(false);
                }}
              >
                Fechar
              </Button>
              <Button variant="primary" type="submit">
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
            {/* LISTAR CLINICAS */}
            {/* <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Clinica *</Form.Label>
              <Form.Control disabled as="select" name="clinica">
                {clinicas.map((row) => {
                  return <option key={row.name}>{row.name}</option>;
                })}
              </Form.Control>
            </Form.Group> */}

            {/* LISTAR DENTISTAS */}

            {/* INSERE A DATA */}
            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Data *</Form.Label>
              <Form.Control disabled type="text" name="data" value={data} />
            </Form.Group>
          </Form.Row>

          {/* LISTA AS TABELAS DE PREÇO */}
          <Form.Row>
            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Tabela *</Form.Label>
              <Form.Control
                as="select"
                name="tabela"
                onChange={(e) => handlerMudancaTabela(e)}
              >
                <option value=""></option>
                {tabelas.map((tabela) => (
                  <option key={tabela.id} value={tabela.value}>
                    {tabela.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form.Row>

          {/* LISTA OS PROCEDIMENTOS */}
          <Form.Row>
            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Procedimentos *</Form.Label>

              <Select
                isClearable={true}
                value={procedimento}
                placeholder="Busque procedimento..."
                options={procedimentos}
                onChange={(value, action) => {
                  handlerMudancaProcedimentos(value, action);
                }}
                isOptionDisabled={procedimentos}
              />
            </Form.Group>
          </Form.Row>

          <CardGroup>
            <Card>
              <CardHeader title="Procedimento"></CardHeader>
              <CardBody>{exibeFormularioProcedimento()}</CardBody>
            </Card>

            <Card className="card-orcamento">
              <CardHeader title="Orçamentos"></CardHeader>
              <CardBody>
                <div className="todosOrcamentos">
                  {procedimentosFinalizados.map((row, key) => {
                    return (
                      <div
                        className={
                          "orcamento " + (!row.habilitado ? "desabilitado" : "")
                        }
                        key={key}
                      >
                        <div className="conteudo">
                          <div className="linha">{row.label}</div>
                          <div className="linha">
                            {getDentistaName(dentista)}
                          </div>
                          <div className="linha">
                            {getFacesProcedimentoFormatado(row)}
                          </div>
                        </div>
                        <div className="total">
                          <p className="texto">
                            {conversorMonetario(row.valorTotal)}
                          </p>

                          <div className="acoes">
                            <span
                              onClick={() => alterarProcedimento(row)}
                              className="svg-icon menu-icon"
                            >
                              <SVG
                                style={{
                                  fill: "#fff",
                                  color: "#fff",
                                  cursor: "pointer",
                                }}
                                src={toAbsoluteUrl(
                                  "/media/svg/icons/Design/create.svg"
                                )}
                              />
                            </span>
                            <span
                              onClick={() => removerProcedimento(key)}
                              className="svg-icon menu-icon"
                            >
                              <SVG
                                style={{
                                  fill: "#fff",
                                  color: "#fff",
                                  marginLeft: 8,
                                  cursor: "pointer",
                                }}
                                src={toAbsoluteUrl(
                                  "/media/svg/icons/Design/delete.svg"
                                )}
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-right">
                  <h2>Total : {conversorMonetario(getTotalProcedimentos())}</h2>
                </div>
                <div className="text-right">
                  {(() => {
                    return (
                      <span
                        onClick={() => setModalFormaPagamento(true)}
                        className="svg-icon menu-icon btn-formapagamento"
                      >
                        <SVG
                          style={{
                            fill: "#3699FF",
                            color: "#3699FF",
                            marginRight: 8,
                            cursor: "pointer",
                          }}
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Design/create.svg"
                          )}
                        />
                        DEFINIR FORMA DE PAGAMENTO
                      </span>
                    );
                  })()}
                </div>
              </CardBody>
            </Card>
          </CardGroup>

          <div className="text-right">
            {(() => {
              if (opcoesPagamento) {
                return (
                  <div>
                    <div
                      style={{
                        width: "165px",
                        marginLeft: "auto",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Button
                        variant="success"
                        onClick={() => {
                          handleSubmit("aprovar");
                        }}
                      >
                        Aprovar
                      </Button>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "10px",
                        }}
                      >
                        <Link to={`${url}`}>
                          <Button className="" variant="danger">
                            Cancelar
                          </Button>
                        </Link>
                        <Button
                          variant="primary"
                          onClick={() => {
                            handleSubmit("salvar");
                          }}
                        >
                          {alterar ? "Alterar" : "Salvar"}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              }
            })()}
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}


export default AdicionarOrcamentoPage