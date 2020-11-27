import React, { useState, useEffect } from "react";

import { CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { Card, Accordion, Container, Row, Col, Table, Button, Modal, Form } from "react-bootstrap";
import Select from 'react-select';
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import { indexAprovados, updateAprovado, indexExecutados } from '~/app/controllers/orcamentoController';
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
      let serialiazed = data.map(item => {
        return {
          ...item,
          dentes: item.dentes.map(item => {
            return {
              ...item,
              faces: JSON.parse(item.faces)
            }
          })
        }
      })

      let dados = []
      serialiazed.forEach(item => {
        if(item.dentes.length > 0) 
        dados.push(item)
      })
      
      console.log(dados)
      setOrcamentos(dados)

    })

    indexExecutados(authToken, params.id).then(({data}) => {
      let serialiazed = data.map(item => {
        return {
          ...item,
          dentes: item.dentes.map(item => {
            return {
              ...item,
              faces: JSON.parse(item.faces)
            }
          })
        }
      })
      
      console.log(serialiazed)
      let dados = []
      serialiazed.forEach(item => {
        if(item.dentes.length > 0) 
        dados.push(item)
      })
      setOrcamentos_executados(serialiazed)

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


  function executarProcedimento(e, orcamento, dente) {
    setModalData([orcamento, dente]);
    console.log([orcamento, dente])

    setModalExecutar(true)
  }

  function handlerFormExecutarProcedimento() {

    updateAprovado(authToken, modalData[1].id, {...modalData})
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
      {console.log(orcamentos_executados)}
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
                        <Col>Profissional: {orcamento.dentistas.name}</Col>
                        <Col>Valor: {conversorMonetario(orcamento.total)}</Col>
                        <Col >Status: {orcamento.aprovado === 1 ? 'Aprovado' : 'Em aberto'}</Col>
                      </Row>
                    </Container>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={orcamento.id}>
                    <Card.Body className="statusProcedimento aberto">
                      <div className="statusProcedimento aberto"> {orcamento.aprovado === 1 ? 'Aprovado' : 'Em aberto'} </div>

                    {orcamento.dentes.map(dente => (
                        <Row style={{marginBottom: 10}}>
                        <Col>Dente {' '} {dente.label}</Col>
                        <Col>{dente.procedimento_nome}</Col>
                        <Col>{orcamento.aprovado === 1 ? <span style={{color: 'green'}}>Aprovado</span> : 'Em aberto'}</Col>
                        <Col >
                          Face:
                            {' '} 
                            {
                              dente.faces ? dente.faces.map(face => (
                                <span style={{color: 'red'}}>{face.label}</span>
                            )): 'Geral'}
                        </Col>
                        <Col>Profissional: {orcamento.dentistas.name} </Col>
                        <Col>Valor: {conversorMonetario(dente.valor)} </Col>
                        <Col><Button onClick={(e) => executarProcedimento(e, orcamento, dente)}>Executar</Button> </Col>
                        </Row>
                    ))}

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
                  { 
                    orcamentos_executados.map(item => (
                      item.dentes.map(dente => (
                        <tr>
                          <td>{item.criado_em}</td>
                          <td>{dente.label}
                          {' '}
                          { 
                            dente.faces ? dente.faces.map(face => (
                              <span style={{color: 'red'}}>{face.label}
                              {' '}
                              </span>
                            )) : 'Geral'
                          }</td>
                          <td>{dente.procedimento_nome}</td>
                          <td>{item.dentistas.name}</td>
                          <td>{dente.detalhes}</td>
                          <td>{dente.obs}</td>

                          {console.log(item)}
                        </tr>
                      ))
                    ))
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