import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";


import { ClinicasPage } from "~/app/pages/clinicas/ClinicaPage";
import { AdicionarClinicaPage } from "~/app/pages/clinicas/AdicionarClinicaPage";
import { EditarClinicaPage } from "~/app/pages/clinicas/EditarClinicaPage";
import { MyPage } from "~/app/pages/MyPage";
import { DashboardPage } from "~/app/pages/DashboardPage";

import { AgendaPage } from "~/app/pages/agenda/AgendaPage";
import { FinanceiroPage } from "~/app/pages/financeiro/FinanceiroPage";
import { UsuariosPage } from "~/app/pages/usuarios/UsuariosPage";
import { ConfiguracoesPage } from "~/app/pages/configuracoes/ConfiguracoesPage";

import { DentistaPage } from '~/app/pages/usuarios/dentistas/DentistaPage'
import { AdicionarDentistaPage } from '~/app/pages/usuarios/dentistas/AdicionarDentistaPage'

import { PacientePage } from '~/app/pages/usuarios/pacientes/PacientePage'
import { AdicionarPacientePage } from '~/app/pages/usuarios/pacientes/AdicionarPacientePage'

import { RecepcionistaPage } from '~/app/pages/usuarios/recepcionistas/RecepcionistaPage'
import { AdicionarRecepcionistaPage } from '~/app/pages/usuarios/recepcionistas/AdicionarRecepcionistaPage'

import { TabelaPreco } from '~/app/pages/configuracoes/tabelaPreco/TabelaPreco'
import { TabelaProcedimento } from '~/app/pages/configuracoes/tabelaProcedimento/TabelaProcedimento'



const GoogleMaterialPage = lazy(() =>
  import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
);
const ECommercePage = lazy(() =>
  import("./modules/ECommerce/pages/eCommercePage")
);

export default function BasePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <ContentRoute path="/dashboard" component={DashboardPage} />
        <ContentRoute exact path="/clinicas" component={ClinicasPage} />
        <ContentRoute exact path="/clinicas/adicionar" component={AdicionarClinicaPage} />
        <ContentRoute exact path="/clinicas/editar" component={EditarClinicaPage} />


        {/* Rotas de clinicas */}
        <ContentRoute exact path="/agenda" component={AgendaPage} />
        <ContentRoute exact path="/pacientes" component={PacientePage} />
        <ContentRoute exact path="/financeiro" component={FinanceiroPage} />
        <ContentRoute exact path="/usuarios" component={UsuariosPage} />
        <ContentRoute exact path="/configuracoes" component={ConfiguracoesPage} />
        
        {/* SUBMENU Rotas de Usuarios */}
        <ContentRoute exact path="/dentista" component={DentistaPage} />
        <ContentRoute exact path="/dentista/adicionar" component={AdicionarDentistaPage} />
      
      
        <ContentRoute exact path="/paciente" component={PacientePage} />
        <ContentRoute exact path="/paciente/adicionar" component={AdicionarPacientePage} />
        
        <ContentRoute exact path="/recepcionista" component={RecepcionistaPage} />
        <ContentRoute exact path="/recepcionista/adicionar" component={AdicionarRecepcionistaPage} />
        
        
        <ContentRoute exact path="/tabela-precos" component={TabelaPreco} />
        <ContentRoute exact path="/tabela-precos/:id" component={TabelaProcedimento} />


        {/* SUBMENU Rotas de Usuarios */}


        {/* Rotas de clinicas */}


        <ContentRoute path="/my-page" component={MyPage} />
        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/react-bootstrap" component={ReactBootstrapPage} />
        <Route path="/e-commerce" component={ECommercePage} />
        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}
