
import React, { useEffect, useState } from "react";
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import { AdicionarOrcamentoPage } from "~/app/pages/orcamento/AdicionarOrcamentoPage";
import { EditarOrcamentoPage } from "~/app/pages/orcamento/EditarOrcamentoPage";
import { Link } from 'react-router-dom'
import SVG from 'react-inlinesvg'
import { store, getProcedimentos, orcamento, destroy, aprovar, show } from '~/app/controllers/orcamentoController';
import { update, index } from '~/app/controllers/controller';
import { useSelector } from "react-redux";
import {format} from 'date-fns-tz'
import { FolderOpenOutlined, DeleteOutlined,
  EditOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { Table as TableNew, Modal as ModalNew, Tag, Space, Tooltip, Input, notification, Tabs, Checkbox } from 'antd';
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody
} from "~/_metronic/_partials/controls";

import { Modal, Button, Form, Col, InputGroup, Table } from 'react-bootstrap'
import { set } from "lodash";

const { TabPane } = Tabs

export function Orcamentos() {
  const {user: {authToken}} = useSelector((state) => state.auth);
  const { params, url } = useRouteMatch()
  const [showForm, setShowForm] = useState(false)
  const [showFormEdit, setShowFormEdit] = useState(false)
  const [showAddSaldo, setShowAddSaldo] = useState(false)
  const [saldo, setSaldo] = useState({undefined})
  const [enviarComissao, setEnviarComissao] = useState(true)
  const [ logout, setLogout ] = useState(false)
  const [orcamentos, setOrcamentos] = useState([])
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState([])
  const [ getOrcamento, setGetOrcamento ] = useState([])
  const [showOrcamento, setShowOrcamento] = useState(false)
  const [reload, setReload] = useState(false)
  const [activeKey, setActiveKey] = useState('0')
  const history = useHistory();

  notification.config({
    placement: 'bottomRight',
    duration: 3,
  });

// useEffect(() => {
//     orcamento(authToken, params.id)
//     .then( ({data}) => {
//       console.log(data)
//       setOrcamentos(data)
//     }).catch((err)=>{
//       if (err.response.status === 401) {
//         setLogout(true)
//       }
//     })
// }, [reload, activeKey])

useEffect(() => {
  index(authToken, `/list_orcamentos/${params.id}?status=${activeKey}`)
    .then( ({data}) => {
      console.log(data)
      setOrcamentos(data)
    }).catch((err)=>{
      if (err.response.status === 401) {
        setLogout(true)
      }
    })
}, [reload, activeKey])

function handleDelete(id) {
  destroy(authToken, id).then(()=>{
    setReload(!reload)
  }).catch((err)=> console.log(err))
}

function handleEdit(orcamento) {
  setOrcamentoSelecionado(orcamento)
  setShowFormEdit(true);
}

function handleShow(id) {
  show(authToken, id).then(({data}) => {
    setGetOrcamento({
      ...data,
      dentes: data.procedimentos_orcamentos.map(item => {
        return {
          ...item,
          faces: JSON.parse(item.faces)
        }
      })
    })
  })
  setShowOrcamento(true)
}

function handleAprovar(id) {
  aprovar(authToken, id).then(()=>{
    setReload(!reload)
    setShowOrcamento(false)
    setGetOrcamento([])
  })
}

function ReturnStatus(status) {
  switch (status) {
    case 0:
      return (
        <strong style={{color: 'red'}}>Salvo</strong>
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

const convertMoney = (value) => {
  return value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
}

const returnSaldo = (value) => {
  if (value < 0) {
    return <span style={{color: 'red'}}> {convertMoney(value)} </span>
  }
  return <span style={{color: 'green'}}> {convertMoney(value)} </span>
}

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'Data',
    dataIndex: 'criado_em',
    key: 'criado_em'
  },
  {
    title: 'Dentista',
    dataIndex: 'dentistas',
    key: 'dentista',
    render: data => <span>{data.name}</span>
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: data => <span>{data}</span>
  },
  {
    title: 'Valor',
    dataIndex: 'total',
    key: 'valor',
    render: data => <span>{convertMoney(data)}</span>
  },
  {
    title: 'Saldo',
    dataIndex: 'saldo_disponivel',
    key: 'saldo',
    render: data => <span>{returnSaldo(data)}</span>
  },
  {
    title: 'Ações',
    key: 'acoes',
    render: data => (
      <Space size="middle">
        {
          orcamento.status !== 3 ? 
          <Tooltip placement="top" title="Excluir">
            <span onClick={() => handleDelete(data.id) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
              <DeleteOutlined />
            </span>
          </Tooltip>
          : ''
        }
          <Tooltip placement="top" title="Visualizar">
            <span onClick={() => handleShow(data.id) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
              <FolderOpenOutlined twoToneColor="#eb2f96"/>
            </span>
          </Tooltip>
          <Tooltip placement="top" title="Editar">
            <span onClick={() => handleEdit(data) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
              <EditOutlined />
            </span>
          </Tooltip>
          <Tooltip placement="top" title="Saldo">
            <span onClick={() => {
              console.log(data)
              setSaldo({id: data.id, dentista: data.dentistas.name})
              setShowAddSaldo(true)
            }}  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
              <DollarCircleOutlined />
            </span>
          </Tooltip>
      </Space>
    )
  }
]

const handleAddSaldo = () => {
  update(authToken, '/paciente/saldo', saldo.id, {valor: saldo.value, tipo: 0, enviarComissao }).then(_ => {
    setSaldo({undefined})
    setShowAddSaldo(false)
    setReload(!reload)

    return notification.success({
      message: `Saldo Adicionado!`,
      description:
        'O saldo foi adicionado ao orçamento.',
    });
  })
}

function HandleOrcamento() {
  if (showFormEdit) {
    return <EditarOrcamentoPage orcamento={orcamentoSelecionado} alterar={orcamentoSelecionado !== undefined} />
  }

  if (showForm) {
    return <AdicionarOrcamentoPage orcamento={orcamentoSelecionado} alterar={orcamentoSelecionado !== undefined} />
  }

  if (!showForm) {
    return (
      <Card>
        <CardHeader title="Orçamentos">
          <CardHeaderToolbar>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { 
                setShowForm(true) 
                setOrcamentoSelecionado(undefined);
              }}
            >
              Adicionar Orcamento
              </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div style={{display: 'flex', flex: 1}}>
            <Tabs
              size="small"
              tabPosition="left"
              defaultActiveKey="0"
              activeKey={activeKey}
              onChange={(e) => setActiveKey(e)}
            >
            <TabPane tab="Salvos" key="salvo" />
          
            <TabPane tab="Aprovados" key="aprovado" />

            <TabPane tab="Em andamento" key="andamento" />
    
            <TabPane tab="Finalizados" key="finalizado" />

            <TabPane tab="Todos" key="0" />
           </Tabs>
            <TableNew dataSource={orcamentos} columns={columns} style={{width: '100%', paddingLeft: 10}}/>
          </div>
        </CardBody>
      </Card>
    )
  }
  return
}

  const returnFormaCobranca = (forma) => {
    switch (forma) {
      case 'procedimento':
        return 'Procedimento'
        
      case 'parcial':
        return 'Parcial'
        
    
      default:
        return forma
    }
  }

  return (
    <>
      <ModalNew 
        title="Adicionar Saldo" 
        visible={showAddSaldo} 
        onOk={() => handleAddSaldo()} 
        onCancel={() => {
          setShowAddSaldo(false)
          setSaldo({undefined})
        }}>
        <Input
          value={saldo.value}
          onChange={e => setSaldo({...saldo, value: e.target.value})}
          placeholder="100,00"
          prefix="R$"
        />

        <Checkbox 
        style={{marginTop: 15}} 
        defaultChecked={enviarComissao} 
        onChange={(e) => {setEnviarComissao(e.target.checked)}}
        > Enviar comissão ao dentista {saldo.dentista} ?
        </Checkbox>


      </ModalNew>
      <Modal
        show={showOrcamento}
        size="lg"
      >
        <Modal.Header>
          Orçamento
        </Modal.Header>
        <Modal.Body>
        <Table striped bordered hover>
            <thead>
                <tr>
                  <th>
                  Informações
                  </th>
                </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Dentista
                </td>
                <td>
                  {getOrcamento.dentistas ? getOrcamento.dentistas.name : ''}
                </td>
              </tr>
              <tr>
                <td>
                  Data
                </td>
                <td>
                  {getOrcamento.criado_em}
                </td>
              </tr>
              <tr>
                <td>
                  Status
                </td>
                <td>
                  {ReturnStatus(getOrcamento.status)}
                </td>
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
             { getOrcamento.dentes ? 
               getOrcamento.dentes.map( orcamento => (
                <tr key={orcamento.id}>
                <td>
                  {orcamento.procedimento_nome}
                </td>
                <td>
                  { orcamento.label ? orcamento.label : 'Geral' }
                </td>
                <td>
                  {orcamento.faces ? orcamento.faces.map(face => (
                    <span style={{color: 'red'}}>{face.label}
                    {' '}</span>
                  )): 'Geral'}
                </td>
                <td>
                  {orcamento.valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                </td>
                <td>
                  {orcamento.status === 1 ? <span style={{color: 'green'}}>Executado</span> : <span style={{color: 'red'}}>Pendente</span>}
                </td>
              </tr>
               )) : ''
             }
            </tbody>
          </Table>
          <Table striped bordered hover>
            <thead>
                <tr>
                  <th>
                  Forma de pagamento
                  </th>
                </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Forma Cobrança
                </td>
                <td>
                  {returnFormaCobranca(getOrcamento.cobranca)}
                </td>
              </tr>
              <tr>
                <td>
                  Forma de Pagamento
                </td>
                <td>
                  {getOrcamento.pagamento === 'dinheiro' ? 'Dinheiro' : 'Boleto'}
                </td>
              </tr>
              <tr>
                <td>
                  Condição de Pagamento
                </td>
                <td>
                  {getOrcamento.condicao === 'vista' ? 'À vista' : 'Parcelado'}
                </td>
              </tr>
              
                {getOrcamento.condicao === 'parcelado' ?
                  <tr>
                    <td>
                      Parcelamento
                    </td>
                    <td>
                      {getOrcamento.total ? `Entrada de ${getOrcamento.entrada.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} + ` : ''}
                      <span style={{color: 'red'}}>
                      {`${getOrcamento.parcelas} X ${((getOrcamento.total - getOrcamento.entrada) / getOrcamento.parcelas).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`}
                      </span>
                    </td>
                  </tr>
                : ''}
              
            </tbody>
          </Table>
          <div className="text-right" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span>Total <strong>{getOrcamento.total ? getOrcamento.total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) : ''}</strong></span>            
             <div>
              {getOrcamento.status === 0 ? (
                <Button onClick={() => {handleAprovar(getOrcamento.id)}} className="mr-2" variant="primary">
                  Aprovar
                </Button>
              ) : ''}
              <Button onClick={() => {setShowOrcamento(false)}} className="mr-2" variant="danger">
                Fechar
              </Button>
             </div>
          </div>
        </Modal.Body>
      </Modal>
      <HandleOrcamento />
    </>
  );
}
