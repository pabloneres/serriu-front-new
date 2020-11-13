import React, { useState, useEffect } from "react";

import { CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { Card, Accordion, Container, Row, Col, Table, Button, Modal, Form } from "react-bootstrap";
import Select from 'react-select';
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import { indexAprovados, updateAprovado } from '~/app/controllers/orcamentoController';
import { useSelector } from "react-redux";

import { conversorMonetario, formatDate } from '~/app/modules/Util';


export function FichaClinica() {
  const {user: {authToken}} = useSelector((state) => state.auth);
  const { params, url } = useRouteMatch()
  const [orcamentos, setOrcamentos] = useState([])
  const [orcamentos_executados, setOrcamentos_executados] = useState([])
  const [reload, setReload] = useState(false)
  const [modalExecutar, setModalExecutar] = useState(false);
  const [modalData, setModalData] = useState();
  const [data, setData] = useState(formatDate())

  let erro = []

  useEffect(() => {
    indexAprovados(authToken, params.id).then(({data}) => {
      console.log(data)
      // setOrcamentos(data)
      let dados = data.map(item => {
        return {
          ...item, 
          procedimento: JSON.parse(item.procedimento)
        }
      })

      console.log(dados)
     
      const filteredAprovados = dados.filter(item => item.status === 0)
      const filteredExecutados = dados.filter(item => item.status === 1)

      console.log(filteredAprovados)
      console.log(filteredExecutados)


      setOrcamentos_executados(filteredExecutados)
      setOrcamentos(filteredAprovados)

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


  function executarProcedimento(e, orcamento) {
    setModalData(orcamento);

    setModalExecutar(true)
  }

  function handlerFormExecutarProcedimento() {
    console.log(modalData)

    updateAprovado(authToken, modalData.procedimento_id, {...modalData})
      .then(() => {
        setReload(!reload)
        return
      })
      .catch((err) => console.log(err))

      modalClose()
      return
  }

  function modalClose() {
    setModalData(null);
    setModalExecutar(false)
  }

  return (
    <div className="fichaClinica">
      <Modal show={modalExecutar}  >
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
                          onChange={(e)=>{setData(e.target.value)}}
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
                          value={modalData.dentista_nome}
                          onChange={(e)=>{setModalData({...modalData, dentista_nome: e.target.value })}}
                        >

                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Detalhes proxima consulta</Form.Label>
                        <Form.Control
                          onChange={(e)=>{setModalData({...modalData, detalhes: e.target.value })}}
                          type="text"
                          name="proximaConsulta"
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Observação *</Form.Label>
                        <Form.Control
                          onChange={(e)=>{setModalData({...modalData, obs: e.target.value })}}
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
                    <Button variant="primary" onClick={() => {handlerFormExecutarProcedimento()}} >
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

                      <Row style={{marginBottom: 10}}>
                            <Col xs={1}>{orcamento.id}</Col>
                            <Col>{orcamento.procedimento.procedimento}</Col>
                            <Col>Status: {orcamento.aprovado === 1 ? 'Aprovado' : 'Em aberto'}</Col>
                            <Col >
                              Dentes:
                                {' '} 
                                {
                                  orcamento.procedimento.dentes.map(dente => (
                                  <span key={dente.id}>{dente.label}
                                    {dente.faces.map( face => (
                                      <span style={{color: 'red'}}>{face.label}</span>
                                    ))}
                                  {' '}
                                  {' '}
                                  </span>
                                ))}
                            </Col>
                            <Col><Button onClick={(e) => executarProcedimento(e, orcamento)}>Executar</Button> </Col>
                            <Col>Profissional: {orcamento.dentista_nome} </Col>
                         </Row>

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
                  { orcamentos_executados ? 
                    orcamentos_executados.map(item => (
                      <tr>
                      <td>{item.criado_em}</td>
                      <td>
                        {
                          item.procedimento.dentes.map(dente => (
                          <span>{dente.label}
                            {dente.faces.map( face => (
                              <span style={{color: 'red'}}>{face.label}</span>
                            ))}
                          {' '}
                          {' '}
                          </span>
                          ))
                        }
                      </td>
                      <td>{item.procedimento.procedimento}</td>
                      <td>{item.dentista_nome}</td>
                      <td>{item.detalhes}</td>
                      <td>{item.obs}</td>
                      {console.log(item)}
                      </tr>
                    )) : ''
                  }
                </tbody>
              </Table>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  )
}