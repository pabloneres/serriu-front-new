import React, { useState, useEffect } from 'react';

import { Table, Select, Button, Tooltip, Input, InputNumber, DatePicker, Form } from 'antd'
import moment from 'moment'
import {
  Container,
  ContainerSide,
  ContainerSideBody,
  FormRow
} from './styles';

import { useSelector } from 'react-redux'
import EditableTable from '../EditableTable'
import { store } from '~/controllers/controller'

import { CheckCircleOutlined } from '@ant-design/icons'

import { convertMoney, convertDate, currencyToInt } from '~/modules/Util'
import ContainerHeader from '../container'

import Extra from '../Extra'

import local from "antd/es/date-picker/locale/pt_BR"
const { TextArea } = Input
const { Option } = Select


function Procedimento({ data, setDesconto, desconto, close }) {
  const { selectedClinic } = useSelector(state => state.clinic)
  const { token } = useSelector(state => state.auth)


  const [resumoCobranca, setResumoCobranca] = useState()
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selecionado, setSelecionado] = useState([]);
  const [paciente, setPaciente] = useState();
  const [pagamentoValue, setPagamentoValue] = useState();
  const [formaPagamento, setFormaPagamento] = useState();
  const [especialidades, setEspecialidades] = useState();
  const [resumoCobrancaEntrada, setResumoCobrancaEntrada] = useState({});

  const rowSelection = {
    onChange: (rowKey, selectedRows) => {
      console.log(selectedRows);
      setSelecionado(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.status === "pago",
    }),
  };

  const columnsModalTotalData = []

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

  const handlePagamento = () => {
    // if (data === "procedimento") {
    store(token, "/pagamento", {
      condicao: 'procedimento',
      orcamento_id: data.id,
      procedimento_ids: selecionado,
      formaPagamento,
      valor: selecionado.reduce((a, b) => a + b.desconto, 0),
    }).then((data) => {
      setPagamentoValue(0);
      close()
    });

    //   // setModal(undefined);
    //   // setSelecionado([]);

    //   return;
    // }

    // if (data === "total") {
    //   store(props.token, "/orcamento/pagamento", {
    //     condicao: data,
    //     orcamento_id: props.modal.id,
    //     // procedimento_ids: selecionado,
    //     formaPagamento,
    //     valor: Number(pagamentoValue),
    //     especialidades: especialidades,
    //   }).then((data) => {
    //     // setPagamentoValue(0);
    //     // setSaldoDistribuir([]);
    //     // setPagamentoValue2(0);
    //     // console.log(data);
    //   });

    //   // setModal(undefined);
    //   // setSelecionado([]);

    //   return;
    // }


    // setPaymentInfos(data);
    // setModal(true);
    // setprops.modal(false);
  };

  if (!data) {
    return (<></>)
  }


  return (
    <Container>
      <ContainerSide>
        <ContainerHeader title="Opções de pagamento" extra={() => Extra({ pagamento: data.pagamento, pagamentos: data.pagamentos, callback: data.changeFormaPagamento })} />
        <ContainerSideBody>

          <div className="pagamento-receber">
            <div className="header-pagamento">
              <span>A receber</span>
            </div>
            <div className="painel-pagamento">
              {/* <Table
                columns={columnsModalReceber}
                dataSource={data.procedimentos.map((item) => ({
                  ...item,
                  key: item.id,
                }))}
                pagination={false}
                rowSelection={{
                  type: selectionType,
                  ...rowSelection,
                }}
                key="id"
              /> */}
              <EditableTable data={data.procedimentos}
                setDesconto={setDesconto}
                desconto={desconto}
                // select={true}
                setSelecionado={setSelecionado}
              />
            </div>
          </div>

          <div>

          </div>

        </ContainerSideBody>
      </ContainerSide>

      <ContainerSide>
        <div className="pagamento-receber">
          <div className="header-panel">
            <span>Procedimentos á pagar</span>
          </div>

          <div className="painel-pagamento">
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
                          (data.valor - resumoCobranca.entrada) /
                          resumoCobranca.parcelas
                        )}{" "}
                        (
                        {convertMoney(
                          data.valor - resumoCobranca.entrada
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


            {/* <Table
              columns={columnsModalReceber}
              dataSource={selecionado}
              pagination={false}
            /> */}
            <EditableTable data={selecionado}
              setDesconto={setDesconto}
              desconto={desconto}
            // select={true}
            />
          </div>

          <div className="infos-pagamento" style={{ marginTop: 40 }}>
            <div className="info" style={{ display: 'flex', marginBottom: 40 }}>
              <h2>Total á pagar</h2>
              <span>
                {convertMoney(
                  selecionado.reduce((a, b) => a + b.desconto, 0)
                )}
              </span>
            </div>
          </div>
        </div>


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
          <Button
            onClick={() => {
              handlePagamento(data.pagamento.condicao);
            }}
            type="primary"
            block
            disabled={!formaPagamento || selecionado.length <= 0}
          >
            Receber
          </Button>
        </div>
      </ContainerSide>
    </Container>
  )
}

export default Procedimento;