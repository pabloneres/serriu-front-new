import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardHeaderToolbar,
} from "~/_metronic/_partials/controls";
import { Link } from "react-router-dom";
import {
  Table as TableNew,
  Modal,
  Tag,
  Space,
  Tooltip,
  Input,
  InputNumber,
  notification,
  Tabs,
  Checkbox,
  Button,
  Select,
  DatePicker,
  Upload,
} from "antd";
import {
  FolderOpenOutlined,
  DeleteOutlined,
  EditOutlined,
  DollarCircleOutlined,
  CheckCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import InputMask from "~/utils/mask";

import { useHistory, useRouteMatch } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import SVG from "react-inlinesvg";
import { index, update, show, store } from "~/controllers/controller";
import moment from "moment";
import "./styles.css";
import "moment/locale/pt-br";
import local from "antd/es/date-picker/locale/pt_BR";
moment.locale("pt-br");

const { Option } = Select;

export function Financeiro(props) {
  const { params, url } = useRouteMatch();
  const { intl } = props;
  const {token} = useSelector((state) => state.auth);

  const history = useHistory();

  const [reload, setReload] = useState(false);

  const [modal, setModal] = useState(undefined);
  const [modalInfo, setModalInfo] = useState(undefined);

  const [modalReceber, setModalReceber] = useState(undefined);
  const [modalReceberInfo, setModalReceberInfo] = useState(undefined);

  const [paymentInfos, setPaymentInfos] = useState();

  const [pagamentos, setPagamentos] = useState();
  const [orcamentos, setOrcamentos] = useState([]);

  const [ordem, setOrdem] = useState(undefined);
  const [orcamento, setOrcamento] = useState(undefined);

  const [showModal, setShowModal] = useState(false);
  const [showModalSaldo, setShowModalSaldo] = useState(false);
  const [addSaldo, setAddSaldo] = useState(undefined);
  const [pacienteInfo, setPacienteInfo] = useState(undefined);
  const [pagamentoConfig, setPagamentoConfig] = useState(undefined);
  const [formaPagamento, setFormaPagamento] = useState(undefined);

  const [selecionado, setSelecionado] = useState([]);
  const [selectionType, setSelectionType] = useState("checkbox");
  const [pagamentoValue, setPagamentoValue] = useState(0);
  const [saldoDistribuir, setSaldoDistribuir] = useState([]);
  const [pagamentoValue2, setPagamentoValue2] = useState(0);
  const [especialidades, setEspecialidades] = useState([]);
  const [valoresAplicados, setValoresAplicados] = useState([]);

  const [entradaValue, setEntradaValue] = useState(undefined);

  const [resumoCobrancaEntrada, setResumoCobrancaEntrada] = useState({});
  const [resumoCobranca, setResumoCobranca] = useState({});
  const [paciente, setPaciente] = useState({});
  const [avaliador, setAvaliador] = useState({});

  const [emailVerify, setEmailVerify] = useState(undefined);
  const [tokenSave, setTokenSave] = useState(undefined);
  const [tokenVerify, setTokenVerify] = useState(undefined);

  const { TextArea } = Input;

  useEffect(() => {
    console.log(saldoDistribuir);
  }, [saldoDistribuir]);

  useEffect(() => {
    show(token, "/patient", params.id).then(({ data }) => {
      setPaciente(data[0]);
    });
  }, []);

  useEffect(() => {
    index(
      token,
      `orcamentos?paciente_id=${params.id}&status=${""}&returnType=1`
    )
      .then(({ data }) => {
        setOrcamentos(data);
      })
      .catch((err) => {});
  }, [token, reload]);

  useEffect(() => {
    show(token, "/orcamentos", modal).then(({ data }) => {
      setModalInfo(data);
      if (data.pagamento) {
        if (data.pagamento.condicao === "total") {
          setSelecionado(
            data.procedimentos.map((item) => ({ ...item, key: item.id }))
          );
          setPagamentoValue2(data.restante);

          if (data.pagamentos.length === 0) {
            let arrEspecialidades = data.procedimentos.map((item) => ({
              id: item.procedimento.especialidade.id,
              name: item.procedimento.especialidade.name,
              valor: Number(item.procedimento.valor),
              restante: Number(item.procedimento.valor),
              valorAplicado: Number(),
            }));

            let valores = [];

            arrEspecialidades.forEach((item) => {
              if (!valores.some((el, i) => el.id === item.id)) {
                valores.push(item);
              } else {
                var index = valores.findIndex(
                  (current) => item.id === current.id
                );

                valores[index].valor = valores[index].valor + item.valor;
              }
            });

            console.log(
              valores.map((item) => ({
                ...item,
                restante: item.valor,
              }))
            );

            setEspecialidades(
              valores.map((item) => ({
                ...item,
                restante: item.valor,
              }))
            );

            return;
          } else {
            let especialidadesSemRestante = [];
            let especialidadesOrcamento = data.procedimentos.map((item) => ({
              id: item.procedimento.especialidade.id,
              name: item.procedimento.especialidade.name,
              valor: Number(item.procedimento.valor),
              valorAplicado: Number(),
            }));
            especialidadesOrcamento.forEach((item) => {
              if (
                !especialidadesSemRestante.some((el, i) => el.id === item.id)
              ) {
                especialidadesSemRestante.push(item);
              } else {
                var index = especialidadesSemRestante.findIndex(
                  (current) => item.id === current.id
                );
                especialidadesSemRestante[index].valor =
                  especialidadesSemRestante[index].valor + item.valor;
              }
            });
            especialidadesSemRestante = especialidadesSemRestante.map(
              (item) => ({
                ...item,
                restante: item.valor,
              })
            );

            console.table(especialidadesSemRestante);

            ////////////////////////////////////////////////

            let especialidadesComRestante = [];
            let arrEspecialidades = data.pagamentos.map((item) => ({
              id: item.especialidades.id,
              name: item.especialidades.name,
              valor: Number(item.valor) + Number(item.restante),
              restante: Number(item.restante),
              valorAplicado: Number(),
            }));

            arrEspecialidades.forEach((item) => {
              if (
                !especialidadesComRestante.some((el, i) => el.id === item.id)
              ) {
                especialidadesComRestante.push(item);
              } else {
                var index = especialidadesComRestante.findIndex(
                  (current) => item.id === current.id
                );

                especialidadesComRestante[index] = item;
                // especialidadesComRestante[index].restante =
                //   especialidadesComRestante[index].restante - item.restante;
              }
            });
            console.table(especialidadesComRestante);

            ///////////////////////////////////////////////

            let especialidadeDiferenca = [];

            especialidadesSemRestante.forEach((item) => {
              if (
                !especialidadesComRestante.some((el, i) => el.id === item.id)
              ) {
                especialidadeDiferenca.push(item);
              } else {
                return;
                // var index = especialidadesComRestante.findIndex(
                //   (current) => item.id === current.id
                // );

                // especialidadesComRestante[index] = item
                // // especialidadesComRestante[index].restante =
                // //   especialidadesComRestante[index].restante - item.restante;
              }
            });

            console.table(especialidadeDiferenca);

            ///////////////////////////////////////////////

            let especialidadesFinal = [
              ...especialidadesComRestante,
              ...especialidadeDiferenca,
            ];

            // especialidadesComRestante.forEach((item) => {
            //   especialidadesSemRestante.forEach((item2) => {
            //     if (item.id !== item2.id) {
            //       especialidadesFinal = [...especialidadesFinal, item];
            //     }
            //   });
            // });

            console.table(especialidadesFinal);

            setEspecialidades(especialidadesFinal);
          }
        }
      }
    });
  }, [modal]);

  if (modalInfo) {
    show(token, "/dentist", modalInfo.avaliador).then(({ data }) => {
      setAvaliador(data[0]);
    });
  }

  useEffect(() => {
    index(token, `/pagamento?procedimento_id=${modalReceber}`).then(
      ({ data }) => {
        setModalReceberInfo(data);
      }
    );
  }, [modalReceber]);

  const returnValue = (e, currency = "brl") => {
    const value = Number(e);
    return value.toLocaleString("pt-br", { style: "currency", currency });
  };

  const handlePagamento = (data) => {
    if (data === "procedimento") {
      store(token, "/orcamento/pagamento", {
        condicao: data,
        orcamento_id: modalInfo.id,
        procedimento_ids: selecionado,
        formaPagamento,
        valor: selecionado.reduce((a, b) => a + b.valor, 0),
      }).then((data) => {
        setModal(undefined);
        setReload(!reload);
        setPagamentoValue(0);
        setSaldoDistribuir([]);
        setPagamentoValue2(0);
        console.log(data);
      });

      setModal(undefined);
      setSelecionado([]);

      return;
    }

    if (data === "total") {
      store(token, "/orcamento/pagamento", {
        condicao: data,
        orcamento_id: modalInfo.id,
        // procedimento_ids: selecionado,
        formaPagamento,
        valor: Number(pagamentoValue),
        especialidades: especialidades,
      }).then((data) => {
        setModal(undefined);
        setReload(!reload);
        setPagamentoValue(0);
        setSaldoDistribuir([]);
        setPagamentoValue2(0);
        console.log(data);
      });

      setModal(undefined);
      setSelecionado([]);

      return;
    }

    if (data === "boleto") {
      store(token, "/orcamento/pagamento", {
        condicao: data,
        orcamento_id: modalInfo.id,
        formaPagamento: "boleto",
        valor: modalInfo.valor,
        cobranca: resumoCobranca,
      }).then((data) => {
        setModal(undefined);
        setReload(!reload);
        setResumoCobranca(undefined);
        setResumoCobrancaEntrada({});
      });
    }
    // setPaymentInfos(data);
    // setModal(true);
    // setModalInfo(false);
  };

  const handlePagamentoProcedimento = (data) => {
    update(token, "/pagamento", data, {
      status: "pago",
      formaPagamento: modalReceberInfo.formaPagamento,
    }).then((data) => {
      setModalInfo(undefined);
      setModalReceberInfo(undefined);
      setReload(!reload);
    });

    setModal(false);

    // setPaymentInfos(data);
    // setModal(true);
    // setModalInfo(false);
  };

  const payment = () => {
    update(
      token,
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

  const viewDetails = (ordem) => {
    setPaymentInfos(ordem);
    show(token, "/orcamento", ordem.orcamento_id).then(({ data }) => {
      setOrcamento(data);
      setOrdem(ordem);
      setModalInfo(!modalInfo);
    });
  };

  function ReturnStatus(status) {
    switch (status) {
      case "salvo":
        return <strong style={{ color: "red" }}>Salvo</strong>;
      case "aprovado":
        return <strong style={{ color: "green" }}>Aprovado</strong>;
      case "andamento":
        return <strong style={{ color: "orange" }}>Em andamento</strong>;
      case "finalizado":
        return <strong style={{ color: "blue" }}>Executado</strong>;
      default:
        return status;
    }
  }

  const convertMoney = (value) => {
    if (!value) {
      return;
    }
    return Number(value).toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  };

  const returnSaldo = (value) => {
    if (value < 0) {
      return <span style={{ color: "red" }}> {convertMoney(value)} </span>;
    }
    return <span style={{ color: "green" }}> {convertMoney(value)} </span>;
  };

  const convertDate = (data) => {
    return moment(data).format("l") + " - " + moment(data).format("LT");
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Aprovado em",
      dataIndex: "data_aprovacao",
      render: (data) => <span>{convertDate(data)}</span>,
      key: "data_aprovacao",
    },
    {
      title: "Tipo",
      dataIndex: "pagamento",
      render: (data) => <span>{data.condicao}</span>,
    },
    {
      title: "Entrada",
      dataIndex: "pagamento",
      render: (data) => (
        <span>{data.entrada ? convertMoney(data.entrada) : "-"}</span>
      ),
    },
    {
      title: "Parcelado",
      render: (data) => (
        <span>
          {data.pagamento.entrada
            ? convertMoney(data.valor - data.pagamento.entrada)
            : "-"}
        </span>
      ),
    },
    {
      title: "Qnt. parcelas",
      dataIndex: "pagamento",
      render: (data) => <span>{data.parcelas ? data.parcelas : "-"}</span>,
    },
    {
      title: "Total",
      dataIndex: "valor",
      key: "valor",
      render: (data) => <span>{convertMoney(data)}</span>,
    },
    {
      title: "Saldo a pagar",
      dataIndex: "restante",
      key: "restante",
      render: (data) => <span>{convertMoney(data ? data : 0)}</span>,
    },
    {
      title: "Status pagamento",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Ações",
      key: "acoes",
      render: (data) => (
        <Space size="middle">
          {/* {
            orcamento.status !== 3 ? 
            <Tooltip placement="top" title="Excluir">
              <span onClick={() => {} }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
                <DeleteOutlined />
              </span>
            </Tooltip>
            : ''
          } */}
          <Tooltip placement="top" title="Visualizar">
            <span
              onClick={() => {}}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <FolderOpenOutlined twoToneColor="#eb2f96" />
            </span>
          </Tooltip>
          <Tooltip placement="top" title="Editar">
            <span
              onClick={() => {}}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <EditOutlined />
            </span>
          </Tooltip>
          <Tooltip placement="top" title="Definir pagamento">
            <span
              onClick={() => {
                setModal(data.id);
              }}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <DollarCircleOutlined />
            </span>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const columns2 = [
    {
      title: "Id",
      dataIndex: "procedimento_id",
    },
    {
      title: "Data pagamento",
      dataIndex: "created_at",
      render: (data) => <span>{convertDate(data)}</span>,
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      render: (data) => <span>{data ? data : "-"}</span>,
    },
    {
      title: "Tipo",
      dataIndex: "tipo",
      render: (data) => <span>{data ? data : "-"}</span>,
    },
    {
      title: "Forma pagamento",
      dataIndex: "formaPagamento",
      render: (data) => <span>{data ? data : "-"}</span>,
    },
    {
      title: "Parcela",
      dataIndex: "parcelas",
      render: (data) => <span>{data ? data : "-"}</span>,
    },
    {
      title: "Valor",
      dataIndex: "valor",
      render: (data) => <span>{convertMoney(data)}</span>,
    },
    {
      title: "Saldo a pagar",
      dataIndex: "restante",
      render: (data) => <span>{convertMoney(data ? data : 0)}</span>,
    },
    {
      title: "Vencimento",
      dataIndex: "vencimento",
      render: (data) => <span>{data ? data : "-"}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (data) => <span>{data ? data : "-"}</span>,
    },
    {
      title: "Ações",
      render: (data) => (
        <Space size="middle">
          <Tooltip placement="top" title="Pagamento">
            <span
              onClick={() => {
                setModalReceber(data.procedimento_id);
              }}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <DollarCircleOutlined />
            </span>
          </Tooltip>
          <Tooltip placement="top" title="Editar">
            <span
              onClick={() => {}}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <EditOutlined />
            </span>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const columnsModalReceber = [
    {
      title: "Procedimento",
      dataIndex: "procedimento",
      render: (data) => <span>{data.name}</span>,
    },
    {
      title: "Valor un",
      render: (data) => (
        <span>{data.valor ? convertMoney(data.valor) : ""}</span>
      ),
    },
    {
      title: "Valor total",
      render: (data) => (
        <span>{data.valor ? convertMoney(data.valor) : ""}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (data) => <span>{data}</span>,
    },
  ];

  const columnsModalTotal = [
    {
      title: "Descrição",
      dataIndex: "descricao",
    },
    {
      title: "Valor",
      dataIndex: "valor",
      render: (data) => <span>{data ? convertMoney(data) : ""}</span>,
    },
  ];

  const columnsModalTotalData = [
    {
      descricao: "Pagamento total do orçamento",
      valor: modalInfo ? modalInfo.valor : "",
    },
    {
      descricao: "Pagamento parcial do orçamento",
      valor: pagamentoValue,
    },
  ];

  const rowSelection = {
    onChange: (rowKey, selectedRows) => {
      console.log(selectedRows);
      setSelecionado(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled:
        record.status === "pago" || modalInfo.pagamento.condicao === "total",
    }),
  };

  const InnerTable = (record) => {
    return (
      <TableNew
        dataSource={record.pagamentos}
        columns={columns2}
        pagination={false}
      />
    );
  };

  const handleChangeValueEspecialidade = (e, index, item) => {
    let valor = Number(e.target.value);
    let totalEspecialidade = Number(
      saldoDistribuir.reduce((a, b) => Number(a) + Number(b.valorAplicado), 0)
    );

    const returnValor = () => {
      if (totalEspecialidade + valor > pagamentoValue) {
        return pagamentoValue - totalEspecialidade;
      }

      if (valor > pagamentoValue) {
        return pagamentoValue;
      } else if (valor > item.restante) {
        return item.restante;
      }

      if (totalEspecialidade > pagamentoValue) {
        return totalEspecialidade - pagamentoValue;
      }

      return valor;
    };

    setEspecialidades(
      especialidades.map((current, i) => {
        if (i === index) {
          return {
            ...current,
            valorAplicado: returnValor(),
            // restante: Number(current.restante) - Number(current.valorAplicado),
          };
        } else {
          return { ...current };
        }
      })
    );
  };

  const mudarValorDistribuido = (item) => {
    let saldos = [...saldoDistribuir, item];
    let saldosFinal = [];

    saldos.forEach((item) => {
      if (!saldosFinal.some((el, i) => el.id === item.id)) {
        saldosFinal.push(item);
      } else {
        var index = saldosFinal.findIndex((current) => item.id === current.id);

        saldosFinal[index].valorAplicado = item.valorAplicado;
      }
    });

    setSaldoDistribuir(saldosFinal);
  };

  const zerarValor = (item) => {
    let saldos = saldoDistribuir;
    // let saldosFinal = []

    // saldos.forEach((item) => {
    //   if (!saldosFinal.some((el, i) => el.id === item.id)) {
    //     saldosFinal.push(item)
    //   } else {
    //     var index = saldosFinal.findIndex(current => item.id === current.id)

    //     saldosFinal[index].valorAplicado = 0
    //   }
    // })

    let index = saldos.findIndex((current) => current.id === item.id);
    console.log("index", index);
    console.log(saldos[index]);
    saldos[index] = { ...item, valorAplicado: 0 };
    console.log(saldos[index]);

    setSaldoDistribuir(saldos);
  };

  function currencyToInt(value) {
    value = value.replace(/[^0-9]+/g, "");
    value = value.slice(0, -2) + "." + value.slice(-2);

    return value;
  }

  function handleVerifyEmail() {
    const token = Math.floor(Math.random() * (100000 + 888888));

    setTokenSave(token);
    store(token, "/confirmMail", {
      email: emailVerify,
      token,
    }).then((data) => {});
  }

  const propsInput = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      // if (info.file.status !== "uploading") {
      //   console.log(info.file, info.fileList);
      // }
      // if (info.file.status === "done") {
      //   message.success(`${info.file.name} file uploaded successfully`);
      // } else if (info.file.status === "error") {
      //   message.error(`${info.file.name} file upload failed.`);
      // }
    },
  };

  return (
    <Card>
      <Modal
        centered
        visible={modal ? true : false}
        onOk={() => setModal(undefined)}
        onCancel={() => setModal(undefined)}
        closable={false}
        width={"80%"}
        footer={null}
      >
        {modalInfo ? (
          <div className="pagamento-container">
            <div className="container-pagamento">
              <div className="infos-pagamento">
                <div className="info-title">
                  <h2>Opção pagamento</h2>
                  <Select
                    style={{ width: "50%" }}
                    defaultValue={
                      modalInfo.pagamento
                        ? modalInfo.pagamento.condicao
                        : undefined
                    }
                    options={[
                      {
                        label: "Total",
                        value: "total",
                      },
                      {
                        label: "Procedimento",
                        value: "procedimento",
                      },
                      {
                        label: "Boleto",
                        value: "boleto",
                      },
                    ]}
                  />
                </div>
              </div>
              <div className="config-pagamento">
                <div className="pagamento-receber">
                  <div className="header-pagamento">
                    <span>A receber</span>
                  </div>
                  <div className="painel-pagamento">
                    <TableNew
                      columns={columnsModalReceber}
                      dataSource={modalInfo.procedimentos.map((item) => ({
                        ...item,
                        key: item.id,
                      }))}
                      pagination={false}
                      rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                      }}
                      key="id"
                    />
                  </div>
                  {/* <Button disabled={modalInfo.pagamento.condicao === 'procedimento' || modalInfo.pagamento.condicao === 'total'} type="primary" block>Adicionar</Button> */}
                </div>

                {modalInfo.pagamento.condicao === "total" ? (
                  <>
                    <div className="pagamento-pago">
                      <div className="header-pagamento">
                        <span>Valor a pagar</span>
                      </div>
                      <div className="painel-pagamento">
                        <Input
                          disabled={pagamentoValue > 0}
                          defaultValue={modalInfo.restante}
                          onChange={(e) => setPagamentoValue2(e.target.value)}
                        />
                        {/* <TableNew columns={columnsModalReceber} dataSource={modalInfo.procedimentos.filter(item => item.status === 'pago')} pagination={false} /> */}
                      </div>
                      <Button
                        onClick={() => {
                          setPagamentoValue(pagamentoValue2);
                        }}
                        type="primary"
                        block
                      >
                        Adicionar
                      </Button>
                      <Button
                        onClick={() => setPagamentoValue(0)}
                        type="secundary"
                        block
                      >
                        Editar
                      </Button>
                    </div>
                    <div className="infos-pagamento">
                      <div className="info">
                        <h2>Total orçamento</h2>
                        <span>{convertMoney(modalInfo.valor)}</span>
                      </div>
                      <div className="info">
                        <h2>Total pago</h2>
                        <span>
                          {convertMoney(modalInfo.valor - modalInfo.restante)}
                        </span>
                      </div>
                      <div className="info">
                        <h2>Saldo á pagar</h2>
                        <span>{convertMoney(modalInfo.restante)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}

                {modalInfo.pagamento.condicao === "boleto" ? (
                  <>
                    <div className="pagamento-pago">
                      <div className="input-row">
                        <div className="input-label">
                          <div className="header-pagamento">
                            <span>Entrada</span>
                          </div>
                          <div className="painel-pagamento">
                            <InputNumber
                              formatter={(e) => convertMoney(e)}
                              parser={(e) => currencyToInt(e)}
                              className="painel-value"
                              disabled={pagamentoValue > 0}
                              // defaultValue={0}
                              onChange={(e) =>
                                setResumoCobrancaEntrada({
                                  ...resumoCobrancaEntrada,
                                  entrada: e,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="input-label">
                          <div className="header-pagamento">
                            <span>Parcelas</span>
                          </div>
                          <div className="painel-pagamento">
                            <Select
                              style={{ width: "100%" }}
                              onChange={(e) =>
                                setResumoCobrancaEntrada({
                                  ...resumoCobrancaEntrada,
                                  parcelas: e,
                                })
                              }
                            >
                              {(() =>
                                [...Array(10).keys()].map((row) => {
                                  return (
                                    <Option key={row + 1} value={row + 1}>
                                      {" "}
                                      {row + 1} X de{" "}
                                      {convertMoney(
                                        (modalInfo.valor -
                                          resumoCobrancaEntrada.entrada) /
                                          (row + 1)
                                      )}
                                      {/* {convertMoney( (getTotalProcedimentos() - entrada) / (row + 1) )} */}
                                    </Option>
                                  );
                                }))()}
                            </Select>
                            {/* <TableNew columns={columnsModalReceber} dataSource={modalInfo.procedimentos.filter(item => item.status === 'pago')} pagination={false} /> */}
                          </div>
                        </div>
                      </div>

                      <div className="input-row">
                        
                        <div className="input-label">
                          <div className="header-pagamento">
                            <span>Celular do cliente</span>
                          </div>
                          <div className="painel-pagamento">
                            <InputMask
                              mask="(99) 99999-9999"
                              className="input-mask"
                              onChange={(e) => {}}
                              defaultValue={paciente.tel}
                            />
                          </div>
                        </div>

                        <div className="input-label">
                          <div className="header-pagamento">
                            <span>Vencimento</span>
                          </div>
                          <div className="painel-pagamento">
                            <DatePicker
                              disabledDate={(data) =>
                                data < moment() ? true : false
                              }
                              locale={local}
                              style={{ width: "100%" }}
                              onChange={(e) => {
                                console.log(e);
                                setResumoCobrancaEntrada({
                                  ...resumoCobrancaEntrada,
                                  vencimento: e,
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      

                      <div className="input-label">
                        <div className="header-pagamento">
                          <span>Cpf do cliente</span>
                        </div>
                        <div
                          className="painel-pagamento"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <InputMask
                            mask="999.999.999-99"
                            className="input-mask"
                            onChange={(e) => {}}
                            defaultValue={paciente.cpf}
                          />
                          <Upload {...props}>
                            <Button icon={<UploadOutlined />}>Clique para enviar</Button>
                          </Upload>
                        </div>
                      </div>

                     
 
                      <div className="input-label">
                        <div className="header-pagamento">
                          <span>E-mail do cliente</span>
                        </div>
                        <div
                          className="painel-pagamento"
                          style={{ display: "flex" }}
                        >
                          <Input
                            className="painel-value"
                            defaultValue={paciente.email}
                            value={emailVerify}
                            onChange={(e) => setEmailVerify(e.target.value)}
                          />
                          <Button
                            type="primary"
                            onClick={() => handleVerifyEmail()}
                          >
                            Verificar e-mail
                          </Button>
                        </div>
                      </div>

                      {tokenSave ? (
                        <div className="input-label">
                          <div className="header-pagamento">
                            <span>Código recebido no e-mail</span>
                          </div>
                          <div
                            className="painel-pagamento"
                            style={{ display: "flex" }}
                          >
                            <Input
                              className="painel-value"
                              value={tokenVerify}
                              onChange={(e) => setTokenVerify(e.target.value)}
                            />
                            <Button
                              type="primary"
                              onClick={() => handleVerifyEmail()}
                            >
                              Verificar Código
                            </Button>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}

                      <Button
                        onClick={() => {
                          setResumoCobranca({
                            ...resumoCobrancaEntrada,
                            valor: modalInfo.valor,
                            tipoCobranca: "Parcelada",
                            metodoPagamento:
                              resumoCobrancaEntrada === 0
                                ? "Boleto"
                                : "Entrada + Boleto",
                            descricao: `Total: ${convertMoney(
                              modalInfo.valor
                            )} sendo entrada de ${convertMoney(
                              resumoCobrancaEntrada.entrada
                            )} + ${
                              resumoCobrancaEntrada.parcelas
                            } parcelas de ${convertMoney(
                              (modalInfo.valor -
                                resumoCobrancaEntrada.entrada) /
                                resumoCobrancaEntrada.parcelas
                            )}, Paciente: ${paciente.name}, Criado por Dr(a). ${
                              avaliador.name
                            }, Clinica: {}`,
                          });
                        }}
                        type="primary"
                        block
                      >
                        Adicionar
                      </Button>
                      <Button
                        onClick={() => setResumoCobranca(undefined)}
                        type="secundary"
                        block
                      >
                        Editar
                      </Button>
                    </div>
                    <div className="infos-pagamento">
                      <div className="info">
                        <h2>Total</h2>
                        <span>{convertMoney(modalInfo.valor)}</span>
                      </div>
                      <div className="info">
                        <h2>Saldo á pagar</h2>
                        <span>{convertMoney(modalInfo.restante)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="container-pagamento2">
              <div className="pagamento-receber">
                <div className="header-panel">
                  <span>Procedimentos á pagar</span>
                </div>

                <div className="painel-pagamento">
                  {modalInfo.pagamento.condicao === "boleto" ? (
                    <div className="resumo-boleto">
                      {resumoCobranca ? (
                        <>
                          <div className="header-panel-resumo">
                            <span>Resumo</span>
                          </div>

                          <div className="info-boleto">
                            <span>Tipo da cobrança</span>
                            <span>{resumoCobranca.tipoCobranca}</span>
                          </div>

                          <div className="info-boleto">
                            <span>Valor da cobrança</span>
                            <span>{convertMoney(resumoCobranca.valor)}</span>
                          </div>

                          <div className="info-boleto">
                            <span>Entrada</span>
                            <span>{convertMoney(resumoCobranca.entrada)}</span>
                          </div>

                          {resumoCobranca.parcelas ? (
                            <div className="info-boleto">
                              <span>Parcelas</span>
                              <span>
                                {resumoCobranca.parcelas} parcelas de{" "}
                                {convertMoney(
                                  (modalInfo.valor - resumoCobranca.entrada) /
                                    resumoCobranca.parcelas
                                )}{" "}
                                (
                                {convertMoney(
                                  modalInfo.valor - resumoCobranca.entrada
                                )}
                                )
                              </span>
                            </div>
                          ) : (
                            ""
                          )}

                          <div className="info-boleto">
                            <span>Nome do cliente</span>
                            <span>{paciente.name}</span>
                          </div>
                          <div className="info-boleto">
                            <span>E-mail do cliente</span>
                            <span>{paciente.email}</span>
                          </div>

                          {resumoCobranca.vencimento ? (
                            <div className="info-boleto">
                              <span>Data vencimento</span>
                              <span>
                                {moment(resumoCobranca.vencimento).format("l")}
                              </span>
                            </div>
                          ) : (
                            ""
                          )}

                          <div className="info-boleto">
                            <span>Método de pagamento</span>
                            <span>{resumoCobranca.metodoPagamento}</span>
                          </div>

                          <div className="info-boleto label-descricao">
                            <span>Descrição</span>
                            <TextArea
                              showCount
                              maxLength={200}
                              value={resumoCobranca.descricao}
                              onChange={(e) =>
                                setResumoCobranca({
                                  ...resumoCobranca,
                                  descricao: e.target.value,
                                })
                              }
                            />
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}

                  {modalInfo.pagamento.condicao === "procedimento" ? (
                    <TableNew
                      columns={columnsModalReceber}
                      dataSource={selecionado}
                      pagination={false}
                    />
                  ) : (
                    ""
                  )}

                  {modalInfo.pagamento.condicao === "total" ? (
                    <TableNew
                      columns={columnsModalTotal}
                      dataSource={
                        pagamentoValue === 0
                          ? []
                          : pagamentoValue === modalInfo.valor
                          ? [columnsModalTotalData[0]]
                          : [columnsModalTotalData[1]]
                      }
                      pagination={false}
                    />
                  ) : (
                    ""
                  )}
                </div>

                <div className="infos-pagamento" style={{ marginTop: 20 }}>
                  {modalInfo.pagamento.condicao === "procedimento" ? (
                    <div className="info">
                      <h2>Total á pagar</h2>
                      <span>
                        {convertMoney(
                          selecionado.reduce((a, b) => a + b.valor, 0)
                        )}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}

                  {modalInfo.pagamento.condicao === "total" ? (
                    <>
                      <div className="info">
                        <h2>Total á pagar</h2>
                        <span>{convertMoney(pagamentoValue)}</span>
                      </div>
                      {/* <div className="info">
                      <h2>Saldo a distribuir</h2>
                      <span>{convertMoney(saldoDistribuir)}</span>
                    </div> */}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {modalInfo.pagamento.condicao === "total" &&
              pagamentoValue <= modalInfo.valor ? (
                <div className="pagamento-receber" style={{ border: 0 }}>
                  <div className="infos-pagamento" style={{ marginTop: 10 }}>
                    {especialidades
                      ? especialidades.map((item, index) => (
                          <div
                            key={index}
                            style={{
                              borderBottom: 0,
                              display: "flex",
                              flexDirection: "column",
                              borderBottom: "1px dashed",
                            }}
                          >
                            <div className="info" style={{ borderBottom: 0 }}>
                              <h2>{item.name}</h2>
                              {/* <span>{convertMoney(item.valor)}</span> */}
                              <span>
                                {" "}
                                Saldo á pagar:{" "}
                                {convertMoney(Number(item.restante))}
                              </span>
                            </div>
                            <div
                              style={{
                                borderBottom: 0,
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Input
                                onClick={(e) => {
                                  console.log("clicou");
                                  zerarValor(item);
                                }}
                                onBlur={(e) => mudarValorDistribuido(item)}
                                disabled={
                                  pagamentoValue === 0 || item.restante === 0
                                }
                                style={{ width: "50%" }}
                                value={
                                  item.valorAplicado > item.restante
                                    ? item.restante
                                    : item.valorAplicado
                                }
                                onChange={(e) =>
                                  handleChangeValueEspecialidade(e, index, item)
                                }
                              />
                              <Tooltip placement="top" title="Confirmar">
                                <span
                                  onClick={() => {}}
                                  style={{ cursor: "pointer" }}
                                  className="svg-icon menu-icon"
                                >
                                  <CheckCircleOutlined
                                    style={{
                                      color:
                                        Number(item.valor) -
                                          Number(item.valorAplicado) >
                                        0
                                          ? "blue"
                                          : Number(item.valor) -
                                              Number(item.valorAplicado) ===
                                            0
                                          ? "green"
                                          : "red",
                                    }}
                                  />
                                </span>
                              </Tooltip>
                            </div>
                          </div>
                        ))
                      : ""}

                    <div className="info">
                      <h2>Total Especalidades</h2>
                      <span>
                        {convertMoney(
                          especialidades.reduce(
                            (a, b) => Number(a) + Number(b.valorAplicado),
                            0
                          )
                        )}
                      </span>
                    </div>
                    {/* <div className="info" style={{marginTop: 20}}>
                    <h2>Total especialidades</h2>
                    <span>{convertMoney(pagamentoValue)}</span>
                  </div> */}

                    {/* <div className="info" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: 0}}>
                      <h2>Clinico Geral</h2>
                      <Input />
                    </div>
                    <div className="info" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: 0}}>
                      <h2>RaioX</h2>
                      <Input />
                    </div> */}
                  </div>
                </div>
              ) : (
                ""
              )}

              {modalInfo.pagamento.condicao === "total" ? (
                <div className="pagamento-pago-hidden">
                  <div className="header-pagamento">
                    <span>Selecione a forma de pagamento</span>
                  </div>
                  <Select
                    disabled={selecionado.length <= 0 || pagamentoValue === 0}
                    style={{ width: "100%", marginBottom: 10 }}
                    options={[
                      {
                        label: "Dinheiro",
                        value: "dinheiro",
                      },
                      {
                        label: "Débito",
                        value: "debito",
                      },
                      {
                        label: "Crédito",
                        value: "credito",
                      },
                    ]}
                    onChange={(e) => {
                      console.log(e);
                      setFormaPagamento(e);
                    }}
                  />

                  {modalInfo.pagamento.condicao === "total" ? (
                    <Button
                      onClick={() => {
                        handlePagamento(modalInfo.pagamento.condicao);
                      }}
                      type="primary"
                      block
                      disabled={
                        pagamentoValue === 0 ||
                        especialidades.reduce(
                          (a, b) => Number(a) + Number(b.valorAplicado),
                          0
                        ) !== Number(pagamentoValue)
                      }
                    >
                      Receber
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}

              {modalInfo.pagamento.condicao === "procedimento" ? (
                <div className="pagamento-pago-hidden">
                  <div className="header-pagamento">
                    <span>Selecione a forma de pagamento</span>
                  </div>
                  <Select
                    disabled={selecionado.length <= 0}
                    style={{ width: "100%", marginBottom: 10 }}
                    options={[
                      {
                        label: "Dinheiro",
                        value: "dinheiro",
                      },
                      {
                        label: "Débito",
                        value: "debito",
                      },
                      {
                        label: "Crédito",
                        value: "credito",
                      },
                    ]}
                    onChange={(e) => {
                      console.log(e);
                      setFormaPagamento(e);
                    }}
                  />

                  {modalInfo.pagamento.condicao === "procedimento" ? (
                    <Button
                      onClick={() => {
                        handlePagamento(modalInfo.pagamento.condicao);
                      }}
                      type="primary"
                      block
                      disabled={!formaPagamento || selecionado.length <= 0}
                    >
                      Receber
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}

              {modalInfo.pagamento.condicao === "boleto" ? (
                <div className="pagamento-pago-hidden">
                  <Button
                    onClick={() => {
                      handlePagamento(modalInfo.pagamento.condicao);
                    }}
                    type="primary"
                    block
                    disabled={!resumoCobranca}
                  >
                    Receber entrada e gerar boletos
                  </Button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </Modal>
      <Modal
        centered
        visible={modalReceber ? true : false}
        onOk={() => setModalReceber(undefined)}
        onCancel={() => setModalReceber(undefined)}
        closable={false}
        width={"80%"}
        footer={null}
      >
        {modalReceberInfo ? (
          <div className="pagamento-container">
            <div className="container-pagamento2">
              <div className="pagamento-receber">
                <div className="header-panel">
                  <span>Opções de pagamento</span>
                </div>
                <div className="painel-pagamento">
                  <TableNew
                    columns={columnsModalReceber}
                    dataSource={[modalReceberInfo]}
                    pagination={false}
                  />
                </div>
                <div className="infos-pagamento" style={{ marginTop: 20 }}>
                  <div className="info">
                    <h2>Total á pagar</h2>
                    <span>{convertMoney(modalReceberInfo.valor)}</span>
                  </div>
                </div>
              </div>

              <div className="pagamento-receber" style={{ border: 0 }}>
                <div className="infos-pagamento" style={{ marginTop: 10 }}>
                  <div
                    className="info"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      borderBottom: 0,
                    }}
                  >
                    <h2>Clinico Geral</h2>
                    <Input />
                  </div>
                  <div
                    className="info"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      borderBottom: 0,
                    }}
                  >
                    <h2>RaioX</h2>
                    <Input />
                  </div>
                </div>
              </div>

              <div className="pagamento-pago-hidden">
                <div className="header-pagamento">
                  <span>Selecione a forma de pagamento</span>
                </div>
                <Select
                  style={{ width: "100%", marginBottom: 10 }}
                  defaultValue={modalReceberInfo.formaPagamento}
                  options={[
                    {
                      label: "Dinheiro",
                      value: "dinheiro",
                    },
                    {
                      label: "Débito",
                      value: "debito",
                    },
                    {
                      label: "Crédito",
                      value: "credito",
                    },
                  ]}
                  onChange={(e) => {
                    console.log(e);
                    setModalReceberInfo({
                      ...modalReceberInfo,
                      formaPagamento: e,
                    });
                  }}
                />
                <Button
                  onClick={() => {
                    handlePagamentoProcedimento(modalReceberInfo.id);
                  }}
                  type="primary"
                  block
                  disabled={!formaPagamento && !modalReceberInfo.formaPagamento}
                >
                  Receber
                </Button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </Modal>
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
        <TableNew
          columns={columns}
          dataSource={orcamentos}
          expandable
          pagination={false}
          expandable={{
            expandedRowRender: (record, index, indent, expanded) =>
              InnerTable(record, index, indent, expanded),
            // expandedRowClassName: () => ' expanded-row-newtable'
          }}
        />
      </CardBody>
    </Card>
  );
}
