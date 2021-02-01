import React, { useState, useEffect } from "react";
import { CardHeader, CardBody } from "~/_metronic/_partials/controls";
import {
  Card,
  Accordion,
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import Select from "react-select";
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import {
  indexAprovados,
  updateAprovado,
  indexExecutados,
} from "~/app/controllers/orcamentoController";
import { useSelector } from "react-redux";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { conversorMonetario, formatDate } from "~/app/modules/Util";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export function FichaClinica() {
  const classes = useStyles();
  const {user: { authToken }} = useSelector((state) => state.auth);
  const { params, url } = useRouteMatch();
  const [orcamentos, setOrcamentos] = useState([]);
  const [orcamentos_executados, setOrcamentos_executados] = useState([]);
  const [reload, setReload] = useState(false);
  const [modalData, setModalData] = useState();

  const [data, setData] = useState();
  const [hora, setHora] = useState();

  const [modalExecutar, setModalExecutar] = useState(false);
  const [modalAgendamento, setModalAgendamento] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  let erro = [];

  useEffect(() => {
    indexAprovados(authToken, params.id).then(({ data }) => {
      let serialiazed = data.map((item) => {
        return {
          ...item,
          procedimentos_orcamentos: item.procedimentos_orcamentos.map(
            (item) => {
              return {
                ...item,
                faces: JSON.parse(item.faces),
              };
            }
          ),
        };
      });

      let dados = [];
      serialiazed.forEach((item) => {
        if (item.procedimentos_orcamentos.length > 0) dados.push(item);
      });

      console.log(dados);
      setOrcamentos(dados);
    });

    indexExecutados(authToken, params.id).then(({ data }) => {
      let serialiazed = data.map((item) => {
        return {
          ...item,
          procedimentos_orcamentos: item.procedimentos_orcamentos.map(
            (item) => {
              return {
                ...item,
                faces: JSON.parse(item.faces),
              };
            }
          ),
        };
      });

      console.log(serialiazed);
      let dados = [];
      serialiazed.forEach((item) => {
        if (item.procedimentos_orcamentos.length > 0) dados.push(item);
      });
      setOrcamentos_executados(serialiazed);
    });
  }, [reload]);

  const getFacesProcedimentoFormatado = (procedimento) => {
    let strFaces = "";
    procedimento.dentes.map((dente) => {
      strFaces = strFaces.concat(dente.label);

      if (dente.faces !== undefined) {
        dente.faces.map((face) => {
          strFaces = strFaces.concat(face);
        });
      }

      strFaces = strFaces.concat(", ");
    });

    strFaces = strFaces.slice(0, -2);

    return strFaces;
  };

  function executarProcedimento(e, orcamento, dente) {
    setModalData([orcamento, dente]);
    setModalExecutar(true);
  }

  function handleAgendamento(e, orcamento, dente) {
    setModalData([orcamento, dente]);
    setModalAgendamento(true);
  }

  function handlerFormExecutarProcedimento() {
    updateAprovado(authToken, modalData[1].id, { ...modalData })
      .then(() => {
        setReload(!reload);
        return;
      })
      .catch((err) => console.log(err));

    modalClose();
    return;
  }

  function modalClose() {
    setModalData(null);
    setModalExecutar(false);
  }

  function ReturnStatus(status) {
    switch (status) {
      case 0:
        return <strong style={{ color: "red" }}>Salvo</strong>;
      case 1:
        return <strong style={{ color: "green" }}>Aprovado</strong>;
      case 2:
        return <strong style={{ color: "orange" }}>Em andamento</strong>;
      case 3:
        return <strong style={{ color: "blue" }}>Executado</strong>;
    }
  }

  function ReturnStatusProcedimento(status) {
    switch (status) {
      case 0:
        return <strong style={{ color: "red" }}>Salvo</strong>;
      case 1:
        return <strong style={{ color: "green" }}>Executado</strong>;
    }
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="fichaClinica">
      <Modal show={modalExecutar}>
        <Modal.Header closeButton>
          <Modal.Title>Executar procedimento</Modal.Title>
        </Modal.Header>
        <Form>
          {(() => {
            if (modalData) {
              return (
                <>
                  <Modal.Body>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Data *</Form.Label>
                        <Form.Control
                          onChange={(e) => {
                            setData(e.target.value);
                          }}
                          type="date"
                          name="data"
                          value={data}
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control
                          disabled
                          type="text"
                          name="data"
                          value={modalData[1].procedimento_nome}
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Dente</Form.Label>
                        <Form.Control
                          disabled
                          type="text"
                          name="data"
                          value={modalData[1].label}
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Profissional</Form.Label>
                        <Form.Control
                          disabled
                          type="text"
                          name="clinica"
                          value={modalData[0].dentistas.name}
                          onChange={(e) => {
                            setModalData({
                              ...modalData,
                              dentista_nome: e.target.value,
                            });
                          }}
                        ></Form.Control>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Detalhes proxima consulta</Form.Label>
                        <Form.Control
                          onChange={(e) => {
                            setModalData({
                              ...modalData,
                              detalhes: e.target.value,
                            });
                          }}
                          type="text"
                          name="proximaConsulta"
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Observação *</Form.Label>
                        <Form.Control
                          onChange={(e) => {
                            setModalData({ ...modalData, obs: e.target.value });
                          }}
                          type="text"
                          name="observacao"
                        />
                      </Form.Group>
                    </Form.Row>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => modalClose()}>
                      Fechar
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        handlerFormExecutarProcedimento();
                      }}
                    >
                      Salvar
                    </Button>
                  </Modal.Footer>
                </>
              );
            }
          })()}
        </Form>
      </Modal>


      <Modal show={modalAgendamento}>
        <Modal.Header closeButton>
          <Modal.Title>Agendar Procedimento</Modal.Title>
        </Modal.Header>
        <Form>
          {(() => {
            if (modalData) {
              return (
                <>               
                  <Modal.Body>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Data *</Form.Label>
                        <Form.Control
                          onChange={(e) => {
                            setData(e.target.value);
                          }}
                          type="date"
                          name="data"
                          value={data}
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Hora *</Form.Label>
                        <Form.Control
                          onChange={(e) => {
                            setHora(e.target.value);
                          }}
                          type="time"
                          name="data"
                          value={hora}
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Profissional</Form.Label>
                        <Form.Control
                          disabled
                          type="text"
                          name="clinica"
                          value={modalData[0].dentistas.name}
                          onChange={(e) => {
                            setModalData({
                              ...modalData,
                              dentista_nome: e.target.value,
                            });
                          }}
                        ></Form.Control>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Detalhes para consulta</Form.Label>
                        <Form.Control
                          onChange={(e) => {
                            setModalData({
                              ...modalData,
                              detalhes: e.target.value,
                            });
                          }}
                          type="text"
                          name="proximaConsulta"
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Observação *</Form.Label>
                        <Form.Control
                          onChange={(e) => {
                            setModalData({ ...modalData, obs: e.target.value });
                          }}
                          type="text"
                          name="observacao"
                        />
                      </Form.Group>
                    </Form.Row>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalAgendamento(false)}>
                      Fechar
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        handlerFormExecutarProcedimento();
                      }}
                    >
                      Salvar
                    </Button>
                  </Modal.Footer>
                </>
              );
            }
          })()}
        </Form>
      </Modal>


      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            Planos de Tratamento Aprovados
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0" className="listaProcedimentos">
            <Accordion>
              {orcamentos
                ? orcamentos.map((orcamento) => (
                    <Card className="procedimento" key={orcamento.id}>
                      <Accordion.Toggle
                        as={Card.Header}
                        eventKey={orcamento.id}
                      >
                        <Container>
                          <Row>
                            <Col xs={2}>{orcamento.criado_em}</Col>
                            <Col>Profissional: {orcamento.dentistas.name}</Col>
                            <Col>
                              Valor: {conversorMonetario(orcamento.total)}
                            </Col>
                            <Col>Status: {ReturnStatus(orcamento.status)}</Col>
                          </Row>
                        </Container>
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey={orcamento.id}>
                        <Card.Body className="statusProcedimento aberto">
                          <div
                            style={{ backgroundColor: "whitesmoke" }}
                            className="statusProcedimento aberto"
                          >
                            {ReturnStatus(orcamento.status)}
                          </div>

                          {orcamento.procedimentos_orcamentos.map((dente) => (
                            <Row style={{ marginBottom: 15 }}>
                              <Col>Dente {dente.label}</Col>
                              <Col>{dente.procedimento_nome}</Col>
                              <Col>
                                Face:{" "}
                                {dente.faces
                                  ? dente.faces.map((face) => (
                                      <span style={{ color: "red" }}>
                                        {face.label}
                                      </span>
                                    ))
                                  : "Geral"}
                              </Col>
                              <Col>
                                Profissional: {orcamento.dentistas.name}{" "}
                              </Col>
                              <Col>
                                Valor: {conversorMonetario(dente.valor)}{" "}
                              </Col>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <Col>
                                  <Button
                                    size="sm"
                                    onClick={(e) =>
                                      executarProcedimento(e, orcamento, dente)
                                    }
                                  >
                                    Executar
                                  </Button>
                                </Col>
                                <Col>
                                  <Button
                                    size="sm"
                                    variant="success"
                                    onClick={(e) =>
                                      handleAgendamento(e, orcamento, dente)
                                    }
                                  >
                                    Agendar
                                  </Button>{" "}
                                </Col>
                              </div>
                            </Row>
                          ))}
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  ))
                : ""}
            </Accordion>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="1">
            Ficha Clinica
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Dente</th>
                    <th>Procedimentos Executados</th>
                    <th>Profissional</th>
                    <th>Status</th>
                    <th>Detalhes Próx. Consulta</th>
                    <th>Obs</th>
                  </tr>
                </thead>
                <tbody>
                  {orcamentos_executados.map((item) =>
                    item.procedimentos_orcamentos.map((dente) => (
                      <tr>
                        <td>{item.criado_em}</td>
                        <td>
                          {dente.label}{" "}
                          {dente.faces
                            ? dente.faces.map((face) => (
                                <span style={{ color: "red" }}>
                                  {face.label}{" "}
                                </span>
                              ))
                            : "Geral"}
                        </td>
                        <td>{dente.procedimento_nome}</td>
                        <td>{item.dentistas.name}</td>
                        <td>{ReturnStatusProcedimento(dente.status)}</td>
                        <td>{dente.detalhes}</td>
                        <td>{dente.obs}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}
