import React,{useState} from 'react';

import { Form, Col, Button, Modal } from "react-bootstrap";
import Select from 'react-select';

function ProcedimentoSelecaoDente({onFinish, procedimento}) {

    const numerosPermanetes = ["11","12","13","14","15","16","17","18","21","22","23","24","25","26","27","28","31","32","33","34","35","36","37","38","41","42","43","44","45","46","47","48"];
    const numerosDeciduos = ["51","52","53","54","55","61","62","63","64","65","71","72","73","74","75","81","82","83","84","85"];
    const faces = [
        {value: 0,label: "V"},
        {value: 1,label: "D"},
        {value: 2,label: "M"},
        {value: 3,label: "L"},
        {value: 4,label: "P"},
        {value: 5,label: "O"}
    ];


    const [denticao,setDenticao] = useState();


    var listaDenticoes = [
        { value: '', label: '---' },
        { value: '1', label: 'Permanentes', numerosDentes : numerosPermanetes  },
        { value: '2', label: 'Deciduos', numerosDentes : numerosDeciduos  }
    ];

    const handlerMudancaDenticao = (value) =>{

        let dentes = value.numerosDentes;

         
        

        setDenticao(dentes.map((row,key) => {

            return {
                value: key,
                label: row
            }

        }))

    }

    const handlerMudancafaces = (value) =>{

        console.log(value);

    }



  return (
        <>
            <Form.Row>
                <Form.Group as={Col} controlId="formGridAddress1">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control disabled type="text" name="nome" value={procedimento.label} />
                </Form.Group>
               
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col}>
                    <Form.Label>dentição</Form.Label>
                    <Select
                        placeholder="Selecione dentição"
                        options={listaDenticoes}
                        onChange={handlerMudancaDenticao}
                    />

                </Form.Group>
            </Form.Row>

          

            <Form.Row>
                <Form.Group as={Col}>
                    <Button variant="primary" onClick={(e) => onFinish(e,procedimento)} block>
                        Adicionar Dente
                    </Button>
                </Form.Group>
            </Form.Row>

            <div className="text-right">
           
            <Button variant="primary" onClick={(e) => onFinish(e,procedimento)}>
                Adicionar
            </Button>
            </div>
        </>
  );
}

export default ProcedimentoSelecaoDente;