import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    padding: 20px;
    border: 1px solid #c4c4c4;
    background-color: #f5f5f5;
    box-shadow: 5px 5px 5px rgba(0,0,0,0.1);
    /* :hover {
        background-color: #d9d9d9;
        cursor: pointer;
    } */
`;

export const HeaderCard = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

export const Title = styled.h2`
    font-size: 1.7rem;
`;


export const Infos = styled.div`

`

export const InfoTitleContainer = styled.div`
    display: flex;
    align-items: center;
`


export const Info = styled.div`
    display: flex;
    justify-content: space-between;
`


export const InfoTitle = styled.span`
    font-size: 1.2rem;
    font-weight: 500;
    margin-left: 10px;
`


export const InfoDescription = styled.span`
    font-size: 1rem;
`

