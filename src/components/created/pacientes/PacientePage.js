import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'
import { index, destroy } from '~/controllers/controller'
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import { Table, Space, Tooltip } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "~/_metronic/_partials/controls";

export function PacientePage() {
  const {token} = useSelector((state) => state.auth);
  const {selectedClinic} = useSelector((state) => state.clinic);
  const [ patients, setPatients ] = useState([])
  const [ logout, setLogout ] = useState(false)
  const history = useHistory();

  useEffect(() => {
      index(token, `/patient?id=${selectedClinic.id}`)
      .then( ({data}) => {
        setPatients(data)
      }).catch((err)=>{
        if (err.response.status === 401) {
          setLogout(true)
        }
      })
  }, [])

  if (logout) {
    return <Redirect to="/logout" />
  }

  function handleDelete(id) {
    destroy(token, id).then(()=>{
       index(token)
      .then( ({data}) => {
        setPatients(data)
      }).catch((err)=>{
        if (err.response.status === 401) {
          setLogout(true)
        }
      })
    })
  }

  function handleEdit(id) {
    destroy(token, id).then(()=>{
       index(token)
      .then( ({data}) => {
        setPatients(data)
      }).catch((err)=>{
        if (err.response.status === 401) {
          setLogout(true)
        }
      })
    })
  }


  const columns = [
    {
      title: 'Id',
      render: data => <Link to={"/paciente/editar/" + data.id} >{data.id}</Link>
    },
    {
      title: 'Nome',
      render: data => <Link to={"/paciente/editar/" + data.id} >{data.firstName}</Link>
    },
    {
      title: 'Cpf',
      dataIndex: 'cpf'
    },
    {
      title: 'Código',
      dataIndex: 'id_access'
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Celular',
      dataIndex: 'tel'
    },
    {
      title: 'Sexo',
      dataIndex: 'gender'
    },
    {
      title: 'Ações',
      render: data => 
      <Space size="middle">
        <Tooltip placement="top" title="Editar">
          <span
            onClick={() => history.push("/paciente/editar/" + data.id)}
            style={{ cursor: "pointer" }}
            className="svg-icon menu-icon"
          >
            <EditOutlined />
          </span>
        </Tooltip>
        <Tooltip placement="top" title="Excluir">
          <span
            onClick={() => {
              handleDelete(data.id)
            }}
            style={{ cursor: "pointer" }}
            className="svg-icon menu-icon"
          >
            <DeleteOutlined />
          </span>
        </Tooltip>
    </Space>
    },
  ]

  return (
    <Card>
      <CardHeader title="Pacientes">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => history.push("/paciente/adicionar")}
          >
            Adicionar paciente
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar paciente"
          aria-label="Buscar paciente"
          aria-describedby="basic-addon2"
        />  
        <InputGroup.Append>
          <Button variant="outline-secondary">Buscar</Button>
        </InputGroup.Append>
      </InputGroup>
        <Table 
          columns={columns}
          dataSource={patients}
          pagination
        />
      </CardBody>
    </Card>
  );
}