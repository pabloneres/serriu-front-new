import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns ? `repeat(${props.columns}, 1fr)` : '1fr'};
  gap: 20px;
`;

export const ContainerSide = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ContainerSideBody = styled.div`
  
`;


export const ContainerFormRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export const FormRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export const EspecialidadeContainer = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
`;

export const EspecialidadeRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
`;
