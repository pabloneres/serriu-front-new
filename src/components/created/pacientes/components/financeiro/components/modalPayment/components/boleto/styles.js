import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

export const ContainerSide = styled.div`
  
`;

export const ContainerSideBody = styled.div`
  
`;


export const FormRow = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: ${props => props.columns ? `repeat(${props.columns}, 1fr)` : '1fr'};
`;


export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  border-bottom: dashed 1px #c4c4c4;
`;

export const ResumoContainer = styled.div`
  border: 1px solid #c4c4c4;
  padding: 20px;
`;
