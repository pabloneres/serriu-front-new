import React, {useState, useEffect} from 'react';
import { Table } from 'antd'
import { Container, ContainerBody, Title } from './styles';
import { useSelector, useDispatch } from 'react-redux'

import { index } from '~/controllers/controller'
import { Store, Select } from '~/store/modules/clinic/Clinic.actions'


import Card from './components/Card'
import moment from 'moment';

function Equipamento() {
  const {token} = useSelector(state => state.auth)
  const {clinics} = useSelector(state => state.clinic)
  const [equipamentos, setEquipamentos] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    setInterval(() => {
      index(token, '/equipamento').then(({data}) => {
        setEquipamentos(data)
      })
    }, 3000);

  }, [])

  const handleClick = (item) => {
    dispatch(Select(item))
  }

  const columns = [
    {
      title: 'ESP Id',
      dataIndex: 'espid'
    },
    {
      title: 'Status',
      dataIndex: 'status'
    },
    {
      title: 'Ultima conexão',
      dataIndex: 'updated_at'
    },
    {
      title: 'Dentista',
      dataIndex: 'dentista'
    },
    {
      title: 'Paciente',
      dataIndex: 'paciente'
    },
    {
      title: 'Cadeira',
      dataIndex: 'cadeira'
    },
    {
      title: 'Ações',
      dataIndex: 'cadeira'
    },
   
  ]

  return (
    <Container>
      <Title>Equipamentos</Title>
      <ContainerBody>
        <Card
          name="Equipamento 1"
        />
        <Table dataSource={equipamentos} columns={columns} />
      </ContainerBody>
    </Container>
  )
}

export default Equipamento;