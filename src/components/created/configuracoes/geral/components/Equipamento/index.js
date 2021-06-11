import React, {useState, useEffect} from 'react';

import { Container, ContainerBody, Title } from './styles';
import { useSelector, useDispatch } from 'react-redux'

import { index } from '~/controllers/controller'
import { Store, Select } from '~/store/modules/clinic/Clinic.actions'


import Card from './components/Card'

function Equipamento() {
  const {token} = useSelector(state => state.auth)
  const {clinics} = useSelector(state => state.clinic)
  const dispatch = useDispatch()

  useEffect(() => {
    index(token, '/clinic').then(({data}) => {
      dispatch(Store(data))
    })
  }, [])

  const handleClick = (item) => {
    dispatch(Select(item))
  }

  return (
    <Container>
      <Title>Equipamentos</Title>
      <ContainerBody>
        <Card
          name="Equipamento 1"
        />
      </ContainerBody>
    </Container>
  )
}

export default Equipamento;