import React, { useState, useEffect, useRef, useContext } from 'react';

import { Table, Select, Button, Tooltip, Input, InputNumber, DatePicker, Form, Modal } from 'antd'
import moment from 'moment'
import {
  Container,
  ContainerSide,
  ContainerSideBody,
  ContainerFormRow,
  EspecialidadeContainer,
  EspecialidadeRow
} from './styles';

import { useSelector } from 'react-redux'

import { store } from '~/controllers/controller'

import { CheckCircleOutlined } from '@ant-design/icons'

import { convertMoney, convertDate, currencyToInt } from '~/modules/Util'
import { FormRow, FormJustify } from '~/modules/global'
import ContainerHeader from '../container'

import Extra from '../Extra'
import EditableTable from '../EditableTable'

import local from "antd/es/date-picker/locale/pt_BR"
const { TextArea } = Input
const { Option } = Select

const EditableContext = React.createContext(null);

function Total({ data, setDesconto, desconto, close }) {
  const { selectedClinic } = useSelector(state => state.clinic)
  const { token } = useSelector(state => state.auth)

  const [resumoCobranca, setResumoCobranca] = useState()
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selecionado, setSelecionado] = useState();
  const [paciente, setPaciente] = useState();
  const [pagamentoValue, setPagamentoValue] = useState(0);
  const [pagamentoValue2, setPagamentoValue2] = useState(data.restante);
  const [formaPagamento, setFormaPagamento] = useState();
  const [resumoCobrancaEntrada, setResumoCobrancaEntrada] = useState({});
  const [especialidades, setEspecialidades] = useState([]);
  const [saldoDistribuir, setSaldoDistribuir] = useState([]);

  // const [desconto, setDesconto] = useState(undefined)


  useEffect(() => {
    if (data.pagamento) {

      console.log(data.pagamento)
      console.log(data.pagamentos)
      console.log(data.procedimentos)

      setSelecionado(data.procedimentos.map((item) => ({ ...item, key: item.id })));

      setPagamentoValue2(data.restante);

      if (data.pagamentos.length === 0) {
        let arrEspecialidades = data.procedimentos.map((item) => ({
          id: item.procedimento.especialidade.id,
          name: item.procedimento.especialidade.name,
          valor: item.desconto,
          restante: item.desconto,
          valorAplicado: Number(),
        }))

        let valores = []

        console.log(arrEspecialidades)

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

        const especi = valores.map((item) => ({
          ...item,
          restante: item.valor,
        }))

        setEspecialidades(especi);
        setSaldoDistribuir(especi);

        return;
      } else {

        let especialidadesSemRestante = [];

        let especialidadesOrcamento = data.procedimentos.map((item) => {
          console.log(item)

          return {
            id: item.procedimento.especialidade.id,
            name: item.procedimento.especialidade.name,
            valor: Number(item.desconto),
            valorAplicado: Number(),
          }
        });

        console.table(especialidadesOrcamento)
        // console.table()

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

        ////////////////////////////////////////////////

        let especialidadesComRestante = [];
        let arrEspecialidades = data.pagamentos.map((item) => ({
          id: item.especialidades.id,
          name: item.especialidades.name,
          valor: Number(item.valor),
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
          }
        });

        ///////////////////////////////////////////////

        let especialidadeDiferenca = [];

        especialidadesSemRestante.forEach((item) => {
          if (
            !especialidadesComRestante.some((el, i) => el.id === item.id)
          ) {
            especialidadeDiferenca.push(item);
          } else {
            return;
          }
        });

        ///////////////////////////////////////////////

        let especialidadesFinal = [
          ...especialidadesComRestante,
          ...especialidadeDiferenca,
        ];

        setEspecialidades(especialidadesFinal);
        setSaldoDistribuir(especialidadesFinal);
      }
    }
  }, [data])

  const columnsModalTotalData = [
    {
      descricao: "Pagamento total do orçamento",
      valor: data ? data.valor : "",
    },
    {
      descricao: "Pagamento parcial do orçamento",
      valor: pagamentoValue,
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

  const handlePagamento = () => {
    store(token, "/pagamento", {
      condicao: 'total',
      orcamento_id: data.id,
      // procedimento_ids: selecionado,
      formaPagamento,
      valor: Number(pagamentoValue),
      especialidades: especialidades,
    }).then((data) => {
      setPagamentoValue(0);
      setSaldoDistribuir([]);
      setPagamentoValue2(0);
      close()
      // data.changeFormaPagamento()

    });

  };

  if (!data) {
    return (<></>)
  }

  const rowSelection = {
    onChange: (rowKey, selectedRows) => {
      setSelecionado(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled:
        record.status === "pago" || data.pagamento.condicao === "total",
    }),
  };

  const handleSetValue = (e) => {
    if (e > data.valor) {
      return data.valor
    }

    return e

  }

  const zerarValor = (item) => {
    let saldos = saldoDistribuir;

    let index = saldos.findIndex((current) => current.id === item.id);

    saldos[index] = { ...item, valorAplicado: 0 };

    setSaldoDistribuir(saldos);
  };  // essa função zera o valor aplicado na especialidade

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

  const saveValorAplicado = (index) => {
    setSaldoDistribuir(especialidades.map((current, i) => {
      if (i === index) {
        return {
          ...current,
          // valorAplicado: valor,
          restante: Number(current.restante) - Number(current.valorAplicado),
        };
      } else {
        return { ...current };
      }
    }))
  }

  const handleChangeValueEspecialidade = (e, index, item) => {

    let valor = Number(e.target.value); // valor digitado

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

    setEspecialidades(especialidades.map((current, i) => {
      if (i === index) {
        return {
          ...current,
          valorAplicado: returnValor(),
          // restante: Number(current.restante) - Number(current.valorAplicado),
        };
      } else {
        return { ...current };
      }
    }))

  };

  const total = Number(data.procedimentos.reduce((a, b) => a + b.valor, 0))
  const totalDesconto = Number(data.procedimentos.reduce((a, b) => a + b.desconto, 0))
  const totalPago = Number(data.valorDesconto) - Number(data.restante)

  return (
    <Container columns={2}>
      <ContainerSide>
        <ContainerHeader title="Opções de pagamento" extra={() => Extra({ pagamento: data.pagamento, pagamentos: data.pagamentos, callback: data.changeFormaPagamento })} />
        <ContainerSideBody>

          <div className="pagamento-receber">
            <div className="header-pagamento">
              <span>A receber</span>
            </div>
            <div className="painel-pagamento">
              <EditableTable data={data.procedimentos}
                setDesconto={setDesconto}
                desconto={desconto}
              />
            </div>
          </div>

          <ContainerFormRow style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
            <FormJustify>
              <span>Total</span>
              <span>{convertMoney(total)}</span>
            </FormJustify>

            <FormJustify>
              <span>Total com desconto</span>
              <span>{convertMoney(totalDesconto)}</span>
            </FormJustify>

            <FormJustify>
              <span>Total pago</span>
              <span>{convertMoney(totalPago)}</span>
            </FormJustify>

            <FormJustify>
              <span>Saldo a pagar</span>
              <span>{convertMoney(totalDesconto - totalPago)}</span>
            </FormJustify>
          </ContainerFormRow>

          <div className="pagamento-pago" style={{ marginTop: 20 }}>
            <div className="header-pagamento">
              <span>Valor a pagar</span>

            </div>
            <div className="painel-pagamento">
              <InputNumber
                style={{ width: '100%', marginBottom: 10 }}
                formatter={(e) => convertMoney(e)}
                parser={(e) => currencyToInt(e)}
                defaultValue={data.restante}
                disabled={pagamentoValue > 0}
                value={pagamentoValue2}
                onChange={e => {
                  setPagamentoValue2(handleSetValue(e))
                }}
              />

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

        </ContainerSideBody>
      </ContainerSide>

      <ContainerSide>
        <div className="pagamento-receber">
          <div className="header-panel">
            <span>Procedimentos á pagar</span>
          </div>

          <div className="painel-pagamento">
            <Table
              columns={columnsModalTotal}
              dataSource={
                pagamentoValue === 0 ? [] : pagamentoValue === data.valor ? [columnsModalTotalData[0]] : [columnsModalTotalData[1]]
              }
              pagination={false}
            />
          </div>

          <div className="infos-pagamento" style={{ marginTop: 20 }}>
            <div className="info">
              <h2>Total á pagar</h2>
              <span>{convertMoney(pagamentoValue)}</span>
            </div>

            {/* <div className="info">
              <h2>Saldo a distribuir</h2>
              <span>{convertMoney(saldoDistribuir.reduce((a, b) => Number(a) + Number(b.restante), 0))}</span>
            </div> */}
          </div>
        </div>

        {pagamentoValue <= data.valor ? (
          <EspecialidadeContainer>
            <div className="infos-pagamento" style={{ marginTop: 10, width: '100%' }}>
              {especialidades
                ? especialidades.map((item, index) => {
                  return (
                    <EspecialidadeRow
                      key={index}
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
                            zerarValor(item);
                          }}
                          onBlur={(e) => {
                            saveValorAplicado(index)
                            mudarValorDistribuido(item)
                          }}
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
                            onClick={() => { }}
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
                    </EspecialidadeRow>
                  )
                })
                : ""}


              {
                data.especialidades ?
                  <div className="info">
                    <h2>Total Especalidades</h2>
                    <span>
                      {convertMoney(
                        data.especialidades.reduce(
                          (a, b) => Number(a) + Number(b.valorAplicado), 0
                        )
                      )}
                    </span>
                  </div>
                  : ''}

            </div>
          </EspecialidadeContainer>
        ) : (
          ""
        )}

        <div className="pagamento-pago-hidden">
          <div className="header-pagamento">
            <span>Selecione a forma de pagamento</span>
          </div>
          <Select
            // disabled={selecionado.length <= 0 || pagamentoValue === 0}
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
              setFormaPagamento(e);
            }}
          />

          <Button
            onClick={() => {
              handlePagamento(data.pagamento.condicao);
            }}
            type="primary"
            block
          // disabled={
          //   pagamentoValue === 0 ||
          //   especialidades.reduce(
          //     (a, b) => Number(a) + Number(b.valorAplicado),
          //     0
          //   ) !== Number(pagamentoValue)
          // }
          >
            Receber
          </Button>

        </div>
      </ContainerSide>
    </Container>
  )
}

export default Total;
