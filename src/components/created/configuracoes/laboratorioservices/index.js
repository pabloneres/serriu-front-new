import React, {useEffect, useState} from 'react';

import { Card, Table, Button, Modal, Form, Input, Space, Tooltip } from 'antd'

import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import { useSelector } from 'react-redux';
import { Link, useRouteMatch, Redirect, useHistory } from 'react-router-dom'

import {index, store, destroy} from '~/controllers/controller'
import TextFieldsExamplesPage from '../../../../modules/GoogleMaterialExamples/inputs/TextFieldsExamplesPage';

// import { Container } from './styles';

function Laboratorios() {
  const { params } = useRouteMatch()
  const history = useHistory()
  const {token} = useSelector(state => state.auth)
  const {selectedClinic} = useSelector(state => state.clinic)

  const [laboratorios, setLaboratorios] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    index(token, `/laboratorioServicos?laboratorio_id=${params.id}`).then(({data}) => {
      setLaboratorios(data)
    })
  }, [reload])

  const convertMoney = (valor) => {
    return valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
  }

  const columns = [
    {
      title: 'Nome',
      render: data => <span>{data.name}</span>
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      render: data => <span>{convertMoney(data)}</span>
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
    
          {/* <Tooltip placement="top" title="Editar">
            <span
              onClick={() => {}}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <EditOutlined />
            </span>
          </Tooltip> */}
        </Space>
      )
    }
  ]
  
  const AddButton = () => {
    return (
      <>
      <Button style={{marginRight: 10}} onClick={() => history.push('/laboratorios')} type="default" >Voltar</Button>
      <Button type="primary" onClick={() => {setShowModal(true)}} >Adicionar</Button>
      </>
    )
  }

  const handleSubmit = (e) => {
    store(token, '/laboratorioServicos', {...e, laboratorio_id: params.id }).then(({data}) => {
      setShowModal(false)
      setReload(!reload)
    })
  }

  const handleDelete = (e) => {
    destroy(token, '/laboratorioServicos', e).then(({data}) => {
      setShowModal(false)
      setReload(!reload)
    })
  }

  const footer = () => {
    return (
      <>
        <Button style={{marginRight: 10}}>Enviar</Button>
        <Button onClick={() => setShowModal(false)} >Cancelar</Button>
      </>
    )
  }

  return (
    <>
      <Modal visible={showModal} footer={null}>
        <Card>
          <Form layout="vertical" onFinish={e => handleSubmit(e)}>
            <Form.Item name="name" label="Nome" required>
              <Input/>
            </Form.Item>
            <Form.Item name="valor" label="Valor" required>
              <Input prefix="R$"/>
            </Form.Item>
            
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
              <Button htmlType="submit" type="primary" style={{marginRight: 10}}>Enviar</Button>
              <Button onClick={() => setShowModal(false)} >Cancelar</Button>
            </div>
          </Form>
        </Card>
      </Modal>
      <Card title="Serviços" extra={AddButton()} >
        <Table
          columns={columns}
          dataSource={laboratorios}
        />
      </Card>
    </>
  )
}

export default Laboratorios;