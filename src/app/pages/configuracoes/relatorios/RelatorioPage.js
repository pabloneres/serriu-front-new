import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'
import { index } from '~/app/controllers/relatorioController'
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { Modal, Button, Form, Col, InputGroup } from 'react-bootstrap'
import { useFormik } from "formik";
import Select from 'react-select';
import * as Yup from "yup";

import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "~/_metronic/_partials/controls";


export function RelatorioPage() {
  const { params, url } = useRouteMatch()
  const {user: {authToken}} = useSelector((state) => state.auth);
  const [ logout, setLogout ] = useState(false)
  const [reload, setReload] = useState(false);
  const history = useHistory();
  const [ relatorios, setRelatorios ] = useState([])
  
  useEffect(() => {
    index(authToken)
      .then( ({data}) => {
        setRelatorios(data)
      })
      .catch((err)=>{
        if (err.response.status === 401) {
          setLogout(true)
        }
      })
    
  }, [reload])

  if (logout) {
    return <Redirect to="/logout" />
  }


  return (
    <Card>
      <CardHeader title={`Relatório de conexão`}>
      </CardHeader>
      <CardBody>
        <Table 
        striped bordered hover
        style={{marginTop: 10}}
        >
          <thead>
            <tr>
              <th>Maquina</th>
              <th>Dentista</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Ligado em</th>
              <th>Desligado em</th>
            </tr>
          </thead>
          <tbody>
          {relatorios.map( relatorio => (
            <tr key={relatorio.id} >
              <td>{relatorio.id_machine}</td>
              <td>{relatorio.id_operator}</td>
              <td>{relatorio.id_client}</td>
              <td>{relatorio.estado}</td>
              <td>{relatorio.ligado_em}</td>
              <td>{relatorio.desligado_em}</td>
            </tr>
          ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}