import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardHeaderToolbar } from "~/_metronic/_partials/controls";
import { Link } from "react-router-dom";

import { Table, Modal, Button, Form, Col, InputGroup } from "react-bootstrap";

import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { index, update, show } from "~/app/controllers/controller";
import moment from "moment";
import "moment/locale/pt-br";
moment.locale("pt-br");

export function Caixa(props) {
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

  useEffect(() => {
    index(authToken, `/caixa/clinica`).then(
      ({ data }) => {
        setPagamentos(data);
      }
    );
  }, [reload]);

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

  const handlePayment = data => {
    console.log(data);
    setPaymentInfos(data);
    setModal(true);
  };

  const payment = () => {
    update(
      `/financeiro/pagamento?ordem_id=${paymentInfos.id}
    &procedimento_id=${paymentInfos.procedimentos_orcamentos_id}
    &is_entrada=${paymentInfos.is_entrada}`,
      null,
      null,
      authToken
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
    show(authToken, "/orcamento", ordem.orcamento_id).then(({ data }) => {
      setOrcamento(data);
      setOrdem(ordem);
      setModalInfo(!modalInfo);
    });
  };


  const returnTipo = (tipo) => {
    switch (tipo) {
      case 0:
        return 'Entrada'
      case 1:
        return 'Saida'
      default:
        return tipo
    }
  }

  return (
    <Card>
      <CardHeader title="Caixa">
      </CardHeader>
      <CardBody>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Data</th>
              <th>Paciente</th>
              <th>Dentista</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th style={{ width: 100 }}></th>
            </tr>
          </thead>
          <tbody>
            {pagamentos.map(item => (
              <tr key={item.id}>
                <td>{moment(item.data).format('LLL')}</td>
                <td></td>
                <td></td>
                <td>{returnTipo(item.tipo)}</td>
                <td>
                  {item.valor.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL"
                  })}
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
                  {/* <span
                    onClick={() => handlePayment(item)}
                    style={{ cursor: "pointer" }}
                    className="svg-icon menu-icon"
                  >
                    <SVG
                      style={{
                        fill: "#3699FF",
                        color: "#3699FF",
                        marginLeft: 8,
                      }}
                      src={toAbsoluteUrl("/media/svg/icons/Design/Money.svg")}
                    />
                  </span> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
