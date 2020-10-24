import React, {useState,useEffect} from 'react';

import { conversorMonetario } from '~/app/modules/Util';


import { Form, Table, Col, Button,CardGroup } from "react-bootstrap";
import { Card, CardHeader, CardBody,  } from "~/_metronic/_partials/controls";
import { toAbsoluteUrl } from "~/_metronic/_helpers";
import SVG from 'react-inlinesvg'

function SelecaoDentes({listaDentes,procedimento,callback}) {

    const [listaDentesFinalizados,setListaDentesFinalizados] = useState([]);


    const getFacesDente = (numero) =>{

        let result = [ 
            {label : 'V'},
            {label : 'D'},
            {label : 'M'}
        ];
        const facePorQuadrante = {
            0 : {label : 'P'}, 
            1 : {label : 'P'},
            2 : {label : 'L'},
            3 : {label : 'L'},
   
        };
        listaDentes.map((quadrante,key) =>{

            let valueIndex = quadrante.indexOf(numero);

            if(valueIndex >= 0)
            {
                result.push(facePorQuadrante[key]);

                if( key%2 == 0 )
                {
                    if(valueIndex >= quadrante.length -3 && valueIndex <= quadrante.length )
                    {
                        result.push({label : 'I'});
                    }
                    else
                    {
                        result.push({label : 'O '});
                    }
                }
                else
                {
                    if(valueIndex < 3 )
                    {
                        result.push({label : 'I'});
                    }
                    else
                    {
                        result.push({label : 'O'});
                    }
                }
            }
        })
    
        return(result);
    }



    useEffect(() => {

     
        setListaDentesFinalizados([]);
        
    },[listaDentes])

    useEffect(() => {

        if(procedimento.dentes !== undefined)
        {
            setListaDentesFinalizados(procedimento.dentes);
        }
        
    },[procedimento])
    

    useEffect(() => {

     
       callback(listaDentesFinalizados)
        
    },[listaDentesFinalizados])
   

    const listaFaces = [
        {label : 'V'},
        {label : 'D'},
        {label : 'M'},
        {label : 'L'},
        {label : 'O'}
    ];



   
   

    const adicionaDente = (key) =>{

        if(key )
        
        
        key.active = true;

        if(listaDentesFinalizados.indexOf(key) < 0)
        {
          
            setListaDentesFinalizados([...listaDentesFinalizados,key]);
        }
        else
        {
          
            listaDentesFinalizados.splice(listaDentesFinalizados.indexOf(key), 1);
            setListaDentesFinalizados([...listaDentesFinalizados]);

            key.active = false;
        }

       

    }

    const adicionaFaceDente = (e,dente,face) =>{


        

        
       /**/
       e.target.classList.add("ativo")

        console.log(dente);

        if(dente.faces.map(face => face.label).indexOf(face.label) < 0)
        {
            console.log("adicionando");
            dente.faces.push(face);
        }
        else
        {
            console.log("removendo");
            //listaDentesFinalizados.splice(listaDentesFinalizados.indexOf(key), 1);
            //setListaDentesFinalizados([...listaDentesFinalizados]);
            dente.faces.splice(dente.faces.indexOf(face) ,1);
            e.target.classList.remove("ativo")
        }

        //setListaDentesFinalizados([...listaDentesFinalizados]);
       
      

        

    }
    

   

    const getListaDentes = () => {
        let html = "";

        if(listaDentes)
        {
            
            return(
               <>
                {
                    listaDentes.map((row,key) =>{

                        
                      return (
                        <span key={key} className="sessaoDente">
                            {row.map((dente,key) =>{

                            
                                return (
                                    <div key={key} onClick={() => adicionaDente(dente)} className={(dente.active ? 'ativo' : '') + " numero"}  >{dente.label}</div>
                                )
                            })}
                        </span>
                      );
                     
                    })
                }
               </>
               
            )
        }   

        
    }

    const getListaDentesSelecionados = () => {
        let html = "";

        if(listaDentesFinalizados)
        {
            
            html = (
               <>
                {
                    listaDentesFinalizados.map((dente,key) =>{

                      return(
                          <li key={key} className="ativo">
                              
                             

                              <div className="faces">
                              <span className="numeroDenteSelecionado">{dente.label}</span>
                                    {getFacesDente(dente).map((face,key) =>{

                                        return (
                                        <div key={key}  onClick={(e) => adicionaFaceDente(e,dente,face)} className={"face " + (dente.faces.map(face => face.label).indexOf(face.label) >= 0 ? 'ativo'  : '')} >{face.label}</div>
                                        )
                                    })}
                              </div>
                              <span>{conversorMonetario(procedimento.valor)}</span>
                             
                        </li>
                      )
                    })
                }
               </>
               
            )
        }   

        return html;
    }

    
    return (
        <div className="selecaoDentes">
        
        
         <Card>
              <CardHeader title="Adicionar dentes"></CardHeader>
              <CardBody>
              <div className="listaNumeroDentes">
                {getListaDentes()}
              </div>
                
              </CardBody>
          </Card>
          <Card>
              <CardHeader title="Dentes selecionados"></CardHeader>
              <CardBody>

              <ul className="listaDentes">
                {getListaDentesSelecionados()}
              </ul>
                
              </CardBody>
          </Card>
        
    </div>)
}

export default SelecaoDentes;