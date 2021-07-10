import React, {useEffect, useState} from 'react';
import {index} from '~/controllers/controller'
import { useSelector } from 'react-redux'
import {
  Table,
  Card,
  Checkbox,
  Modal,
  Button
} from 'antd'

function Permissions(props) {
  const {token} = useSelector(store => store.auth)
  const [cargos, setCargos] = useState([])
  const [roles, setRoles] = useState([])
  const [departmentRoles, setDepartmentRoles] = useState([])
  const [editDepartment, setEditDepartment] = useState({})

  useEffect(() => {
    index(token, '/department').then(({data}) => {
      setCargos(data)
    })
    index(token, '/roles').then(({data}) => {
      setRoles(data)
    })
    index(token, '/departmentRoles').then(({data}) => {
      setDepartmentRoles(data)
    })
  }, [])
  
  const columnsPermissions = [
    {
      title: 'Cargo',
      dataIndex: 'name'
    },
    {
      title: 'Visualizar',
      dataIndex: 'view',
      render: data => <span><Checkbox/></span>
    },
    {
      title: 'Criar',
      dataIndex: 'add',
      render: data => <span><Checkbox/></span>
    },
    {
      title: 'Editar',
      dataIndex: 'edit',
      render: data => <span><Checkbox/></span>
    },
    {
      title: 'Deletar',
      dataIndex: 'delete',
      render: data => <span><Checkbox/></span>
    },
    // {
    //   title: 'Ação',
    //   render: data => <span>Deletar</span>
    // }
  ]

  const returnView = () => {
    return (
      <Button type="primary" onClick={() => props.returnView()}>Voltar</Button>
    )
  }

  return (
    <Card title={"Permissões de " + props.data.name} extra={returnView()} >
      <Table
        dataSource={roles}
        columns={columnsPermissions}
      />
    </Card>
  )
}

export default Permissions;