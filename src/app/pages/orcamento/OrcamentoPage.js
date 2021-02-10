import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { AdicionarOrcamentoPage } from "~/app/pages/orcamento/AdicionarOrcamentoPage";

import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody
} from "~/_metronic/_partials/controls";

export function OrcamentoPage() {
  const history = useHistory();

  return (
    <Card>
      <CardHeader title="Orçamentos">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => history.push("/orcamento/adicionar")}
          >
            Adicionar Orcamento
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <AdicionarOrcamentoPage />
    </Card>
  );
}
