import styled from 'styled-components';
import { Upload, Button } from 'antd'

export const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;


export const ContainerTitle = styled.div`

`

export const Title = styled.span`
    font-size: 20px;
`


export const ContainerUpload = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
export const ImageUpload = styled.img`
    width: 100%;
    height: 350px;
    border: 1px solid #c4c4c4;
    margin: 10px 0;
`;
export const UploadButton = styled(Button)`
  
`;
