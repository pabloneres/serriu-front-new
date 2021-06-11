import React from "react";

import { Container, HeaderCard, Title, Infos, Info, InfoTitleContainer, InfoTitle, InfoDescription } from "./styles";

import { DollarOutlined, SmileOutlined, UserOutlined} from '@ant-design/icons'

function Card(props) {
  return (
    <Container onClick={() => props.click()} >
      <HeaderCard>
        <Title>{props.name}</Title>
      </HeaderCard>
      <Infos>
        <Info>
          <InfoTitleContainer>
            <SmileOutlined />
            <InfoTitle>
              Pacientes
            </InfoTitle>
          </InfoTitleContainer>
          <InfoDescription>
            300
          </InfoDescription>
        </Info>
     
        <Info>
          <InfoTitleContainer>
            <UserOutlined />
            <InfoTitle>
              Dentistas
            </InfoTitle>
          </InfoTitleContainer>
          <InfoDescription>
            50
          </InfoDescription>
        </Info>


        <Info>
          <InfoTitleContainer>
            <DollarOutlined/>
            <InfoTitle>
              Faturamento / Ultimo mês
            </InfoTitle>
          </InfoTitleContainer>
          <InfoDescription>
            R$ 84.541,00
          </InfoDescription>
        </Info>

      </Infos>
    </Container>
  );
}

export default Card;
