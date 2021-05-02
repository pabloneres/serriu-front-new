import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
} from "~/_metronic/_partials/controls";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Form, Col, Button, Navbar, Nav } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { update, show } from "~/app/controllers/pacienteController";

import Comissoes from "./Comissoes";
import Recebidos from "./Recebidos";

function Financeiro(props) {
  const { params, url } = useRouteMatch();
  const { intl } = props;
  const {
    user: { authToken, dentists }
  } = useSelector(state => state.auth);
  const id = dentists[0].id
  const history = useHistory();

  const [patient, setPatient] = useState({});
  const [user, setUser] = useState({});
  const [ufs, setUfs] = useState([]);
  const [menu, setMenu] = useState("comissoes");

  useEffect(() => {
    if (props.location.state) {
      setMenu(props.location.state.rota)
    }

    show(authToken, params.id)
      .then(({ data }) => {
        setPatient(data[0]);
      })
      .catch((err) => history.push("/pacientes"));
  }, []);


  function HandleChangeMenu() {
    const itensMenu = { 
      comissoes: () => <Comissoes id={id} />,
      recebidos: () => <Recebidos id={id} />,
    }
    return itensMenu[menu]();
  }

 

  return (
    <Card>
      <Nav className="mr-auto" variant="tabs">

        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setMenu("comissoes");
            }}
            className={menu == "comissoes" ? "active" : ""}
          >
            Comissões
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setMenu("recebidos");
            }}
            className={menu == "recebidos" ? "active" : ""}
          >
            Recebidos
          </Nav.Link>
        </Nav.Item>

      </Nav>
      <HandleChangeMenu />
    </Card>
  );
}


export default Financeiro