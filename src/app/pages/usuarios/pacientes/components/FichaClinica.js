import React, { useState, useEffect } from "react";

import { CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { Card, Accordion, Container, Row, Col, Table, Button, Modal, Form } from "react-bootstrap";
import Select from 'react-select';
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import { indexAprovados } from '~/app/controllers/orcamentoController';
import { useSelector } from "react-redux";

import { conversorMonetario, formatDate } from '~/app/modules/Util';


const data = formatDate();


export function FichaClinica() {
  const {user: {authToken}} = useSelector((state) => state.auth);
  const { params, url } = useRouteMatch()
  const [orcamentos, setOrcamentos] = useState([])
  const [reload, serReload] = useState(false)
  const [procedimentosExecutados, setProcedimentosExecutados] = useState([])
  const [modalExecutar, setModelExecutar] = useState(false);



  useEffect(() => {
    indexAprovados(authToken, params.id).then(({data}) => {
      console.log(data)
      setOrcamentos(data)
    })

  }, [reload]);


  const getFacesProcedimentoFormatado = (procedimento) => {
    let strFaces = '';
    procedimento.dentes.map(dente => {

      strFaces = strFaces.concat(dente.label);

      if (dente.faces !== undefined) {
        dente.faces.map(face => {

          strFaces = strFaces.concat(face);

        })
      }

      strFaces = strFaces.concat(', ');

    })

    strFaces = strFaces.slice(0, -2);

    return strFaces;

  }


  function executarProcedimento(e, orcamento, procedimento) {
    setModelExecutar({
      orcamento: orcamento,
      procedimento: procedimento,
    });

  }

  function handlerFormExecutarProcedimento(e) {
    e.preventDefault();
    setModelExecutar(false);
  }


  return (
    <div className="fichaClinica">
      <Modal show={modalExecutar}  >
        <Modal.Header closeButton>
          <Modal.Title>Executar procedimento</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlerFormExecutarProcedimento}>
          {(() => {

            if (modalExecutar) {
              console.log(modalExecutar.orcamento.profissional);
              return (
                <>
                  <Modal.Body>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Data *</Form.Label>
                        <Form.Control

                          type="date"
                          name="data"
                          value={data}
                        />
                      </Form.Group>
                    </Form.Row>
                    {/* <Form.Row>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control
                          disabled
                          type="text"
                          name="data"
                          value={modalExecutar.procedimento.tipo}

                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>dente</Form.Label>
                        <Form.Control
                          disabled
                          type="text"
                          name="data"
                          value={modalExecutar.procedimento.dentes[0].label}
                        />
                      </Form.Group>
                    </Form.Row> */}
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Profissional</Form.Label>
                        <Form.Control
                          disabled
                          type="text"
                          name="clinica"
                          value={modalExecutar.orcamento.dentista_nome}
                        >

                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Detalhes proxima consulta</Form.Label>
                        <Form.Control

                          type="text"
                          name="proximaConsulta"
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Observação *</Form.Label>
                        <Form.Control

                          type="text"
                          name="observacao"

                        />
                      </Form.Group>
                    </Form.Row>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModelExecutar(false)}>
                      Fechar
                                        </Button>
                    <Button variant="primary" type="submit">
                      Salvar
                                        </Button>
                  </Modal.Footer>
                </>
              )
            }

          })()}
        </Form>

      </Modal>
      <Accordion >
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            Planos de Tratamento Aprovados
                </Accordion.Toggle>
          <Accordion.Collapse eventKey="0" className="listaProcedimentos">
            <Accordion >
              { orcamentos ?
                orcamentos.map(orcamento => (
                  <Card className="procedimento" key={orcamento.id}>
                  <Accordion.Toggle as={Card.Header} eventKey={orcamento.id}>
                    <Container>
                        <Row>
                        <Col xs={2}>{orcamento.criado_em}</Col>
                        <Col>Profissional: {orcamento.dentista_nome}</Col>
                        <Col>Valor: {conversorMonetario(orcamento.total)}</Col>
                        <Col >Status: {orcamento.aprovado === 1 ? 'Aprovado' : 'Em aberto'}</Col>
                      </Row>
                    </Container>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={orcamento.id}>
                    <Card.Body className="statusProcedimento aberto">
                      <div className="statusProcedimento aberto"> {orcamento.aprovado === 1 ? 'Aprovado' : 'Em aberto'} </div>

                      {orcamento.procedimento.map((procedimento, key) => {
                        return (
                          <Row style={{marginBottom: 10}} key={key}>
                            <Col xs={1}>{key + 1}</Col>
                            <Col>{procedimento.procedimento}</Col>
                            <Col>Status: {orcamento.aprovado === 1 ? 'Aprovado' : 'Em aberto'}</Col>
                            <Col >
                              Dentes:
                                {' '} 
                                {
                                  procedimento.dentes.map(dente => (
                                  <span key={dente.id}>{dente.label}
                                    {dente.faces.map( face => (
                                      <span style={{color: 'red'}}>{face.label}</span>
                                    ))}
                                  {' '}
                                  {' '}
                                  </span>
                                ))}
                            </Col>
                            <Col><Button onClick={(e) => executarProcedimento(e, orcamento, procedimento)}>Executar</Button> </Col>
                            <Col>Profissional: {orcamento.dentista_nome} </Col>
                          </Row>
                        )
                      })}

                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                )) : ''
              }
            </Accordion>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <Accordion >
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
                    <th>Detalhes Próx. Consulta</th>
                    <th>Obs</th>

                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>Thornton</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td colSpan="4">Larry the Bird</td>
                    <td>@twitter</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  )
}