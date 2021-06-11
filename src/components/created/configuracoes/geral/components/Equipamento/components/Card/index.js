import React, {useState, useEffect} from "react";

import { Container, HeaderCard, Title, Infos, Info, InfoTitleContainer, InfoTitle, InfoDescription } from "./styles";
import { Button, Input, } from 'antd'

import {store} from '~/controllers/controller'
import { useSelector } from 'react-redux'

import { DollarOutlined, SmileOutlined, UserOutlined} from '@ant-design/icons'

function Card(props) {
  const { token } = useSelector(state => state.auth)
  const [status, setStatus] = useState('')
  const [code, setCode] = useState()
  const [rota, setRota] = useState()

  const { TextArea } = Input

  useEffect(() => {

  }, [])


  const handleLigar = () => {
    store(token, '/mqtt', {rota, message: code}).then(({data}) => {

    })
  }

  return (
    <Container>
      <HeaderCard>
        <Title>{props.name}</Title>
      </HeaderCard>
      <Infos>
        <InfoTitle>Status:</InfoTitle>
        <InfoDescription>1</InfoDescription>
      </Infos>
      <Input value={rota} placeholder="Rota" onChange={e => setRota(e.target.value)}></Input>
      <TextArea value={code} onChange={(e) => setCode(e.target.value)}></TextArea>
      <Button onClick={() => {handleLigar()}} type="primary">Enviar</Button>
      <code></code>
    </Container>
  );
}

export default Card;
