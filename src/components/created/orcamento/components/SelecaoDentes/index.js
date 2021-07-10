import React, { useState, useEffect } from "react";

import { convertMoney } from "~/modules/Util";

import { Form, Table, Col, Button, CardGroup } from "react-bootstrap";
import { Card, CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { toAbsoluteUrl } from "~/_metronic/_helpers";
import SVG from "react-inlinesvg";

function SelecaoDentes({ numeroListaDentes, procedimento, callback }) {
  const [listaDentesFinalizados, setListaDentesFinalizados] = useState([]);
  const [listaDentes, setListaDentes] = useState([]);

  const numerosPermanetes = [
    ["18", "17", "16", "15", "14", "13", "12", "11"],
    ["21", "22", "23", "24", "25", "26", "27", "28"],
    ["48", "47", "46", "45", "44", "43", "42", "41"],
    ["31", "32", "33", "34", "35", "36", "37", "38"],
  ];

  const numerosDeciduos = [
    ["55", "54", "53", "52", "51"],
    ["61", "62", "63", "64", "65"],
    ["85", "84", "83", "82", "81"],
    ["71", "72", "73", "74", "75"],
  ];

  const listaNumero = {
    0: numerosPermanetes,
    1: numerosDeciduos,
  };

  useEffect(() => {
    let novaLista = listaNumero[numeroListaDentes];

    if (novaLista) {
      let novaDenticao = novaLista.map((dente) => {
        return dente.map(function(numero) {
          return {
            label: numero,
            faces: [],
          };
        });
      });

      setListaDentes(novaDenticao);
    }
  }, [numeroListaDentes]);

  const getFacesDente = (numero) => {
    let result = [{ label: "V" }, { label: "D" }, { label: "M" }];
    const facePorQuadrante = {
      0: { label: "P" },
      1: { label: "P" },
      2: { label: "L" },
      3: { label: "L" },
    };

    if (listaDentes)
      listaDentes.map((quadrante, key) => {
        let valueIndex = quadrante
          .map((row) => row.label)
          .indexOf(numero.label);

        if (valueIndex >= 0) {
          result.push(facePorQuadrante[key]);

          if (key % 2 == 0) {
            if (
              valueIndex >= quadrante.length - 3 &&
              valueIndex <= quadrante.length
            ) {
              result.push({ label: "I" });
            } else {
              result.push({ label: "O " });
            }
          } else {
            if (valueIndex < 3) {
              result.push({ label: "I" });
            } else {
              result.push({ label: "O" });
            }
          }
        }
      });

    return result;
  };

  useEffect(() => {
    if (procedimento.dentes === undefined) procedimento.dentes = [];

    setListaDentesFinalizados(procedimento.dentes);
  }, [procedimento.dentes]);

  useEffect(() => {
    callback(listaDentesFinalizados);
  }, [listaDentesFinalizados]);

  const listaFaces = [
    { label: "V" },
    { label: "D" },
    { label: "M" },
    { label: "L" },
    { label: "O" },
  ];

  const adicionaDente = (key) => {
    if (key) {
      key.active = true;
      console.log(key);
      let indice = listaDentesFinalizados
        .map((row) => row.label)
        .indexOf(key.label);
      if (indice < 0) {
        setListaDentesFinalizados([...listaDentesFinalizados, key]);
      } else {
        listaDentesFinalizados.splice(indice, 1);
        setListaDentesFinalizados([...listaDentesFinalizados]);

        key.active = false;
      }
    }
  };

  const adicionaFaceDente = (e, dente, face) => {
    /**/
    e.target.classList.add("ativo");

    if (dente.faces.map((face) => face.label).indexOf(face.label) < 0) {
      dente.faces.push(face);
    } else {
      //listaDentesFinalizados.splice(listaDentesFinalizados.indexOf(key), 1);
      //setListaDentesFinalizados([...listaDentesFinalizados]);
      dente.faces.splice(dente.faces.indexOf(face), 1);
      e.target.classList.remove("ativo");
    }

    //setListaDentesFinalizados([...listaDentesFinalizados]);
  };

  const isDenteAtivo = (dente) => {
    let ativo = false;

    listaDentesFinalizados.map((row) => {
      ativo = row.label == dente.label ? true : ativo;
    });

    return ativo;
  };

  const getListaDentes = () => {
    let html = "";

    if (listaDentes) {
      return (
        <>
          {listaDentes.map((row, key) => {
            return (
              <span key={key} className="sessaoDente">
                {row.map((dente, key) => {
                  return (
                    <div
                      key={key}
                      onClick={() => adicionaDente(dente)}
                      className={
                        (isDenteAtivo(dente) ? "ativo" : "") + " numero"
                      }
                    >
                      {dente.label}
                    </div>
                  );
                })}
              </span>
            );
          })}
        </>
      );
    }
  };

  const getListaDentesSelecionados = () => {
    let html = "";

    if (listaDentesFinalizados) {
      html = (
        <>
          {listaDentesFinalizados.map((dente, key) => {
            return (
              <li key={key} className="ativo">
                <div className="faces">
                  <span className="numeroDenteSelecionado">{dente.label}</span>
                  {getFacesDente(dente).map((face, key) => {
                    return (
                      <div
                        key={key}
                        onClick={(e) => adicionaFaceDente(e, dente, face)}
                        className={
                          "face " +
                          (dente.faces
                            .map((face) => face.label)
                            .indexOf(face.label) >= 0
                            ? "ativo"
                            : "")
                        }
                      >
                        {face.label}
                      </div>
                    );
                  })}
                </div>
                <span>{convertMoney(procedimento.valor)}</span>
              </li>
            );
          })}
        </>
      );
    }

    return html;
  };

  return (
    <div className="selecaoDentes">
      <Card>
        <CardHeader title="Adicionar dentes"></CardHeader>
        <CardBody>
          <div className="listaNumeroDentes">{getListaDentes()}</div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Dentes selecionados"></CardHeader>
        <CardBody>
          <ul className="listaDentes">{getListaDentesSelecionados()}</ul>
        </CardBody>
      </Card>
    </div>
  );
}

export default SelecaoDentes;
