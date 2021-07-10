import React, { useState, useEffect } from "react";

import { useHistory, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import { show } from "~/controllers/controller";

import { Dados } from "./components/Dados";
import Upload from "./components/Upload";
import { Orcamentos } from "./components/Orcamentos";
import FichaClinica from "./components/fichaClinica";
import Financeiro from "./components/financeiro/index";

import { Tabs } from 'antd'

const { TabPane } = Tabs

export function EditarPacientePage(props) {
  const { token } = useSelector((state) => state.auth);

  const { params } = useRouteMatch();
  const history = useHistory();

  const [patient, setPatient] = useState({});
  const [key, setKey] = useState("perfil");

  const [reload, setReload] = useState(false)
  const [reloadTab, setReloadTab] = useState(false)

  useEffect(() => {
    show(token, '/patient', params.id)
      .then(({ data }) => {
        setPatient(data);
      })
      .catch((err) => history.push("/pacientes"));
  }, [reload]);

  const ReturnMenu = () => {
    switch (key) {
      case 'perfil':
        return <Dados patient={patient} reloadTab={reloadTab} />
      case 'upload':
        return <Upload />
      case 'orcamentos':
        return <Orcamentos />
      case 'financeiro':
        return <Financeiro reloadTab={reloadTab} />
      case 'fichaClinica':
        return <FichaClinica />
      default:
        return <Dados patient={patient} reloadTab={reloadTab} />
    }
  }

  return (
    <>
      <div style={{ padding: 0, backgroundColor: '#fff' }}>
        <Tabs
          style={{ marginBottom: 0 }}
          activeKey={key}
          onChange={(e) => {
            console.log(e)
            setKey(e)
            setReload(!reload)
            setReloadTab(!reloadTab)
          }} type="card">
          <TabPane tab="Perfil" key="perfil" />
          <TabPane tab="Upload" key="upload" />
          <TabPane tab="Orçamentos" key="orcamentos" />
          <TabPane tab="Financeiro" key="financeiro" />
          <TabPane tab="Ficha Clinica" key="fichaClinica" />
        </Tabs>
      </div>
      <ReturnMenu />
    </>
  );
}