import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { Modal, Button, Form, Col, InputGroup } from 'react-bootstrap'
import { useFormik } from "formik";
import * as Yup from "yup";
import { store, index, destroy } from '~/controllers/controller'
import {Table} from 'antd'

import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "~/_metronic/_partials/controls";
import { id } from "date-fns/locale";

export function DentistaPage() {
  const {token} = useSelector((state) => state.auth);
  const {selectedClinic} = useSelector((state) => state.clinic);
  const [ users, setUsers ] = useState([])
  const [ logout, setLogout ] = useState(false)
  const [ redirect, setRedirect ] = useState(false)
  const [show, setShow] = useState(false);
  const [reload, setReload] = useState(false);
  const [id, setId] = useState();
  const [deleted, setDeleted] = useState(false);
  const history = useHistory();
  


  useEffect(() => {
      index(token, `users?cargo=dentista&clinica=${selectedClinic.id}`)
      .then( ({data} ) => {
        setUsers(data)
      }).catch((err)=>{
        if (err.response.status === 401) {
          setLogout(true)
        }
      })
  }, [show, deleted, reload])
  
  function handleDelete(id) {
    destroy(token, 'dentist', id).then(()=>{
      setReload(!reload)
    })
  }
  
  if (logout) {
    return <Redirect to="/logout" />
  }
 
  if (redirect) {
    return <Redirect to={`/dentista/editar/${id}`} />
  }

  const columns = [
    {
      title: 'Nome',
      render: data => <span>{data.firstName + ' ' + data.lastName}</span>
    },
    {
      title: 'CPF',
      dataIndex: 'profile',
      render: data => <span>{data.cpf}</span> 
    },
    {
      title: 'CRO UF',
      dataIndex: 'profile',
      render: data => <span>{data.croUF}</span>
    },
    {
      title: 'N° CRO',
      dataIndex: 'profile',
      render: data => <span>{data.croNumber}</span> 
    },
    {
      title: 'Tel',
      dataIndex: 'profile',
      render: data => <span>{data.tel}</span> 
    },
    {
      title: 'Cor',
      dataIndex: 'profile',
      render: data => <span>{data.scheduleColor}</span> 
    },
    {
      title: 'Ações',
      render: data => <span></span> 
    },
  ]

  return (
    <Card>
      <CardHeader title="Dentistas">
        <CardHeaderToolbar>
          {/* <button
            type="button"
            className="btn btn-primary"
            onClick={() => history.push('/dentista/adicionar')}
          >
            Adicionar dentista
          </button> */}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Table dataSource={users} columns={columns} />
      </CardBody>
    </Card>
  );
}