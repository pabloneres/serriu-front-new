import React, { useState, useEffect } from "react";

import {  CardHeader, CardBody} from "~/_metronic/_partials/controls";
import {Card, Accordion, Container,Row,Col, Table, Button, Modal, Form } from "react-bootstrap";
import Select from 'react-select';

import { conversorMonetario, formatDate } from '~/app/modules/Util';


const data = formatDate();


export function FichaClinica()
{
    const [orcamentos, setOrcamentos] = useState([])
    const [procedimentosExecutados, setProcedimentosExecutados] = useState([])
    const [modalExecutar,setModelExecutar] = useState(false);



    function executarProcedimento(e)
    {
        setModelExecutar(true);
        console.log(e.target.val);
    }

    
    return(
        <div className="fichaClinica">
             <Modal show={modalExecutar}  >
                <Modal.Header closeButton>
                <Modal.Title>Executar procedimento</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                         <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Data *</Form.Label>
                            <Form.Control
                                
                                type="date"
                                name="data"
                                value={data}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Detalhes proxima consulta</Form.Label>
                            <Form.Control
                                
                                as="select"
                                name="clinica"
                            >
                                <option key={0}>ewerton</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Detalhes proxima consulta</Form.Label>
                            <Form.Control
                                
                                type="text"
                                name="proximaConsulta"
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Observação *</Form.Label>
                            <Form.Control
                                
                                type="text"
                                name="observacao"
                             
                            />
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModelExecutar(false)}>
                            Fechar
                        </Button>
                        <Button variant="primary" onClick={() => setModelExecutar(false)}>
                            Salvar
                        </Button>
                    </Modal.Footer>
                </Form>
               
             </Modal>
            <Accordion >
                <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                    Planos de Tratamento Aprovados
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0" className="listaProcedimentos">
                    <Accordion >
                        <Card className="procedimento">
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                                
                                <Container>
                                    <Row>
                                        <Col xs={2}>99/99/9999</Col>
                                        <Col>Profissional: </Col>
                                        <Col>Valor: </Col>
                                        <Col >Status: </Col>
                                    </Row>
                                </Container>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body className="statusProcedimento aberto">
                                    <div className="statusProcedimento aberto">Em Aberto </div>
                                    <Container>
                                        <Row>
                                            <Col xs={1}>1</Col>
                                            <Col>Nome do procedimento</Col>
                                            <Col>Status </Col>
                                            <Col>Dentes: </Col>
                                            <Col><Button onClick={(e) => executarProcedimento(e,1)}>Executar</Button> </Col>
                                            <Col>Profissional: </Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                      
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