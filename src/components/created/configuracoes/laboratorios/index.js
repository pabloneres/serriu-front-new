import React, {useEffect, useState} from 'react';

import { Card, Table, Button, Modal, Form, Input, Space, Tooltip } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import { Link, useRouteMatch, Redirect, useHistory } from 'react-router-dom'

import { useSelector } from 'react-redux';

import {index, store, destroy} from '~/controllers/controller'

// import { Container } from './styles';

function Laboratorios() {
  const history = useHistory()
  const { params } = useRouteMatch()
  const {token} = useSelector(state => state.auth)
  const {selectedClinic} = useSelector(state => state.clinic)

  const [laboratorios, setLaboratorios] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [reload, setReload] = useState(false)


  useEffect(() => {
    index(token, `/laboratorio?clinic_id=${selectedClinic.id}`).then(({data}) => {
      setLaboratorios(data)
    })
  }, [reload])

  const columns = [
    {
      title: 'Nome',
      render: data => <Link to={`/laboratorios/${data.id}`} >{data.name}</Link>
    },
    {
      title: 'Ações',
      width: 100,
      render: data => (
        <Space size="middle">
          <Tooltip placement="top" title="Excluir">
            <span onClick={() => {handleDelete(data.id)} }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
              <DeleteOutlined />
            </span>
          </Tooltip>
    
          <Tooltip placement="top" title="Editar">
            <span
              onClick={() => history.push('/laboratorios/' + data.id)}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <EditOutlined />
            </span>
          </Tooltip>
        </Space>
      )
    }
  ]
  
  const AddButton = () => {
    return (
      <>
        <Button type="primary" onClick={() => {setShowModal(true)}} >Adicionar</Button>
      </>
    )
  }
  const handleSubmit = (e) => {
    store(token, '/laboratorio', {...e, clinic_id: selectedClinic.id }).then(({data}) => {
      setShowModal(false)
      setReload(!reload)
    })
  }

  const handleDelete = (e) => {
    destroy(token, '/laboratorio', e).then(({data}) => {
      setShowModal(false)
      setReload(!reload)
    })
  }

  return (
    <>
      <Modal visible={showModal} footer={null}>
        <Card>
          <Form layout="vertical" onFinish={e => handleSubmit(e)}>
            <Form.Item name="name" label="Nome" required>
              <Input/>
            </Form.Item>
            
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
              <Button htmlType="submit" type="primary" style={{marginRight: 10}}>Enviar</Button>
              <Button onClick={() => setShowModal(false)} >Cancelar</Button>
            </div>
          </Form>
        </Card>
      </Modal>
      <Card title="Laboratório" extra={AddButton()} >
        <Table
          columns={columns}
          dataSource={laboratorios}
        />
      </Card>
    </>
  )
}

export default Laboratorios;