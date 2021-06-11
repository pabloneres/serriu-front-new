import React, { useState, useEffect } from "react";
import {
  Card
} from "~/_metronic/_partials/controls";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Nav } from 'react-bootstrap'
import { useSelector } from "react-redux";
import { update, show } from "~/controllers/pacienteController";

import Orcamento from "./Orcamento";

export function PacienteMenu(props) {
  const { params, url } = useRouteMatch();
  const { intl } = props;
  const {
    user: { authToken },
  } = useSelector((state) => state.auth);
  const [menu, setMenu] = useState("orcamentos");

  function HandleChangeMenu() {
    const itensMenu = {
      orcamentos: () => <Orcamento />,
    };

    return itensMenu[menu]();
  }

  return (
    <Card>
      <Nav className="mr-auto" variant="tabs">
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
      </Nav>
      <HandleChangeMenu />
    </Card>
  );
}

export default PacienteMenu