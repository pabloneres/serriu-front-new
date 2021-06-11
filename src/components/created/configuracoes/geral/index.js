import React from "react";
import {
  Container,
  ATabs,
  ATabPane,
} from "./styles";

import GeralTab from './components/Geral'
import BoletoTab from './components/Boleto'
import EquipamentoTab from './components/Equipamento'

function Geral() {
  return (
    <Container>
      <ATabs type="card" size="middle">
        <ATabPane tab="Geral" key="1">
          <GeralTab/>
        </ATabPane>
        <ATabPane tab="Agenda" key="2">
          <BoletoTab/>
        </ATabPane>
        <ATabPane tab="Boleto" key="3">
          <BoletoTab/>
        </ATabPane>
        <ATabPane tab="Equipamento" key="4">
          <EquipamentoTab/>
        </ATabPane>
        <ATabPane tab="Situação cadastral" key="5">
          <GeralTab/>
        </ATabPane>
        <ATabPane tab="Personalização" key="6">
          <GeralTab/>
        </ATabPane>
      </ATabs>
    </Container>
  )
    
}

export default Geral;
