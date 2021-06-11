import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "~/_metronic/layout";

import { MyPage } from "~/components/created/MyPage";
import DashboardPage from "~/components/created/dashboard";

import AdicionarUsuario from "~/components/created/usuarios/AdicionarUsuario";


import { ClinicasPage } from "~/components/created/clinicas/ClinicaPage";
import { AdicionarClinicaPage } from "~/components/created/clinicas/AdicionarClinicaPage";
import { EditarClinicaPage } from "~/components/created/clinicas/EditarClinicaPage";

import { AgendaPage } from "~/components/created/agenda/AgendaPage";

import { OrcamentoPage } from "~/components/created/orcamento/OrcamentoPage";
import { AdicionarOrcamentoPage } from "~/components/created/orcamento/AdicionarOrcamentoPage";
import { EditarOrcamentoPage } from "~/components/created/orcamento/EditarOrcamentoPage";



import { FinanceiroPage } from "~/components/created/financeiro/FinanceiroPage";
import { UsuariosPage } from "~/components/created/usuarios/UsuariosPage";
import { ConfiguracoesPage } from "~/components/created/configuracoes/ConfiguracoesPage";

import { DentistaPage } from '~/components/created/usuarios/dentistas/DentistaPage'
import { AdicionarDentistaPage } from '~/components/created/usuarios/dentistas/AdicionarDentistaPage'
import { EditarDentistaPage } from '~/components/created/usuarios/dentistas/EditarDentistaPage'

import { PacientePage } from '~/components/created/usuarios/pacientes/PacientePage'
import { AdicionarPacientePage } from '~/components/created/usuarios/pacientes/AdicionarPacientePage'
import { EditarPacientePage } from '~/components/created/usuarios/pacientes/EditarPacientePage'

import { RecepcionistaPage } from '~/components/created/usuarios/recepcionistas/RecepcionistaPage'
import { AdicionarRecepcionistaPage } from '~/components/created/usuarios/recepcionistas/AdicionarRecepcionistaPage'
import { EditarRecepcionistaPage } from '~/components/created/usuarios/recepcionistas/EditarRecepcionistaPage'

import { TabelaPreco } from '~/components/created/configuracoes/tabelaPreco/TabelaPreco'
import { TabelaEspecialidade } from '~/components/created/configuracoes/tabelaEspecialidade/TabelaEspecialidade'
import { TabelaProcedimento } from '~/components/created/configuracoes/tabelaProcedimento/TabelaProcedimento'

import { RelatorioPage } from '~/components/created/configuracoes/relatorios/RelatorioPage'

import { Equipamentos } from '~/components/created/configuracoes/equipamentos/Equipamentos'


import { ProcedimentoPage } from '~/components/created/procedimentos/ProcedimentoPage'


import ConfigurarAgenda from '~/components/created/configuracoes/agenda'


import ConfiguracaoGeral from '~/components/created/configuracoes/geral'



//////////////////////////////////////////////////////
import FinanceiroDentista from '~/components/created/dentista/financeiro'
import PacientesDentista from '~/components/created/dentista/pacientes'
import PacienteMenu from '~/components/created/dentista/pacientes/components'
//////////////////////////////////////////////////////




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


        <ContentRoute exact path="/usuario/adicionar" component={AdicionarUsuario} />
        
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
        <ContentRoute exact path="/tabela-precos/:id/procedimentos" component={TabelaProcedimento} />



        <ContentRoute exact path="/equipamentos" component={Equipamentos} />

        <ContentRoute exact path="/relatorios" component={RelatorioPage} />

        {/* SUBMENU Rotas de Usuarios */}


        {/* Rotas de clinicas */}


        <ContentRoute exact path="/procedimentos-abertos" component={ProcedimentoPage} />


        {/* configuracoes */}

        <ContentRoute exact path="/configurar-agenda" component={ConfigurarAgenda} />
        <ContentRoute exact path="/configuracao_geral" component={ConfiguracaoGeral} />



        {/* dentistas menu */}
        
        <ContentRoute exact path="/dentista/financeiro" component={FinanceiroDentista} />
        <ContentRoute exact path="/dentista/pacientes" component={PacientesDentista} />
        <ContentRoute exact path="/dentista/paciente/editar/:id" component={PacienteMenu} />


        {/* dentistas menu */}



        <ContentRoute path="/my-page" component={MyPage} />
        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/react-bootstrap" component={ReactBootstrapPage} />
        <Route path="/e-commerce" component={ECommercePage} />
        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}
