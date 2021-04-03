import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";

import { MyPage } from "~/app/pages/MyPage";
import { DashboardPage } from "~/app/pages/DashboardPage";

import { ClinicasPage } from "~/app/pages/clinicas/ClinicaPage";
import { AdicionarClinicaPage } from "~/app/pages/clinicas/AdicionarClinicaPage";
import { EditarClinicaPage } from "~/app/pages/clinicas/EditarClinicaPage";

import { AgendaPage } from "~/app/pages/agenda/AgendaPage";

import { OrcamentoPage } from "~/app/pages/orcamento/OrcamentoPage";
import { AdicionarOrcamentoPage } from "~/app/pages/orcamento/AdicionarOrcamentoPage";
import { EditarOrcamentoPage } from "~/app/pages/orcamento/EditarOrcamentoPage";



import { FinanceiroPage } from "~/app/pages/financeiro/FinanceiroPage";
import { UsuariosPage } from "~/app/pages/usuarios/UsuariosPage";
import { ConfiguracoesPage } from "~/app/pages/configuracoes/ConfiguracoesPage";

import { DentistaPage } from '~/app/pages/usuarios/dentistas/DentistaPage'
import { AdicionarDentistaPage } from '~/app/pages/usuarios/dentistas/AdicionarDentistaPage'
import { EditarDentistaPage } from '~/app/pages/usuarios/dentistas/EditarDentistaPage'

import { PacientePage } from '~/app/pages/usuarios/pacientes/PacientePage'
import { AdicionarPacientePage } from '~/app/pages/usuarios/pacientes/AdicionarPacientePage'
import { EditarPacientePage } from '~/app/pages/usuarios/pacientes/EditarPacientePage'

import { RecepcionistaPage } from '~/app/pages/usuarios/recepcionistas/RecepcionistaPage'
import { AdicionarRecepcionistaPage } from '~/app/pages/usuarios/recepcionistas/AdicionarRecepcionistaPage'
import { EditarRecepcionistaPage } from '~/app/pages/usuarios/recepcionistas/EditarRecepcionistaPage'

import { TabelaPreco } from '~/app/pages/configuracoes/tabelaPreco/TabelaPreco'
import { TabelaEspecialidade } from '~/app/pages/configuracoes/tabelaEspecialidade/TabelaEspecialidade'
import { TabelaProcedimento } from '~/app/pages/configuracoes/tabelaProcedimento/TabelaProcedimento'

import { RelatorioPage } from '~/app/pages/configuracoes/relatorios/RelatorioPage'

import { Equipamentos } from '~/app/pages/configuracoes/equipamentos/Equipamentos'


import { ProcedimentoPage } from '~/app/pages/procedimentos/ProcedimentoPage'


import ConfigurarAgenda from '~/app/pages/configuracoes/agenda'


import { Comissoes } from '~/app/pages/dentista/comissoes'



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
        <ContentRoute exact path="/clinicas/:id" component={AdicionarClinicaPage} />
        <ContentRoute exact path="/clinicas/editar/:id" component={EditarClinicaPage} />


        {/* Rotas de clinicas */}
        <ContentRoute exact path="/agenda" component={AgendaPage}/>
        <ContentRoute exact path="/orcamento" component={OrcamentoPage} />
        <ContentRoute exact path="/orcamento/:id/adicionar" component={AdicionarOrcamentoPage} />
        <ContentRoute exact path="/orcamento/editar/:id" component={EditarOrcamentoPage} />
        <ContentRoute exact path="/pacientes" component={PacientePage} />
        <ContentRoute exact path="/financeiro" component={FinanceiroPage} />
        <ContentRoute exact path="/usuarios" component={UsuariosPage} />
        <ContentRoute exact path="/configuracoes" component={ConfiguracoesPage} />

      
        
        {/* SUBMENU Rotas de Usuarios */}
        <ContentRoute exact path="/dentista" component={DentistaPage} />
        <ContentRoute exact path="/dentista/adicionar" component={AdicionarDentistaPage} />
        <ContentRoute exact path="/dentista/editar/:id" component={EditarDentistaPage} />
      
      
        <ContentRoute exact path="/paciente" component={PacientePage} />
        <ContentRoute exact path="/paciente/adicionar" component={AdicionarPacientePage} />
        <ContentRoute exact path="/paciente/editar/:id" component={EditarPacientePage} />
        
        <ContentRoute exact path="/recepcionista" component={RecepcionistaPage} />
        <ContentRoute exact path="/recepcionista/adicionar" component={AdicionarRecepcionistaPage} />
        <ContentRoute exact path="/recepcionista/editar/:id" component={EditarRecepcionistaPage} />
        
        
        <ContentRoute exact path="/tabela-precos" component={TabelaPreco} />
        <ContentRoute exact path="/tabela-especialidades" component={TabelaEspecialidade} />
        <ContentRoute exact path="/tabela-procedimentos" component={TabelaProcedimento} />


        <ContentRoute exact path="/comissoes" component={Comissoes} />

        <ContentRoute exact path="/equipamentos" component={Equipamentos} />

        <ContentRoute exact path="/relatorios" component={RelatorioPage} />

        {/* SUBMENU Rotas de Usuarios */}


        {/* Rotas de clinicas */}


        <ContentRoute exact path="/procedimentos-abertos" component={ProcedimentoPage} />


        {/* configuracoes */}

        <ContentRoute exact path="/configurar-agenda" component={ConfigurarAgenda} />


        

        <ContentRoute path="/my-page" component={MyPage} />
        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/react-bootstrap" component={ReactBootstrapPage} />
        <Route path="/e-commerce" component={ECommercePage} />
        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}
