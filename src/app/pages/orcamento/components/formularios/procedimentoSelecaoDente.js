import React,{useState} from 'react';

import { Form, Col, Button, Modal } from "react-bootstrap";
import Select from 'react-select';

import SelecaoDentes from '../SelecaoDentes';

function ProcedimentoSelecaoDente({onFinish, procedimento, dentista}) {

    const numerosPermanetes = [["18","17","16","15","14","13","12","11"],
                               ["21","22","23","24","25","26","27","28"],
                               ["48","47","46","45","44","43","42","41"],
                               ["31","32","33","34","35","36","37","38"]
                               ];

    const numerosDeciduos = [["55","54","53","52","51"],
                             ["61","62","63","64","65"],
                             ["85","84","83","82","81"],
                             ["71","72","73","74","75"]];
    const faces = [
        {value: 0,label: "V"},
        {value: 1,label: "D"},
        {value: 2,label: "M"},
        {value: 3,label: "L"},
        {value: 4,label: "P"},
        {value: 5,label: "O"}
    ];

  

    const [denticao,setDenticao] = useState();
    const [dentes,setDentes] = useState();

    


    var listaDenticoes = [

        { value: '1', label: 'Permanentes', numerosDentes : numerosPermanetes  },
        { value: '2', label: 'Deciduos', numerosDentes : numerosDeciduos  }
    ];

    const handlerMudancaDenticao = (value) =>{

        let novaDenticao = value.numerosDentes.map((dente) => {


            return dente.map(function(numero){
                
                  return {
                      
                      label: numero,
                      faces: []
                  }
              })
             
             
  
        });

        procedimento.denticao = {...novaDenticao};

        console.log(procedimento.denticao);
        setDenticao(novaDenticao)
        


        

        //setDenticao(value.numerosDentes)

    }



    const handlerMudancaDentes = (value) =>{

    
        
        setDentes(value);

    }

    const handlerFinalizaProcedimento = (e) =>{


        procedimento.dentes = dentes;

        
        procedimento.valorTotal = dentes.length * procedimento.valor;

        onFinish(e,procedimento);
       

    }

    useState(()=>{ 

        if(procedimento.dentes === undefined)
            procedimento.dentes = [];


        if(procedimento.denticao !== undefined)
        {
            console.log(procedimento);
            setDenticao(procedimento.denticao);
        }

        

    },[procedimento])




  return (
        <>
            <Form.Row>
                <Form.Group as={Col} controlId="formGridAddress1">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control disabled type="text" name="nome" value={dentista} />
                </Form.Group>
               
        
                <Form.Group as={Col}>
                    <Form.Label>dentição</Form.Label>
                    <Select
                        placeholder="Selecione dentição"
                        options={listaDenticoes}
                        onChange={handlerMudancaDenticao}
                    />

                </Form.Group>
            </Form.Row>

          <SelecaoDentes listaDentes={denticao} procedimento={procedimento} callback={(value) => handlerMudancaDentes(value) } />

         

            <div className="text-right">
           
            <Button variant="primary" onClick={(e) => handlerFinalizaProcedimento(e)}>
                {(()=>{

                   let $nomeBtn = "Adicionar";

                    if(procedimento.acao !== undefined)
                    {
                        if(procedimento.acao == "alterar")
                        {
                            $nomeBtn =  "Alterar";
                        }
                    }

                    return $nomeBtn;

                })()}
            </Button>
            </div>
        </>
  );
}

export default ProcedimentoSelecaoDente;