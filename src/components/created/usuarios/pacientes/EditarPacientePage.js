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
import { show } from "~/controllers/controller";

import { Dados } from "./components/Dados";
import Upload from "./components/Upload";
import { Orcamentos } from "./components/Orcamentos";
import { FichaClinica } from "./components/FichaClinica";
import { Financeiro } from "./components/Financeiro";

import { AdicionarOrcamentoPage } from "~/components/created/orcamento/AdicionarOrcamentoPage";

export function EditarPacientePage(props) {
  const {token} = useSelector((state) => state.auth);

  const { params, url } = useRouteMatch();
  const { intl } = props;
  const history = useHistory();

  const [patient, setPatient] = useState({});
  const [user, setUser] = useState({});
  const [ufs, setUfs] = useState([]);
  const [menu, setMenu] = useState("dados");

  useEffect(() => {
    show(token, '/patient', params.id)
      .then(({ data }) => {
        setPatient(data);
      })
      .catch((err) => history.push("/pacientes"));
  }, []);

  function HandleChangeMenu() {
    const itensMenu = {
      dados: () => <Dados />,
      orcamentos: () => <Orcamentos />,
      fichaClinica: () => <FichaClinica />,
      financeiro: () => <Financeiro />,
      upload: () => <Upload />,
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
            Perfil
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setMenu("upload");
            }}
            className={menu == "upload" ? "active" : ""}
          >
            Upload
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
