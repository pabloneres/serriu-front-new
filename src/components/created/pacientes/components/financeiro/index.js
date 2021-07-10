import React, { useState, useEffect } from 'react';

import { Table, Space, Tooltip, Card } from 'antd'
import { DollarCircleOutlined, FolderOpenOutlined, EditOutlined } from '@ant-design/icons'
import { index, show } from '~/controllers/controller'
import { useSelector, useDispatch } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'

import { convertMoney, convertDate } from '~/modules/Util'

import CardTable from './components/card'

import ModalPayment from './components/modalPayment'

function Financeiro({ reloadTab }) {
  const { token } = useSelector(state => state.auth)

  const { params } = useRouteMatch()

  const [modal, setModal] = useState(undefined)
  const [reload, setReload] = useState(false)
  const [modalInfo, setModalInfo] = useState(undefined);

  const [selecionado, setSelecionado] = useState([]);
  const [pagamentoValue2, setPagamentoValue2] = useState(0);
  const [especialidades, setEspecialidades] = useState([]);

  const [paciente, setPaciente] = useState({})

  const [orcamentos, setOrcamentos] = useState([])

  useEffect(() => {
    index(
      token,
      `orcamentos?paciente_id=${params.id}&status=${""}&returnType=1`
    )
      .then(({ data }) => {
        setOrcamentos(data);
      })
      .catch((err) => { });
  }, [reload, reloadTab, modalInfo]);

  useEffect(() => {
    if (!modal) {
      return
    }
    show(token, "/orcamentos", modal).then(async ({ data }) => {
      const paciente = await show(token, "/patient", params.id).then(({ data }) => {
        return data
      })
      setModalInfo({ ...data, paciente });
    });
  }, [modal]);

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
              <FolderOpenOutlined twoToneColor="#eb2f96" />
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
                    setModal(data.id);
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
  ];

  const InnerTable = (record) => {
    return (
      <Table
        dataSource={record.pagamentos}
        columns={columns2}
        pagination={false}
      />
    );
  };


  return (
    <>
      <ModalPayment
        modal={modalInfo}
        close={() => {
          setModalInfo(undefined)
          setModal(undefined)
          setReload(!reload)
        }}
        setModalInfo={setModalInfo}
      />

      {
        orcamentos.map(card => (
          <CardTable data={card} modal={(e) => setModal(e)} />
        ))
      }

      {/* <Table
        columns={columns}
        expandable
        // expandRowByClick
        dataSource={orcamentos.map(item => ({
          ...item,
          key: item.id,
        }))}
        expandable={{
          rowExpandable: (record) => record.pagamentos.length > 0,
          expandedRowRender: (record, index, indent, expanded) =>
            InnerTable(record, index, indent, expanded),
          // expandedRowClassName: () => ' expanded-row-newtable'
        }}
      /> */}
    </>
  )
}

export default Financeiro;
