import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
} from "../../../../_metronic/_partials/controls";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Form, Col, Button, Navbar, Nav } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { update, show } from "~/app/controllers/pacienteController";

import { Dados } from "./components/Dados";
import { Orcamentos } from "./components/Orcamentos";
import { FichaClinica } from "./components/FichaClinica";
import { Financeiro } from "./components/Financeiro";

import { AdicionarOrcamentoPage } from "~/app/pages/orcamento/AdicionarOrcamentoPage";

export function EditarPacientePage(props) {
  const { params, url } = useRouteMatch();
  const { intl } = props;
  const {
    user: { authToken },
  } = useSelector((state) => state.auth);
  const history = useHistory();

  const [patient, setPatient] = useState({});
  const [user, setUser] = useState({});
  const [ufs, setUfs] = useState([]);
  const [menu, setMenu] = useState("dados");

  useEffect(() => {
    show(authToken, params.id)
      .then(({ data }) => {
        setPatient(data[0]);
      })
      .catch((err) => history.push("/pacientes"));
  }, []);

  function HandleChangeMenu() {
    const itensMenu = {
      dados: () => <Dados />,
      orcamentos: () => <Orcamentos />,
      fichaClinica: () => <FichaClinica />,
      financeiro: () => <Financeiro />,
    };

    return itensMenu[menu]();
  }

  return (
    <Card>
      <Nav className="mr-auto" variant="tabs">
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setMenu("dados");
            }}
            className={menu == "dados" ? "active" : ""}
          >
            Dados
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setMenu("orcamentos");
            }}
            className={menu == "orcamentos" ? "active" : ""}
          >
            Orçamentos
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setMenu("financeiro");
            }}
            className={menu == "financeiro" ? "active" : ""}
          >
            Financeiro
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setMenu("fichaClinica");
            }}
            className={menu == "fichaClinica" ? "active" : ""}
          >
            Ficha Clinica
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <HandleChangeMenu />
    </Card>
  );
}
