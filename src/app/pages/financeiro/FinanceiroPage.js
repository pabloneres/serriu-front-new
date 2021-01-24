import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody} from "~/_metronic/_partials/controls";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { Form, Col, Button, Navbar, Nav  } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import * as Yup from "yup";
import { useSelector } from "react-redux";

import { Receber } from './components/Receber'
import { Recebidos } from './components/Recebidos'
import { Orcamentos } from './components/Orcamentos'
import { FichaClinica } from './components/FichaClinica'


export function FinanceiroPage(props) {
  const { params, url } = useRouteMatch()
  const { intl } = props;
  const { user: { authToken } } = useSelector((state) => state.auth);
  const history = useHistory();
  
  const [menu, setMenu] = useState('receber')


  function HandleChangeMenu() {
    const itensMenu = {
      'receber': () => <Receber/>,
      'recebidos': () => <Recebidos/>,
      'orcamentos': () => <Orcamentos/>,
      'fichaClinica': () => <FichaClinica/>
    }
    return itensMenu[menu]();
  }
  
  return (
    <Card>
      <Nav className="mr-auto" variant="tabs">
        <Nav.Item>
          <Nav.Link onClick={()=> { setMenu('receber') }} className={menu == 'receber' ? 'active' : ''} >A receber</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={()=> { setMenu('recebidos') }} className={menu == 'recebidos' ? 'active' : ''} >Recebidos</Nav.Link>
        </Nav.Item>
        {/* <Nav.Item>
          <Nav.Link onClick={()=> { setMenu('orcamentos') }}className={menu == 'orcamentos' ? 'active' : ''}  >Orçamentos</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={()=> { setMenu('fichaClinica') }}  className={menu == 'fichaClinica' ? 'active' : ''} >Ficha Clinica</Nav.Link>
        </Nav.Item> */}
      </Nav>
      <HandleChangeMenu/>
    </Card>
  );
}
