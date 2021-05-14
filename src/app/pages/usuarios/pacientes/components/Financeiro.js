import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardHeaderToolbar } from "~/_metronic/_partials/controls";
import { Link } from "react-router-dom";
import { InputNumber, Row, Input, Button, Statistic } from 'antd';

import { Table, Form, Col, InputGroup, Modal } from "react-bootstrap";

import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { index, update, show, store } from "~/app/controllers/controller";

export function Financeiro(props) {
  const { params, url } = useRouteMatch();
  const { intl } = props;
  const {
    user: { authToken }
  } = useSelector(state => state.auth);
  const history = useHistory();

  const [reload, setReload] = useState(false);

  const [modal, setModal] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);

  const [paymentInfos, setPaymentInfos] = useState();

  const [pagamentos, setPagamentos] = useState();

  const [ordem, setOrdem] = useState(undefined);
  const [orcamento, setOrcamento] = useState(undefined);

  const [showModal, setShowModal] = useState(false);
  const [showModalSaldo, setShowModalSaldo] = useState(false);
  const [addSaldo, setAddSaldo] = useState(undefined);
  const [pacienteInfo, setPacienteInfo] = useState(undefined);


  useEffect(() => {
    index(
      authToken,
      `/financeiro/user?status=pendente,pago&usuario_id=${params.id}&pago=0,1`
    ).then(({ data }) => {
      setPagamentos(data);
    });

    show(authToken, '/patient', params.id).then(({data}) => {
      console.log(data)
      setPacienteInfo(data[0])
    }) 
  }, [authToken, params.id, reload]);

  if (!pagamentos) {
    return <></>;
  }

  const ModalPayment = props => {
    return (
      <Modal show={modal} onHide={() => {}} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar pagamento ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deseja confirmar pagamento de {paymentInfos.pacientes.name} ?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setModal(false);
            }}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => payment()}>
            Sim
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const handleAddSaldo = () => {
    update(authToken, '/paciente/saldo', params.id, {valor: addSaldo, tipo: 0 }).then(_ => {
      setAddSaldo(undefined)
      setShowModalSaldo(false)
      setReload(!reload)
    })
  }

  const returnValue = (e, currency = 'brl') => {
    const value = Number(e)
    return value.toLocaleString('pt-br', { style: 'currency', currency })
  }

  const handlePayment = data => {
    setPaymentInfos(data);
    setModal(true);
    setModalInfo(false);
  };

  const payment = () => {
    update(
      authToken,
      `/financeiro/pagamento?ordem_id=${paymentInfos.id}
    &procedimento_id=${paymentInfos.procedimentos_orcamentos_id}
    &is_entrada=${paymentInfos.is_entrada}`,
      null,
      null
    ).then(() => {
      setReload(!reload);
    });
    setModal(!modal);
  };

  function ReturnStatus(status) {
    switch (status) {
      case 0:
        return <strong style={{ color: "red" }}>Salvo</strong>;
      case 1:
        return <strong style={{ color: "green" }}>Aprovado</strong>;
      case 2:
        return <strong style={{ color: "orange" }}>Em andamento</strong>;
      case 3:
        return <strong style={{ color: "blue" }}>Executado</strong>;
    }
  }

  function returnPago(pago) {
    switch (pago) {
      case 0:
        return <strong style={{ color: "orange" }}>Pendente</strong>;
      case 1:
        return <strong style={{ color: "green" }}>Pago</strong>;
    }
  }

  function returnReferencia(params) {
    console.log(params);

    if (params.is_entrada === 1) {
      return "Entrada do Orçamento";
    }

    if (params.cobranca === "total") {
      return "Total do Orçamento";
    }

    return "Procedimento Executado";
  }

  const viewDetails = ordem => {
    setPaymentInfos(ordem);
    show(authToken, "/orcamento", ordem.orcamento_id).then(({ data }) => {
      setOrcamento(data);
      setOrdem(ordem);
      setModalInfo(!modalInfo);
    });
  };

  const ShowModal = () => {
    if (!ordem || !orcamento) {
      return <></>;
    }

    return (
      <Modal show={modalInfo} size="lg">
        <Modal.Header>Orçamento</Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Informações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Referência</td>
                <td>
                  {" "}
                  {ordem.is_parcela === 1
                    ? "Parcela N°" + ordem.num_parcela
                    : ordem.is_entrada === 1
                    ? "Entrada"
                    : ordem.condicao === "vista"
                    ? "Pagamento À Vista"
                    : ""}
                </td>
              </tr>
              <tr>
                <td>Dentista</td>
                <td>{orcamento.dentistas.name}</td>
              </tr>
              <tr>
                <td>Data</td>
                <td>{orcamento.criado_em}</td>
              </tr>
              <tr>
                <td>Status do Orçamento</td>
                <td>{ReturnStatus(orcamento.status)}</td>
              </tr>
            </tbody>
          </Table>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Procedimentos</th>
                <th>Dente</th>
                <th>Faces</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orcamento.procedimentos_orcamentos
                ? orcamento.procedimentos_orcamentos.map(procedimento => (
                    <tr key={procedimento.id}>
                      <td>{procedimento.procedimento_nome}</td>
                      <td>
                        {procedimento.label ? procedimento.label : "Geral"}
                      </td>
                      <td>
                        {procedimento.faces && procedimento.faces.lenght > 0
                          ? procedimento.faces.map(face => (
                              <span style={{ color: "red" }}>
                                {face.label}{" "}
                              </span>
                            ))
                          : "Geral"}
                      </td>
                      <td>
                        {procedimento.valor.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL"
                        })}
                      </td>
                      <td>
                        {procedimento.status === 'executado' ? (
                          <span style={{ color: "green" }}>Executado</span>
                        ) : (
                          <span style={{ color: "red" }}>Pendente</span>
                        )}
                      </td>
                    </tr>
                  ))
                : ""}
            </tbody>
          </Table>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Forma de pagamento</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Forma Cobrança</td>
                <td>{ordem.cobranca === "total" ? "Total" : "Procedimento"}</td>
              </tr>
              <tr>
                <td>Forma de Pagamento</td>
                <td>
                  {ordem.pagamento === "dinheiro" ? "Dinheiro" : "Boleto"}
                </td>
              </tr>
              <tr>
                <td>Condição de Pagamento</td>
                <td>{ordem.condicao === "vista" ? "À vista" : "Parcelado"}</td>
              </tr>

              {ordem.condicao === "parcelado" ? (
                <tr>
                  <td>Parcelamento</td>
                  <td>
                    {ordem.valor
                      ? `Entrada de ${ordem.valor.toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL"
                        })} + `
                      : ""}
                    <span style={{ color: "red" }}>
                      {`${orcamento.parcelas} X ${(
                        (orcamento.total - orcamento.entrada) /
                        orcamento.parcelas
                      ).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL"
                      })}`}
                    </span>
                  </td>
                </tr>
              ) : (
                ""
              )}
            </tbody>
          </Table>
          <div
            className="text-right"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span>
              Total{" "}
              <strong>
                {ordem.valor.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL"
                })}
              </strong>
            </span>
            <div>
              {ordem.pago === 0 ? (
                <Button
                  onClick={() => {
                    handlePayment(ordem);
                  }}
                  className="mr-2"
                  variant="primary"
                >
                  Receber
                </Button>
              ) : (
                ""
              )}
              <Button
                onClick={() => {
                  setModalInfo(!modalInfo);
                }}
                className="mr-2"
                variant="danger"
              >
                Fechar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <Card>
      {modal ? <ModalPayment /> : ""}
      <ShowModal />
      <CardHeader title="Financeiro cliente">
        {/* <CardHeaderToolbar>
          <Statistic title="Saldo disponivel"  valueStyle={{ fontSize: 16, color: 'green', }} value={returnValue(pacienteInfo ? pacienteInfo.saldo_disponivel : 0)} />
          <button
            style={{marginLeft: 100}}
            type="button"
            className="btn btn-primary"
            onClick={() => { 
              setShowModalSaldo(true)
            }}
          >
            Adicionar saldo
          </button>
        </CardHeaderToolbar> */}
      </CardHeader>
      <CardBody>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Data</th>
              <th>Paciente</th>
              <th>Dentista</th>
              <th>Valor</th>
              <th>Pagamento</th>
              <th>Informações</th>
              <th style={{ width: 100 }}></th>
            </tr>
          </thead>
          <tbody>
            {pagamentos.map(item => (
              <tr key={item.id}>
                <td>{item.criado_em}</td>
                <td>{item.pacientes.name}</td>
                <td>{item.dentistas.name}</td>
                <td>
                  {item.valor.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL"
                  })}
                </td>
                <td>{returnPago(item.pago)}</td>
                <td>
                  {item.is_parcela === 1
                    ? "Parcela N°" + item.num_parcela
                    : item.is_entrada === 1
                    ? "Entrada"
                    : item.condicao === "vista"
                    ? "Pagamento À Vista"
                    : ""}
                </td>
                <td style={{ display: "flex", justifyContent: "space-around" }}>
                  <span
                    onClick={() => viewDetails(item)}
                    style={{ cursor: "pointer" }}
                    className="svg-icon menu-icon"
                  >
                    <SVG
                      style={{
                        fill: "#3699FF",
                        color: "#3699FF",
                        marginLeft: 8
                      }}
                      src={toAbsoluteUrl("/media/svg/icons/Design/view.svg")}
                    />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
