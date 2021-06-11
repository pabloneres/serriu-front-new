import { UseSelectStateChangeTypes } from 'downshift';
import React, {useEffect, useState} from 'react';
import { 
  Container,
  AList,
  ListContainer,
  Span,
  AInput
} from './styles';
import { index } from '~/controllers/controller'
import { useSelector } from 'react-redux'

function Geral(props) {
  const { token } = useSelector(state => state.auth)
  const [cargos, setCargos] = useState([])

  useEffect(() => {
    index(token, '/cargo').then(({data}) => {
      setCargos(data)
    })
  }, [])

  return (
    <Container title="Descontos">
      <AList>
        {
          cargos.map(cargo => (
            <AList.Item>
              <ListContainer>
                <Span>{cargo.name}</Span>
                <AInput suffix="%"/>
              </ListContainer>
            </AList.Item>
          ))
        }
      </AList>
    </Container>
  )
}

export default Geral;