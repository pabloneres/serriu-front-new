import styled from 'styled-components';

export const Container = styled.div`
  
`;
export const RowForm = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: ${props => props.columns ? `repeat(${props.columns}, 1fr)` : 'repeat(1, 1fr)'};
`;
