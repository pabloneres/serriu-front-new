import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { Link } from "react-router-dom";

import { Table, Modal, Button, Form, Col, InputGroup } from 'react-bootstrap'

import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { index, update } from "~/app/controllers/controller";

export function Financeiro(props) {
  const { params, url } = useRouteMatch();
  const { intl } = props;
  const {
    user: { authToken },
  } = useSelector((state) => state.auth);
  const history = useHistory();

  const [reload, setReload] = useState(false);

  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  
  const [paymentInfos, setPaymentInfos] = useState();
  
  const [pagamentos, setPagamentos] = useState([]);

  const [dataModal, setDataModal] = useState();
  const [dataModalAvista, setDataModalAvista] = useState();

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  



  useEffect(() => {
    index(`/financeiro/user/${params.id}/2`, authToken).then(({ data }) => {
      setPagamentos(data)
    });
  }, [reload]);

  if (!pagamentos) {
    return <></>;
  }

  const ModalPayment = (props) => {
    return (
      <Modal show={modal} onHide={() => {}} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar pagamento ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Deseja confirmar pagamento de {paymentInfos.name} ?</Modal.Body>
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

  const ModalPaymentAvista = (props) => {
    return (
      <Modal show={modal2} onHide={() => {}} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar pagamento ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Deseja confirmar pagamento de {paymentInfos.name} ?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setModal2(false);
            }}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => paymentAvista()}>
            Sim
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const handlePayment = (data) => {
    setPaymentInfos(data)
    setModal(true)
  };

  const handlePaymentAvista = (data) => {
    console.log(data)
    setPaymentInfos(data)
    setModal2(true)
  };
  
  const payment = () => {
    update('payment_update', paymentInfos.id, authToken).then(() => {
      setReload(!reload)
    })
    setModal(!modal)
  };

  const paymentAvista = () => {
    update('payment_update_avista', paymentInfos.id, authToken).then(() => {
      setReload(!reload)
    })
    setModal2(!modal2)
  };


  

  function verifyAprovado(el) {
    switch (el) {
      case null:
        return (
          <strong style={{color: 'red'}}>Em aberto</strong>
        )
      case 1:
        return (
          <strong style={{color: 'green'}}>Aprovado</strong>
        )
      case 2:
        return (
          <strong style={{color: 'orange'}}>Em andamento</strong>
        )
      case 3:
        return (
          <strong style={{color: 'blue'}}>Executado</strong>
        )
    }
  }


  const ShowModal = ({data, show}) => {
    if (!data || !show) {
      return <></>
    }

    let {procedimento, item} = data

    return (
      <Modal show={show} size="lg">
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
                <td>Dentista</td>
                <td>
                  {item.dentistas.name}
                </td>
              </tr>
              <tr>
                <td>Data</td>
                <td>{item.criado_em}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>{verifyAprovado(item.aprovado)}</td>
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
              <tr key={procedimento.id}>
                <td>{procedimento.procedimento_nome}</td>
                <td>{procedimento.label ? procedimento.label : "Geral"}</td>
                <td>
                  {
                    procedimento.faces === '[]' 
                    ? 'Geral'
                    : JSON.parse(procedimento.faces).map((face, index) => (
                        <span key={index} style={{ color: "red" }}>{face.label} </span>
                      ))
                  }
                </td>
                <td>
                  {procedimento.valor.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td>
                  {procedimento.status === 1 ? (
                    <span style={{ color: "green" }}>Executado</span>
                  ) : (
                    <span style={{ color: "red" }}>Pendente</span>
                  )}
                </td>
              </tr>
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
                <td>Total / Parcelado</td>
                <td>
                  {item.valorEntrada === null
                    ? "Total"
                    : "Parcelado"}
                </td>
              </tr>
              <tr>
                <td>Forma de pagamento</td>
                <td>
                  {item.formaPagamento === "dinheiro"
                    ? "Dinheiro"
                    : "Boleto"}
                </td>
              </tr>
  
              {item.tipoPagamento === 0 ? (
                ""
              ) : (
                <tr>
                  <td>Parcelamento</td>
                  <td>
                    {item.total
                      ? `Entrada de ${(
                        item.total * item.valorEntrada
                        ).toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })} + `
                      : ""}
                    <span style={{ color: "red" }}>
                      {`${item.parcelas} X ${(
                        (item.total -
                          item.total * item.valorEntrada) /
                        item.parcelas
                      ).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}`}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <div
            className="text-right"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              Total{" "}
              <strong>
                {
                  procedimento.valor.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })
                }
              </strong>
            </span>
            <div>
              {procedimento.pago === 0 ? (
                // <Button
                //   onClick={() => {
                //     setShowModal(!showModal)
                //     handlePayment({id: procedimento.id, name: item.paciente.name})
                //   }}
                //   className="mr-2"
                //   variant="primary"
                // >
                //   Receber
                // </Button>
                <></>
              ) : (
                ""
              )}
              <Button
                onClick={() => {
                  setShowModal(!showModal)
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

  const ShowModalAvista = ({data, show}) => {
    if (!data) {
      return <></>
    }

    let item = data

    return (
      <Modal show={show} size="lg">
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
                <td>Dentista</td>
                <td>
                  {item.dentistas.name}
                </td>
              </tr>
              <tr>
                <td>Data</td>
                <td>{item.criado_em}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>{verifyAprovado(item.aprovado)}</td>
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
              {
                item.dentes.map(item => (
                  <tr key={item.id}>
                    <td>{item.procedimento_nome}</td>
                    <td>{item.label ? item.label : "Geral"}</td>
                    <td>
                      {
                        item.faces === '[]' 
                        ? 'Geral'
                        : JSON.parse(item.faces).map((face, index) => (
                            <span key={index} style={{ color: "red" }}>{face.label} </span>
                          ))
                      }
                    </td>
                    <td>
                      {item.valor.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td>
                      {item.status === 1 ? (
                        <span style={{ color: "green" }}>Executado</span>
                      ) : (
                        <span style={{ color: "red" }}>Pendente</span>
                      )}
                    </td>
                  </tr>
                ))
              }
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
                <td>Total / Parcelado</td>
                <td>
                  {item.formaCobranca === "valor total"
                    ? "Total"
                    : "Parcelado"}
                </td>
              </tr>
              <tr>
                <td>Forma de pagamento</td>
                <td>
                  {item.formaPagamento === "dinheiro"
                    ? "Dinheiro"
                    : "Boleto"}
                </td>
              </tr>
  
              {item.tipoPagamento === 0 ? (
                ""
              ) : (
                <tr>
                  <td>Parcelamento</td>
                  <td>
                    {item.total
                      ? `Entrada de ${(
                        item.total * item.valorEntrada
                        ).toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })} + `
                      : ""}
                    <span style={{ color: "red" }}>
                      {`${item.parcelas} X ${(
                        (item.total -
                          item.total * item.valorEntrada) /
                        item.parcelas
                      ).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}`}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <div
            className="text-right"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              Total{" "}
              <strong>
                {
                  item.total.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })
                }
              </strong>
            </span>
            <div>
              {/* <Button
                onClick={() => {
                  setShowModal2(!showModal2)
                  handlePaymentAvista(item)
                }}
                className="mr-2"
                variant="primary"
              >
                Receber
              </Button> */}
              <Button
                onClick={() => {
                  setShowModal2(!showModal2)
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
  

  const viewDetails = (params) => {
    console.log(params)
    setDataModal(params)
    setShowModal(!showModal)
  }

  const viewDetailsAvista = (params) => {
    console.log(params)
    setDataModalAvista(params)
    setShowModal2(!showModal2)
  }

  return (
    <Card>
      {modal ? <ModalPayment /> : ""}
      {modal2 ? <ModalPaymentAvista /> : ""}
      <ShowModal data={dataModal} show={showModal}/>
      <ShowModalAvista data={dataModalAvista} show={showModal2}/>
      <CardHeader title="Recebidos"></CardHeader>
      <CardBody>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Data</th>
              <th>Dentista</th>
              <th>Valor</th>
              <th style={{ width: 100 }}></th>
            </tr>
          </thead>
          <tbody>
            {pagamentos.map((item) => (
              <tr key={item.id}>
                <td>{item.criado_em}</td>
                <td>{item.dentistas.name}</td>
                <td>
                  {item.valor.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <span
                    onClick={() => viewDetailsAvista(item)}
                    style={{ cursor: "pointer" }}
                    className="svg-icon menu-icon"
                  >
                    <SVG
                      style={{
                        fill: "#3699FF",
                        color: "#3699FF",
                        marginLeft: 8,
                      }}
                      src={toAbsoluteUrl("/media/svg/icons/Design/view.svg")}
                    />
                  </span>
                  {/* <span
                      onClick={() => handlePaymentAvista({id: item.id, name: item.paciente.name})}
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
            )
            )}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}