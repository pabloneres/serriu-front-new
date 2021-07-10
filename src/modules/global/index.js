
import { notification } from 'antd'
import styled from 'styled-components';

export const Container = styled.div`
  
`;


export const FormRow = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: ${props => props.columns ? `repeat(${props.columns}, 1fr)` : '1fr'};
`;

export const FormJustify = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed black;
`;

export const Card = styled.div`
  background-color: white;
  padding: 15px;
  width: 100%;
  margin: 20px 0;
  border-radius: 10px;
`;


export const Notify = (type, title, message) => {
  switch (type) {
    case 'error':
      return notification[type]({
        message: title,
        description: message,
        placement: 'bottomRight',
        style: { backgroundColor: '#fff2f0', borderWidth: 1, border: 'solid #ffccc7' }
      });
    case 'success':
      return notification[type]({
        message: title,
        description: message,
        placement: 'bottomRight',
        style: { backgroundColor: '#f6ffed', borderWidth: 1, border: 'solid #b7eb8f' }
      });

    default:
      break;
  }

}