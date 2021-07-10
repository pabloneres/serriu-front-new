import React from 'react';

import { Container, ContainerHeaderTitle, TitleHeader, ExtraContainer } from './styles';

function Header(props) {
  return (
    <Container>
      {props.title ? 
        <ContainerHeaderTitle>
          <TitleHeader>
            {props.title}
          </TitleHeader>
          {
            props.extra ? 
              <ExtraContainer>
                {props.extra()}
              </ExtraContainer>
            : '' }
        </ContainerHeaderTitle>
      : ''}
    </Container>
  )
}

export default Header;