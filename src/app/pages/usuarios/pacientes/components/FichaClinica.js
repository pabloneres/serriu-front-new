import React, { useState, useEffect } from "react";

import {  CardHeader, CardBody} from "~/_metronic/_partials/controls";
import {Card, Accordion, Container,Row,Col } from "react-bootstrap";

export function FichaClinica()
{
    return(
        <div className="fichaClinica">
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
                                            <Col>Executar: </Col>
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
                        Hello! I'm another body

                    </Card.Body>
                </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    )
}