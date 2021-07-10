import React, { useEffect, useState } from 'react';

import {
  Table,
  Modal,
  Select,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Upload,
  Tooltip,
  Form
} from 'antd'
import { UploadOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { convertMoney, convertDate, currencyToInt } from '~/modules/Util'
import { FormRow, Notify } from '~/modules/global'
import { useSelector } from 'react-redux'

import { store, show } from '~/controllers/controller'
import { useRouteMatch } from 'react-router-dom'

import BoletoModal from './components/boleto'
import TotalModal from './components/total'
import ProcedimentoModal from './components/procedimento'

import {
  Container,
} from './styles';

function ModalPayment({ modal, setModalInfo, close }) {
  const { token } = useSelector(state => state.auth)

  const { params } = useRouteMatch()

  const [desconto, setDesconto] = useState(undefined)
  const [procedimentos, setProcedimentos] = useState([])
  const [passwordCode, setPasswordCode] = useState('')
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

  useEffect(() => {
    if (modal) {
      setProcedimentos(modal.procedimentos)
    }
  }, [modal])

  function update() {
    show(token, "/orcamentos", modal.id).then(async ({ data }) => {
      const paciente = await show(token, "/patient", params.id).then(({ data }) => {
        return data
      })
      setModalInfo({ ...data, paciente });
    });
  }

  // useEffect(() => {
  //   // console.log(desconto)

  // }, [desconto])

  const ReturnModal = (props) => {
    if (!modal) {
      return <></>
    }

    if (modal.pagamento.condicao === 'procedimento') {
      return <ProcedimentoModal {...props} />
    }
    if (modal.pagamento.condicao === 'boleto') {
      return <BoletoModal {...props} />
    }
    if (modal.pagamento.condicao === 'total') {
      return <TotalModal {...props} />
    }


  }

  const clearPasswordCode = () => {
    setTimeout(() => {
      setPasswordCode('')
    }, 30000);
  }

  const handleDesconto = () => {
    if (desconto) {
      store(token, '/procedimentoExecucao', { ...desconto, passwordCode }).then(({ data }) => {
        update()
        setDesconto(undefined)
        clearPasswordCode()
        Notify('success', 'Autorizado', 'Seu desconto foi autorizado')
      }).catch(({ data }) => {
        Notify('error', 'Negado', 'Seu desconto não foi autorizado')
        clearPasswordCode()
      })
    }
  }

  return (
    <Container>
      <Modal
        title="Liberar desconto"
        visible={desconto ? true : false}
        onCancel={() => setDesconto(undefined)}
        onOk={() => handleDesconto()}
      >
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
      <Modal
        centered
        visible={modal ? true : false}
        onCancel={() => close()}
        width={"80%"}
        footer={null}
      >
        {modal ? (
          <ReturnModal
            close={close}
            data={{ ...modal, procedimentos, columnsModalReceber, changeFormaPagamento: close }}
            setModalInfo={setModalInfo}
            setDesconto={setDesconto}
            desconto={desconto}
          />
        ) : (
          ""
        )}
      </Modal>
    </Container>
  )
}

export default ModalPayment;

// const Extra = () => {
//   return (
//     <Select
//     style={{ width: "50%" }}
//     // defaultValue={
//     //   modal.pagamento
//     //     ? modal.pagamento.condicao
//     //     : undefined
//     // }
//     options={[
//       {
//         label: "Total",
//         value: "total",
//       },
//       {
//         label: "Procedimento",
//         value: "procedimento",
//       },
//       {
//         label: "Boleto",
//         value: "boleto",
//       },
//     ]}
//     />
//   )
// }

// function Boleto (props) {

//   return (
//     <div>
//       <div className="pagamento-pago">
//         <div className="input-row">
//           <div className="input-label">
//             <div className="header-pagamento">
//               <span>Entrada</span>
//             </div>
//             <div className="painel-pagamento">
//               <InputNumber
//                 formatter={(e) => convertMoney(e)}
//                 parser={(e) => currencyToInt(e)}
//                 className="painel-value"
//                 disabled={pagamentoValue > 0}
//                 // defaultValue={0}
//                 onChange={(e) =>
//                   setResumoCobrancaEntrada({
//                     ...resumoCobrancaEntrada,
//                     entrada: e,
//                   })
//                 }
//               />
//             </div>
//           </div>
//           <div className="input-label">
//             <div className="header-pagamento">
//               <span>Parcelas</span>
//             </div>
//             <div className="painel-pagamento">
//               <Select
//                 style={{ width: "100%" }}
//                 onChange={(e) =>
//                   setResumoCobrancaEntrada({
//                     ...resumoCobrancaEntrada,
//                     parcelas: e,
//                   })
//                 }
//               >
//                 {(() =>
//                   [...Array(10).keys()].map((row) => {
//                     return (
//                       <Option key={row + 1} value={row + 1}>
//                         {" "}
//                         {row + 1} X de{" "}
//                         {convertMoney(
//                           (modal.valor -
//                             resumoCobrancaEntrada.entrada) /
//                             (row + 1)
//                             )}
//                         {/* {convertMoney( (getTotalProcedimentos() - entrada) / (row + 1) )} */}
//                       </Option>
//                     );
//                   }))()}
//               </Select>
//               {/* <Table columns={columnsModalReceber} dataSource={modal.procedimentos.filter(item => item.status === 'pago')} pagination={false} /> */}
//             </div>
//           </div>
//         </div>

//         <div className="input-row">

//           <div className="input-label">
//             <div className="header-pagamento">
//               <span>Vencimento</span>
//             </div>
//             <div className="painel-pagamento">
//               <DatePicker
//                 disabledDate={(data) =>
//                   data < moment() ? true : false
//                 }
//                 locale={local}
//                 style={{ width: "100%" }}
//                 onChange={(e) => {
//                   console.log(e);
//                   setResumoCobrancaEntrada({
//                     ...resumoCobrancaEntrada,
//                     vencimento: e,
//                   });
//                 }}
//               />
//             </div>
//           </div>

//         </div>

//         <Button
//           onClick={() => setResumoCobranca(undefined)}
//           type="secundary"
//           block
//           >
//           Editar
//         </Button>
//       </div>
//       <div className="infos-pagamento">
//         <div className="info">
//           <h2>Total</h2>
//           <span>{convertMoney(modal.valor)}</span>
//         </div>
//         <div className="info">
//           <h2>Saldo á pagar</h2>
//           <span>{convertMoney(modal.restante)}</span>
//         </div>
//       </div>
//     </div>
//   )
// }


// {modal.pagamento.condicao === "total" ? (
  //   <>
  //     <div className="pagamento-pago">
  //       <div className="header-pagamento">
  //         <span>Valor a pagar</span>
  //       </div>
  //       <div className="painel-pagamento">
  //         <Input
  //           disabled={pagamentoValue > 0}
  //           defaultValue={modal.restante}
  //           onChange={(e) => setPagamentoValue2(e.target.value)}
  //         />
  //         {/* <Table columns={columnsModalReceber} dataSource={modal.procedimentos.filter(item => item.status === 'pago')} pagination={false} /> */}
  //       </div>
  //       <Button
  //         onClick={() => {
    //           setPagamentoValue(pagamentoValue2);
    //         }}
//         type="primary"
//         block
//       >
//         Adicionar
//       </Button>
//       <Button
//         onClick={() => setPagamentoValue(0)}
//         type="secundary"
//         block
//       >
//         Editar
//       </Button>
//     </div>
//     <div className="infos-pagamento">
//       <div className="info">
//         <h2>Total orçamento</h2>
//         <span>{convertMoney(modal.valor)}</span>
//       </div>
//       <div className="info">
//         <h2>Total pago</h2>
//         <span>
//           {convertMoney(modal.valor - modal.restante)}
//         </span>
//       </div>
//       <div className="info">
//         <h2>Saldo á pagar</h2>
//         <span>{convertMoney(modal.restante)}</span>
//       </div>
//     </div>
//   </>
// ) : (
  //   ""
  // )}


  // const columnsModalTotal = [
  //   {
  //     title: "Descrição",
  //     dataIndex: "descricao",
  //   },
  //   {
  //     title: "Valor",
  //     dataIndex: "valor",
  //     render: (data) => <span>{data ? convertMoney(data) : ""}</span>,
  //   },
  // ];

  // const columnsModalTotalData = [
  //   {
  //     descricao: "Pagamento total do orçamento",
  //     valor: modal ? modal.valor : "",
  //   },
  //   {
  //     descricao: "Pagamento parcial do orçamento",
  //     valor: pagamentoValue,
  //   },
  // ];

  // const rowSelection = {
  //   onChange: (rowKey, selectedRows) => {
  //     console.log(selectedRows);
  //     setSelecionado(selectedRows);
  //   },
  //   getCheckboxProps: (record) => ({
  //     disabled:
  //       record.status === "pago" || modal.pagamento.condicao === "total",
  //   }),
  // };

  // const handlePagamento = (data) => {
  //   if (data === "procedimento") {
  //     store(token, "/orcamento/pagamento", {
  //       condicao: data,
  //       orcamento_id: modal.id,
  //       procedimento_ids: selecionado,
  //       formaPagamento,
  //       valor: selecionado.reduce((a, b) => a + b.valor, 0),
  //     }).then((data) => {
  //       // setPagamentoValue(0);
  //       // setSaldoDistribuir([]);
  //       // setPagamentoValue2(0);
  //       // console.log(data);
  //     });

  //     // setModal(undefined);
  //     // setSelecionado([]);

  //     return;
  //   }

  //   if (data === "total") {
  //     store(token, "/orcamento/pagamento", {
  //       condicao: data,
  //       orcamento_id: modal.id,
  //       // procedimento_ids: selecionado,
  //       formaPagamento,
  //       valor: Number(pagamentoValue),
  //       especialidades: especialidades,
  //     }).then((data) => {
  //       // setPagamentoValue(0);
  //       // setSaldoDistribuir([]);
  //       // setPagamentoValue2(0);
  //       // console.log(data);
  //     });

  //     // setModal(undefined);
  //     // setSelecionado([]);

  //     return;
  //   }

  //   if (data === "boleto") {
  //     store(token, "/orcamento/pagamento", {
  //       condicao: data,
  //       orcamento_id: modal.id,
  //       formaPagamento: "boleto",
  //       valor: modal.valor,
  //       cobranca: resumoCobranca,
  //     }).then((data) => {
  //       // setResumoCobranca(undefined);
  //       // setResumoCobrancaEntrada({});
  //     });
  //   }
  //   // setPaymentInfos(data);
  //   // setModal(true);
  //   // setmodal(false);
  // };

  // const zerarValor = (item) => {
  //   // let saldos = saldoDistribuir;

  //   // let index = saldos.findIndex((current) => current.id === item.id);
  //   // console.log("index", index);
  //   // console.log(saldos[index]);
  //   // saldos[index] = { ...item, valorAplicado: 0 };
  //   // console.log(saldos[index]);

  //   // setSaldoDistribuir(saldos);
  // };

  // const mudarValorDistribuido = (item) => {
  //   // let saldos = [...saldoDistribuir, item];
  //   // let saldosFinal = [];

  //   // saldos.forEach((item) => {
  //   //   if (!saldosFinal.some((el, i) => el.id === item.id)) {
  //   //     saldosFinal.push(item);
  //   //   } else {
  //   //     var index = saldosFinal.findIndex((current) => item.id === current.id);

  //   //     saldosFinal[index].valorAplicado = item.valorAplicado;
  //   //   }
  //   // });

  //   // setSaldoDistribuir(saldosFinal);
  // };

  // const handleChangeValueEspecialidade = (e, index, item) => {
  //   // let valor = Number(e.target.value);
  //   // let totalEspecialidade = Number(
  //   //   saldoDistribuir.reduce((a, b) => Number(a) + Number(b.valorAplicado), 0)
  //   // );

  //   // const returnValor = () => {
  //   //   if (totalEspecialidade + valor > pagamentoValue) {
  //   //     return pagamentoValue - totalEspecialidade;
  //   //   }

  //   //   if (valor > pagamentoValue) {
  //   //     return pagamentoValue;
  //   //   } else if (valor > item.restante) {
  //   //     return item.restante;
  //   //   }

  //   //   if (totalEspecialidade > pagamentoValue) {
  //   //     return totalEspecialidade - pagamentoValue;
  //   //   }

  //   //   return valor;
  //   // };

  //   // setEspecialidades(
  //   //   especialidades.map((current, i) => {
  //   //     if (i === index) {
  //   //       return {
  //   //         ...current,
  //   //         valorAplicado: returnValor(),
  //   //         // restante: Number(current.restante) - Number(current.valorAplicado),
  //   //       };
  //   //     } else {
  //   //       return { ...current };
  //   //     }
  //   //   })
  //   // );
  // };