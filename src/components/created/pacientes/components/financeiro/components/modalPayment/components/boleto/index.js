import React, { useState, useEffect } from 'react';

import { Table, Select, Button, Tooltip, Input, InputNumber, DatePicker, Form, Modal } from 'antd'
import moment from 'moment'
import {
  Container,
  ContainerSide,
  ContainerSideBody,
  FormRow,
  InfoRow,
  ResumoContainer
} from './styles';

import { store, show } from '~/controllers/controller'

import { useSelector } from 'react-redux'

import { CheckCircleOutlined } from '@ant-design/icons'

import { convertMoney, convertDate, currencyToInt } from '~/modules/Util'
import ContainerHeader from '../container'

import { FormJustify, Notify } from '~/modules/global'

import EditableTable from '../EditableTable';
import Extra from '../Extra'

import local from "antd/es/date-picker/locale/pt_BR"
const { TextArea } = Input
const { Option } = Select


function Boleto({ data, desconto, setDesconto, close }) {

  console.log(data)

  const { token } = useSelector(state => state.auth)
  const { selectedClinic } = useSelector(state => state.clinic)

  console.log(selectedClinic)

  const [resumoCobranca, setResumoCobranca] = useState()
  const [selectionType, setSelectionType] = useState("checkbox");
  const [modalEntradaMinima, setModalEntradaMinima] = useState(undefined);

  const [selecionado, setSelecionado] = useState();
  const [paciente, setPaciente] = useState({});
  const [dentista, setDentista] = useState({});
  const [pagamentoValue, setPagamentoValue] = useState();
  const [formaPagamento, setFormaPagamento] = useState();
  const [especialidades, setEspecialidades] = useState();
  const [resumoCobrancaEntrada, setResumoCobrancaEntrada] = useState({});


  const [passwordCode, setPasswordCode] = useState('');



  const rowSelection = {
    onChange: (rowKey, selectedRows) => {
      console.log(selectedRows);
      setSelecionado(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled:
        record.status === "pago" || data.pagamento.condicao === "boleto",
    }),
  };
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
  const zerarValor = () => { }
  const mudarValorDistribuido = () => { }
  const handleChangeValueEspecialidade = () => { }

  const handlePagamento = (gerar) => {
    store(token, "/pagamento", {
      condicao: 'boleto',
      orcamento_id: data.id,
      formaPagamento: formaPagamento,
      valor: data.valorDesconto,
      cobranca: resumoCobranca,
      gerarBoletos: gerar,
    }).then((data) => {
      setResumoCobranca(undefined);
      setResumoCobrancaEntrada({});
      close()
    });
  };


  useEffect(() => {
    show(token, 'patient', data.paciente_id).then(({ data }) => {
      setPaciente(data)
    })
    show(token, 'users', data.avaliador).then(({ data }) => {
      setDentista(data)
    })
  }, [data, token])

  if (!data) {
    return (<></>)
  }

  const returnDescricao = () => {
    return `Total: ${convertMoney(data.valorDesconto)}, sendo entrada de ${convertMoney(resumoCobrancaEntrada.entrada)} + ${resumoCobrancaEntrada.parcelas} parcelas de ${convertMoney((data.valorDesconto - resumoCobrancaEntrada.entrada) / resumoCobrancaEntrada.parcelas)} Paciente: ${paciente.firstName + ' ' + paciente.lastName}, Dr(a). ${dentista.firstName + ' ' + dentista.lastName}, Clinica: ${selectedClinic.name}
    `
  }

  const returnDisabledVerified = () => {
    if (
      paciente.email_verified === 0 ||
      paciente.cpf_verified === 0 ||
      paciente.rg_verified === 0 ||
      paciente.address_verified === 0 ||
      paciente.tel_verified === 0
    ) {
      return true // true = desabilitado
    }

    return false
  }

  const handleDesconto = () => {
    store(token, '/permissaoCode', {
      passwordCode,
      orcamento_id: data.id,
      action: 'entrada',
      paciente: data.paciente.firstName + ' ' + data.paciente.lastName,
      entradaAntes: Number((data.valor * selectedClinic.config.entMinima) / 100),
      entradaDepois: modalEntradaMinima.entrada
    }).then(({ data }) => {
      clearPasswordCode()
      setModalEntradaMinima(undefined)
      Notify('success', 'Autorizado', 'Seu desconto foi autorizado')
    }).catch(({ data }) => {
      Notify('error', 'Negado', 'Seu desconto não foi autorizado')
      entradaNegada()
    })
  }

  const entradaNegada = () => {
    clearPasswordCode()
    setModalEntradaMinima(undefined)
    setResumoCobrancaEntrada({ ...resumoCobrancaEntrada, entrada: 0 })
  }

  const clearPasswordCode = () => {
    setPasswordCode('')
  }

  const handleVerificarValorEntrada = () => {
    if (Number(resumoCobrancaEntrada.entrada) < Number((data.valor * selectedClinic.config.entMinima) / 100)) {
      setModalEntradaMinima({ entrada: resumoCobrancaEntrada.entrada })
    }
  }
  return (
    <Container>
      <Modal
        onCancel={() => entradaNegada()}
        onOk={() => { handleDesconto() }}
        visible={modalEntradaMinima ? true : false}>
        <Form layout="vertical" >
          <FormRow columns={1}>
            <Form.Item label="Senha financeira">
              <Input
                onChange={(e) => setPasswordCode(e.target.value)}
                type="password"
                value={passwordCode}
              />
            </Form.Item>
          </FormRow>
        </Form>
      </Modal>
      <ContainerSide>
        <ContainerHeader title="Opções de pagamento" extra={() => Extra({ pagamento: data.pagamento, pagamentos: data.pagamentos, callback: data.changeFormaPagamento })} />
        <ContainerSideBody>

          <div className="pagamento-receber">
            <div className="header-pagamento">
              <span>A receber</span>
            </div>
            <div className="painel-pagamento">
              <EditableTable
                data={data.procedimentos.map((item) => ({
                  ...item,
                  key: item.id,
                }))}
                setDesconto={setDesconto}
                desconto={desconto}
              // select={true}
              // setSelecionado={setSelecionado}
              />
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
            </div>
          </div>

          <div>
            <div className="pagamento-pago">
              <Form layout="vertical">
                <FormRow columns={2}>
                  <Form.Item label="Entrada">
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={(e) => convertMoney(e)}
                      onBlur={() => handleVerificarValorEntrada({})}
                      parser={(e) => currencyToInt(e)}
                      value={resumoCobrancaEntrada.entrada}
                      className="painel-value"
                      disabled={data.pagamentoValue > 0}
                      onChange={(e) =>
                        setResumoCobrancaEntrada({
                          ...resumoCobrancaEntrada,
                          entrada: e > data.valor ? data.valor : e,
                        })
                      }
                    />
                    <span>Entrada mínima de {selectedClinic.config.entMinima}% = {convertMoney((data.valor * selectedClinic.config.entMinima) / 100)}</span>
                  </Form.Item>

                  <Form.Item label="Forma de pagamento" >
                    <Select
                      disabled={!resumoCobrancaEntrada.entrada}
                      style={{ width: "100%" }}
                      options={[
                        {
                          label: 'Dinheiro',
                          value: 'dinheiro'
                        },
                        {
                          label: 'Crédito',
                          value: 'credito'
                        },
                        {
                          label: 'Débito',
                          value: 'debito'
                        },
                        {
                          label: 'Pix',
                          value: 'pix'
                        },
                      ]}
                      onChange={(e) => {
                        setFormaPagamento(e);
                      }}
                    />
                  </Form.Item>

                </FormRow>
                <FormRow columns={2} >

                  <Form.Item label="Parcelas" >
                    <Select
                      disabled={!resumoCobrancaEntrada.entrada}
                      style={{ width: "100%" }}
                      options={[...Array(selectedClinic.config.maxParcelas).keys()].map(item => ({
                        label: item + 1 + 'X' + convertMoney((data.valorDesconto - resumoCobrancaEntrada.entrada) / (item + 1)),
                        value: item + 1
                      }))}
                      onChange={(e) =>
                        setResumoCobrancaEntrada({
                          ...resumoCobrancaEntrada,
                          parcelas: e,
                        })
                      }
                    />
                  </Form.Item>

                  <Form.Item label='Vencimento'>
                    <DatePicker
                      disabled={!resumoCobrancaEntrada.entrada}
                      disabledDate={(data) =>
                        data < moment() ? true : false
                      }
                      locale={local}
                      format="DD/MM/YYYY"
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        console.log(e);
                        setResumoCobrancaEntrada({
                          ...resumoCobrancaEntrada,
                          vencimento: e,
                        });
                      }}
                    />
                  </Form.Item>

                </FormRow>

              </Form>

              <Button
                onClick={() => setResumoCobranca({
                  tipoCobranca: 'Total',
                  valor: data.totalDesconto,
                  metodoPagamento: data.pagamento.condicao,
                  descricao: returnDescricao(),
                  ...resumoCobrancaEntrada,
                })}
                disabled={!resumoCobrancaEntrada.entrada}
                type="primary"
                block
              >
                Adicionar
              </Button>
              <Button
                onClick={() => setResumoCobranca(undefined)}
                type="secundary"
                block
                disabled={!resumoCobrancaEntrada.entrada}
              >
                Editar
              </Button>
            </div>

            {/* <FormRow columns={3}>
              <Form.Item style={{ marginBottom: 0, marginTop: 20 }} label="Total">
                <span>{convertMoney(data.valor)}</span>
              </Form.Item>
              <Form.Item style={{ marginBottom: 0, marginTop: 20 }} label="Total com desconto">
                <span>{convertMoney(data.valor)}</span>
              </Form.Item>
              <Form.Item style={{ marginBottom: 0, marginTop: 20 }} label="Saldo á pagar">
                <span>{convertMoney(data.restante)}</span>
              </Form.Item>
            </FormRow> */}
            <div>
              <FormJustify>
                <span>Total</span>
                <span>{convertMoney(data.valor)}</span>
              </FormJustify>
              <FormJustify>
                <span>Total com desconto</span>
                <span>{convertMoney(data.valorDesconto)}</span>
              </FormJustify>
              <FormJustify>
                <span>Saldo a pagar</span>
                <span>{convertMoney(data.restante)}</span>
              </FormJustify>
            </div>

          </div>

        </ContainerSideBody>
      </ContainerSide>

      <ContainerSide>
        <div className="pagamento-receber">
          <ContainerHeader title="Procedimentos á pagar" />

          <div className="painel-pagamento">
            <ResumoContainer>
              {resumoCobranca ? (
                <>
                  <div className="header-panel-resumo">
                    <span>Resumo</span>
                  </div>

                  <InfoRow>
                    <span>Tipo da cobrança</span>
                    <span>{resumoCobranca.tipoCobranca}</span>
                  </InfoRow>

                  <InfoRow>
                    <span>Valor da cobrança</span>
                    <span>{convertMoney(data.valorDesconto)}</span>
                  </InfoRow>

                  <InfoRow>
                    <span>Entrada</span>
                    <span>{convertMoney(resumoCobranca.entrada)}</span>
                  </InfoRow>

                  {resumoCobranca.parcelas ? (
                    <InfoRow>
                      <span>Parcelas</span>
                      <span>
                        {resumoCobranca.parcelas} parcelas de{" "}
                        {convertMoney(
                          (data.valorDesconto - resumoCobranca.entrada) /
                          resumoCobranca.parcelas
                        )}{" "}
                        (
                        {convertMoney(
                          data.valorDesconto - resumoCobranca.entrada
                        )}
                        )
                      </span>
                    </InfoRow>
                  ) : (
                    ""
                  )}

                  <InfoRow>
                    <span>Nome do cliente</span>
                    <span>{data.paciente.firstName} {data.paciente.lastName}</span>
                  </InfoRow>

                  <InfoRow>
                    <span>E-mail do cliente</span>
                    <span>{data.paciente.email}</span>
                  </InfoRow>

                  {resumoCobranca.vencimento ? (
                    <InfoRow>
                      <span>Data vencimento</span>
                      <span>
                        {moment(resumoCobranca.vencimento).format("L")}
                      </span>
                    </InfoRow>
                  ) : (
                    ""
                  )}

                  <InfoRow>
                    <span>Método de pagamento</span>
                    <span>{resumoCobranca.metodoPagamento}</span>
                  </InfoRow>

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
            </ResumoContainer>
          </div>

          <div className="infos-pagamento" style={{ marginTop: 20 }}>
            {data.pagamento.condicao === "procedimento" ? (
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

          </div>
        </div>

        {
          returnDisabledVerified() ?
            <div className="pagamento-pago-hidden">
              <Button
                onClick={() => {
                  handlePagamento(false)
                }}
                type="primary"
                block
                disabled={!resumoCobranca}
              >
                Receber entrada e salvar negociação
              </Button>
            </div>
            :
            <div className="pagamento-pago-hidden">
              <Button
                onClick={() => {
                  handlePagamento(true)
                }}
                type="primary"
                block
                disabled={!resumoCobranca}
              >
                Receber entrada e gerar boletos
              </Button>
            </div>

        }

      </ContainerSide>
    </Container>
  )
}

export default Boleto;
