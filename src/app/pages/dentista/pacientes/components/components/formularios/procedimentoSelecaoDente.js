import React, { useState, useEffect } from "react";

import { Form, Col, Button } from "react-bootstrap";
import Select from "react-select";

import SelecaoDentes from "../SelecaoDentes";

function ProcedimentoSelecaoDente({ onFinish, procedimento, dentista }) {
  const [denticao, setDenticao] = useState("0");
  const [dentes, setDentes] = useState();

  const listaDenticoes = [
    { value: "0", label: "Permanentes" },
    { value: "1", label: "Deciduos" },
  ];

  const buscaListaDenticoes = (chave) => {
    return listaDenticoes.filter((row) => row.value === chave)[0];
  };

  const handlerMudancaDenticao = (value) => {
    procedimento.denticao = value.value;
    procedimento.dentes = undefined;

    setDenticao(value.value);

    //setDenticao(value.numerosDentes)
  };

  const handlerMudancaDentes = (value) => {
    setDentes(value);
  };

  const handlerFinalizaProcedimento = (e) => {
    procedimento.dentes = dentes;

    procedimento.valorTotal = dentes.length * procedimento.valor;

    onFinish(e, procedimento);
  };

  useEffect(() => {
    if (procedimento.dentes === undefined) procedimento.dentes = [];

    console.log(procedimento);

    if (procedimento.denticao !== undefined) {
      setDenticao(...procedimento.denticao);

      console.log(buscaListaDenticoes(procedimento.denticao));
    }
  }, [procedimento]);

  return (
    <>
      <Form.Row>
        <Form.Group as={Col} controlId="formGridAddress1">
          <Form.Label>Nome</Form.Label>
          <Form.Control disabled type="text" name="nome" value={dentista} />
        </Form.Group>

        <Form.Group as={Col}>
          <Form.Label>dentição</Form.Label>
          <Select
            placeholder="Selecione dentição"
            value={buscaListaDenticoes(denticao)}
            options={listaDenticoes}
            onChange={handlerMudancaDenticao}
          />
        </Form.Group>
      </Form.Row>

      <SelecaoDentes
        numeroListaDentes={denticao}
        procedimento={procedimento}
        callback={(value) => setDentes(value)}
      />

      <div className="text-right">
        <Button
          variant="primary"
          onClick={(e) => handlerFinalizaProcedimento(e)}
        >
          {(() => {
            let $nomeBtn = "Adicionar";

            if (procedimento.acao !== undefined) {
              if (procedimento.acao == "alterar") {
                $nomeBtn = "Alterar";
              }
            }

            return $nomeBtn;
          })()}
        </Button>
      </div>
    </>
  );
}

export default ProcedimentoSelecaoDente;
