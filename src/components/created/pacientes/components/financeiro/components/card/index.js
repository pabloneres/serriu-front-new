import React, { useState, useEffect } from 'react';

import { Table, Space, Tooltip, Modal, Form, Select } from 'antd'
import {
  DeleteOutlined,
  DiffOutlined,
  DollarCircleOutlined,
  FolderOpenOutlined,
  EditOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  BarcodeOutlined,
  ShareAltOutlined
} from '@ant-design/icons'

import { Card, FormRow } from '~/modules/global'
// import { Container } from './styles';
import { convertMoney, upperFirst } from '~/modules/Util'

import { useSelector } from 'react-redux'

import { index } from '~/controllers/controller'

import '../styles.css'

import moment from "moment";
import "moment/locale/pt-br";
moment.locale("pt-br");

function CardItem({ data, modal }) {
  // const [modal, setModal] = useState()
  const { token } = useSelector(state => state.auth)

  const [modalRecebimentoDinheiro, setModalRecebimentoDinheiro] = useState(undefined)
  const [pagamentos, setPagamentos] = useState([])

  useEffect(() => {
    index(token, '/metodosPagamento').then(({ data }) => {
      setPagamentos(data)
    })
  }, [])


  if (!data) {
    return <></>
  }

  function convertDate(data) {
    return moment(data).format("L") + " - " + moment(data).format("LT");
  };

  function convertDateNoTime(data) {
    return moment(data).format("L");
  };

  const ReturnProcedimento = (id) => {
    let index = data.procedimentos.findIndex(proc => proc.id === id)
    return data.procedimentos[index]
  }

  const ReturnStatus = (status) => {
    switch (status) {
      case 'salvo':
        return <span style={{ color: 'orange' }} >Cliente não verificado</span>
      case 'pago':
        return <span style={{ color: 'green' }} >Pago</span>

      default:
        return status
    }
  }

  const confirmarRecebimentoDinheiro = (data) => {
    setModalRecebimentoDinheiro(data)
  }

  const handleConfirmar = () => {

  }

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
              onClick={() => { }}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <FolderOpenOutlined twoToneColor="#fff" />
            </span>
          </Tooltip>
          {/* <Tooltip placement="top" title="Editar">
            <span
              onClick={() => { }}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <EditOutlined />
            </span>
          </Tooltip> */}
          {
            data.status !== 'pago' ?
              <Tooltip placement="top" title="Definir pagamento">
                <span
                  onClick={() => {
                    modal(data.id);
                  }}
                  style={{ cursor: "pointer" }}
                  className="svg-icon menu-icon"
                >
                  <DollarCircleOutlined />
                </span>
              </Tooltip> : ''
          }
        </Space>
      ),
    },
  ]

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
    // {
    //   title: "Ações",
    //   render: (data) => (
    //     <Space size="middle">
    //       <Tooltip placement="top" title="Pagamento">
    //         <span
    //           onClick={() => {
    //             setModalReceber(data.procedimento_id);
    //           }}
    //           style={{ cursor: "pointer" }}
    //           className="svg-icon menu-icon"
    //         >
    //           <DollarCircleOutlined />
    //         </span>
    //       </Tooltip>
    //       <Tooltip placement="top" title="Editar">
    //         <span
    //           onClick={() => {}}
    //           style={{ cursor: "pointer" }}
    //           className="svg-icon menu-icon"
    //         >
    //           <EditOutlined />
    //         </span>
    //       </Tooltip>
    //     </Space>
    //   ),
    // },
  ]

  const InnerTableBoleto = (record) => {
    let pagamentos = []

    pagamentos.push(record.pagamentos[0])

    record.boletos.forEach(item => {
      pagamentos.push(item)
    });

    return (
      <Table
        dataSource={pagamentos}
        columns={columnsBoletoInner}
        pagination={false}
      />
    );
  }

  const columnsBoleto = [
    {
      title: "Orçamento",
      dataIndex: "id",
    },
    {
      title: "Aprovado em",
      dataIndex: "data_aprovacao",
      render: (data) => <span>{convertDate(data)}</span>,
    },
    {
      title: "Condição de pagamento",
      dataIndex: "pagamento",
      render: data => <span>{upperFirst(data.condicao)}</span>
    },
    {
      title: "Valor total",
      dataIndex: "valor",
      render: (data) => <span>{convertMoney(data)}</span>,
    },
    {
      title: "Entrada",
      dataIndex: "pagamento",
      render: (data) => <span>{convertMoney(data.entrada)}</span>,
    },
    {
      title: "Qnt. parcelas",
      dataIndex: "pagamento",
      render: (pag) => <span>{pag.parcelas}X {convertMoney((data.valor - pag.entrada) / pag.parcelas)}</span>,
    },
    {
      title: "Parcelado",
      dataIndex: "pagamento",
      render: (pag) => <span>{convertMoney(data.valorDesconto - pag.entrada)}</span>,
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
              onClick={() => { }}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <FolderOpenOutlined twoToneColor="#fff" />
            </span>
          </Tooltip>
          {/* <Tooltip placement="top" title="Editar">
            <span
              onClick={() => { }}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <EditOutlined />
            </span>
          </Tooltip> */}
          {
            data.status !== 'pago' ?
              <Tooltip placement="top" title="Definir pagamento">
                <span
                  onClick={() => {
                    modal(data.id);
                  }}
                  style={{ cursor: "pointer" }}
                  className="svg-icon menu-icon"
                >
                  <DollarCircleOutlined />
                </span>
              </Tooltip> : ''
          }
        </Space>
      ),
    },
  ]

  const columnsBoletoInner = [
    {
      title: "Criado em",
      dataIndex: "created_at",
      render: (data) => <span>{convertDate(data)}</span>,
    },
    {
      title: "Descrição",
      dataIndex: "description",
      width: 300,
      render: (data) => (
        <>
          {
            data ? (
              <Tooltip overlayStyle={{ maxWidth: 400, minWidth: 400 }} placement="top" title={data}>
                <span>{String(data).substr(0, 30)}...</span>
              </Tooltip>
            ) : 'Entrada'
          }
        </>
      ),
    },
    {
      title: "Parcela",
      render: (parcelas) => <span>{parcelas.numberParcela ? parcelas.numberParcela + '/' + data.pagamento.parcelas : '-'}</span>,
    },
    {
      title: "Valor",
      render: (data) => <span>{data.valor ? convertMoney(data.valor) + ` (${data.formaPagamento})` : convertMoney(data.value)}</span>,
    },
    {
      title: "Vencimento",
      dataIndex: "vencimento",
      render: (data) => <span>{data ? convertDateNoTime(data) : '-'}</span>,
    },
    {
      title: "Pagamento",
      render: (data) => (
        <span>
          {data.paymentDate
            ?
            <>{convertDate(data.paymentDate)} <CheckCircleOutlined /></>
            : data.valor ?
              convertDateNoTime(data.updated_at) :
              <ClockCircleOutlined />}</span>),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (data) => <span>{ReturnStatus(data)}</span>,
    },
    {
      title: 'Ações',
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
          <Tooltip placement="top" title="Visualizar boleto">
            <span
              onClick={() => { }}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <BarcodeOutlined twoToneColor="#fff" />
            </span>
          </Tooltip>
          <Tooltip placement="top" title="Confirmar recebimento em dinheiro">
            <span
              onClick={() => { confirmarRecebimentoDinheiro(data) }}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <DollarCircleOutlined twoToneColor="#fff" />
            </span>
          </Tooltip>
          {/* <Tooltip placement="top" title="Remover">
            <span
              onClick={() => { }}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <DeleteOutlined twoToneColor="#fff" />
            </span>
          </Tooltip> */}
          <Tooltip placement="top" title="Compartilhar boleto">
            <span
              onClick={() => { }}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <ShareAltOutlined twoToneColor="#fff" />
            </span>
          </Tooltip>
        </Space>
      )
    }
  ]

  const InnerTableTotal = (record) => {
    return (
      <Table
        dataSource={record.pagamentos}
        columns={columnsTotalInner}
        pagination={false}
      />
    );
  }

  const columnsTotal = [
    {
      title: "Orçamento",
      dataIndex: "id",
    },
    {
      title: "Aprovado em",
      dataIndex: "data_aprovacao",
      render: (data) => <span>{convertDate(data)}</span>,
    },
    {
      title: "Condição de pagamento",
      dataIndex: "pagamento",
      render: data => <span>{upperFirst(data.condicao)}</span>
    },
    // {
    //   title: "Tipo (analisar)",
    //   dataIndex: "pagamento",
    //   render: (data) => <span>{convertDate(data)}</span>,
    //   key: "data_aprovacao",
    // },
    {
      title: "Total orçamento",
      dataIndex: "valor",
      render: (data) => <span>{convertMoney(data)}</span>,
    },
    {
      title: "Total com desconto",
      dataIndex: "valorDesconto",
      render: (data) => <span>{convertMoney(data)}</span>,
    },
    {
      title: "Total pago",
      render: (data) => <span>{convertMoney(data.procedimentos.reduce((a, b) => a + b.desconto, 0) - data.restante)}</span>,
    },
    {
      title: "Total a receber",
      dataIndex: "restante",
      render: (data) => <span>{convertMoney(data)}</span>,
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
              onClick={() => { }}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <FolderOpenOutlined twoToneColor="#fff" />
            </span>
          </Tooltip>
          {/* <Tooltip placement="top" title="Editar">
            <span
              onClick={() => { }}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <EditOutlined />
            </span>
          </Tooltip> */}
          {
            data.status !== 'pago' ?
              <Tooltip placement="top" title="Definir pagamento">
                <span
                  onClick={() => {
                    modal(data.id);
                  }}
                  style={{ cursor: "pointer" }}
                  className="svg-icon menu-icon"
                >
                  <DollarCircleOutlined />
                </span>
              </Tooltip> : ''
          }
        </Space>
      ),
    },
  ]

  const columnsTotalInner = [
    {
      title: "Data",
      dataIndex: "created_at",
      render: (data) => <span>{convertDate(data)}</span>,
    },
    {
      title: "Procedimento",
      dataIndex: "procedimento_id",
      render: (data) => <span>{data ? data : 'Pagamento parcial'}</span>,
    },
    {
      title: "Especialidade",
      dataIndex: 'especialidades',
      render: (data) => <span>{data ? data.name : '-'}</span>,
    },
    // {
    //   title: "Quantidade",
    //   dataIndex: "data_aprovacao",
    //   render: (data) => <span>{convertDate(data)}</span>,
    //   key: "data_aprovacao",
    // },
    {
      title: "Total da especialidade",
      dataIndex: "valor",
      render: (data) => <span>{convertMoney(data)}</span>,
    },
    {
      title: "Valor pago",
      // dataIndex: 'valorAplicado',
      render: (data) => <span>{convertMoney(data.valorAplicado)} ({data.formaPagamento}) </span>,
    },
    {
      title: "Total a receber",
      render: (data) => <span>{convertMoney(data.restanteOrcamento)}</span>,
    },
  ]

  const InnerTableProcedimento = (record) => {
    return (
      <Table
        dataSource={record.pagamentos}
        columns={columnsProcedimentoInner}
        pagination={false}
      />
    );
  }

  const columnsProcedimento = [
    {
      title: "Orçamento",
      dataIndex: "id",
    },
    {
      title: "Aprovado em",
      dataIndex: "data_aprovacao",
      render: (data) => <span>{convertDate(data)}</span>,
    },
    {
      title: "Condição de pagamento",
      dataIndex: "pagamento",
      render: data => <span>{upperFirst(data.condicao)}</span>
    },
    // {
    //   title: "Tipo (analisar)",
    //   dataIndex: "pagamento",
    //   render: (data) => <span>{convertDate(data)}</span>,
    //   key: "data_aprovacao",
    // },
    {
      title: "Total orçamento",
      dataIndex: "valor",
      render: (data) => <span>{convertMoney(data)}</span>,
    },
    {
      title: "Total com desconto",
      dataIndex: "valorDesconto",
      render: (data) => <span>{convertMoney(data)}</span>,
    },
    {
      title: "Total pago",
      render: (data) => <span>{convertMoney(data.valorDesconto - data.restante)}</span>,
    },
    {
      title: "Total a receber",
      render: (data) => <span>{convertMoney(data.restante)}</span>,
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
              onClick={() => { }}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <FolderOpenOutlined twoToneColor="#fff" />
            </span>
          </Tooltip>
          {/* <Tooltip placement="top" title="Editar">
            <span
              onClick={() => { }}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <EditOutlined />
            </span>
          </Tooltip> */}
          {
            data.status !== 'pago' ?
              <Tooltip placement="top" title="Definir pagamento">
                <span
                  onClick={() => {
                    modal(data.id);
                  }}
                  style={{ cursor: "pointer" }}
                  className="svg-icon menu-icon"
                >
                  <DollarCircleOutlined />
                </span>
              </Tooltip> : ''
          }
        </Space>
      ),
    },
  ]

  const columnsProcedimentoInner = [
    {
      title: "Data",
      dataIndex: "created_at",
      render: (data) => <span>{convertDate(data)}</span>,
    },
    {
      title: "Procedimento",
      dataIndex: "procedimento_id",
      render: (id) => <span>{id ? ReturnProcedimento(id).procedimento.name : '-'}</span>,
    },
    {
      title: "Valor procedimento",
      dataIndex: 'procedimentos',
      render: (data) => <span>{convertMoney(data.valor)}</span>,
    },
    {
      title: "Valor desconto",
      render: (data) => <span>{convertMoney(data.desconto)}</span>,
    },
    {
      title: "Valor pago",
      render: (data) => <span>{convertMoney(data.desconto)} ({data.formaPagamento}) </span>,
    },
    {
      title: "Total a receber",
      render: (data) => <span>{convertMoney(data.restanteOrcamento)}</span>,
    },
  ]


  const ReturnTable = () => {
    if (data.pagamento.condicao === 'boleto') {
      return (
        <Table pagination={false} columns={columnsBoleto} dataSource={[data]}
          expandable={{
            rowExpandable: (record) => record.pagamentos.length > 0,
            expandedRowRender: (record, index, indent, expanded) =>
              InnerTableBoleto(record, index, indent, expanded),
          }} />
      )
    }
    if (data.pagamento.condicao === 'total') {
      return (
        <Table pagination={false} columns={columnsTotal} dataSource={[data]}
          expandable={{
            rowExpandable: (record) => record.pagamentos.length > 0,
            expandedRowRender: (record, index, indent, expanded) =>
              InnerTableTotal(record, index, indent, expanded),
          }}
        />
      )
    }
    if (data.pagamento.condicao === 'procedimento') {
      return (
        <Table pagination={false} columns={columnsProcedimento} dataSource={[data]}
          expandable={{
            rowExpandable: (record) => record.pagamentos.length > 0,
            expandedRowRender: (record, index, indent, expanded) =>
              InnerTableProcedimento(record, index, indent, expanded),
          }}
        />
      )
    }
  }

  return (
    <Card>
      <Modal
        visible={modalRecebimentoDinheiro ? true : false}
        onCancel={() => setModalRecebimentoDinheiro(undefined)}
        onOk={() => handleConfirmar()}
        title="Confirmar recebimento"
      >
        {
          modalRecebimentoDinheiro ? (
            <Form layout="vertical" >
              <span style={{ marginTop: 10, marginBottom: 10 }}>Deseja confirmar o recebimento da parcela Nº{modalRecebimentoDinheiro.numberParcela} no valor de {convertMoney(modalRecebimentoDinheiro.value)} ?</span>
              <FormRow style={{ marginTop: 10 }} columns={1}>
                <Form.Item label="Forma de pagamento">
                  <Select
                    options={pagamentos.map(item => ({
                      label: item.name,
                      value: item.value
                    }))}
                  />
                </Form.Item>
              </FormRow>
            </Form>
          ) : <></>
        }
      </Modal>
      <ReturnTable />
    </Card>)
}

export default CardItem;
