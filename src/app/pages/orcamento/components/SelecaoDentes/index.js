import React, {useState,useEffect} from 'react';



import { Form, Table, Col, Button,CardGroup } from "react-bootstrap";
import { Card, CardHeader, CardBody,  } from "~/_metronic/_partials/controls";
import { toAbsoluteUrl } from "~/_metronic/_helpers";
import SVG from 'react-inlinesvg'

function SelecaoDentes({listaDentes,procedimento,callback}) {

    const [listaDentesFinalizados,setListaDentesFinalizados] = useState([]);

   

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


    const getFacesDente = (dente) => {

        /**
         * Do 14 ao 18 e do 24 ao 28 e vdmpo 
         * Do 34 ao 38 e do 44 ao 48 é vdmlo
         * Do 11 ao 13 e do 21 ao 23   vdmip
         * Do 31 ao 33 e do 41 ao 43 é VDMIL
         * 
         * */

    }
   
   

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
                              <span>{dente.label}</span>
                              <span>{procedimento.label}</span>

                              <div className="faces">
                                    {listaFaces.map((face,key) =>{


                                      
                                      

                                        
                                        return (
                                        <div key={key}  onClick={(e) => adicionaFaceDente(e,dente,face)} className={"face " + (dente.faces.map(face => face.label).indexOf(face.label) >= 0 ? 'ativo'  : '')} >{face.label}</div>
                                        )
                                    })}
                              </div>
                             
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
        <>
        
        
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
        
    </>)
}

export default SelecaoDentes;