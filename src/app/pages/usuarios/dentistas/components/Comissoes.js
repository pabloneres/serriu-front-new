import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardHeaderToolbar } from "~/_metronic/_partials/controls";
import { Link } from "react-router-dom";

import { Table, Modal, Button, Form, Col, InputGroup } from "react-bootstrap";

import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive, sortCaret  } from "~/_metronic/_helpers";

import { index, update, show, store} from "~/app/controllers/controller";
import BootstrapTable from "react-bootstrap-table-next";
import ActionsColumnFormatter from '~/utils/ActionsColumnFormatter'
import { Table as TableNew, Tag, Space, Tooltip, Input, notification, Tabs, Statistic } from 'antd';
import { FolderOpenOutlined, DeleteOutlined,
  EditOutlined, DollarCircleOutlined } from '@ant-design/icons';
import Select from 'react-select'

import moment from "moment";
import "moment/locale/pt-br";
moment.locale("pt-br");

const {TabPane} = Tabs
const atualData = () => {
  let atual = new Date()
  atual = moment(atual).format()

  var separados = atual.split(':')
  separados = separados[0] + ':' + separados[1]

  return separados
}

export function Comissoes(props) {
  const { params, url } = useRouteMatch();
  const id = params.id
  const { intl } = props;
  const {
    user: { authToken }
  } = useSelector(state => state.auth);
  const history = useHistory();

  const [reload, setReload] = useState(false);
  const [dentistData, setDentistData] = useState({})
  const [config, setConfig] = useState({})
  
  const [option, setOption] = useState('pagar')
  const [padrao, setPadrao] = useState(false)
  const [values, setValues] = useState({})
  const [activeKey, setActiveKey] = useState('pagar')

  const [optionsStatus, setOptionsStatus] = useState([
    {
      label: 'Todos',
      value: undefined
    },
    {
      label: 'Pendente',
      value: 'pagar'
    },
    {
      label: 'Pago',
      value: 'pago'
    },
  ])

  const [selectionType, setSelectionType] = useState('checkbox')
  const [pagamentos, setPagamentos] = useState([])
  const [ordemData, setOrdemData] = useState(undefined)
  const [showOrdemDetais, setShowOrdemDetais] = useState(false)
  const [selecionado, setSelecionado] = useState([])
  const [modalPayment, setModalPayment] = useState(false)
  const [comissaoDetails, setComissaoDetails] = useState(undefined)

  useEffect(() => {
    show(authToken, '/dentist', id)
    .then(({data}) => {
      setDentistData(data[0])
    })
    .catch((err)=> history.push('/dentista'))

    index(authToken, `/configuracao/comissao/${id}`).then(({ data }) => {
      setConfig(data)
    })
 
    index(authToken, `/comissao/valores/${id}`).then(({ data }) => {
      setValues(data)
    })

  }, [authToken, reload, padrao]);

  useEffect(() => {
    index(authToken, `/comissao/${id}?status=${activeKey}`).then(
      ({ data }) => {
        setPagamentos(data);
      }
    );
  }, [activeKey])

  useEffect(() => {
    index(authToken, `/comissao/${id}?status=${activeKey}`).then(
      ({ data }) => {
        setPagamentos(data);
      }
    );
  }, [padrao])

  const convertMoney = (value) => {
    return Number(value).toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL"
    })
  }

  const returnStatusComissao = (status) => {
    switch (status) {
      case 0:
        return 'Não executado' 
    
      case 1:
        return 'Aguardando cliente' 
     
      case 2:
      return 'Pendente' 

      case 3:
      return 'Pago' 
    
      default:
        return status;
    }

    return 
  }

  const returnDate = (date) => {
    return moment(date).format('LLLL')
  }

  const editComissao = (id) => {
    index(authToken, `/comissao/ordem?ordem_id=${id}`).then(({ data }) => {
        setOrdemData(data);
      }
    )
  }
  
  const showDetails = (id) => {
    show(authToken, `/comissao/detalhes`, id).then(({ data }) => {
      setComissaoDetails(data[0]);
    })
  }

  const handleUpdateComissao = (id) => {
    update(authToken, `/comissao/ordem`, id, {comissao: ordemData.comissao}).then(({ data }) => {
      setPadrao(!padrao)
    })
    setOrdemData(undefined)
  }

  const handlePayment = async () => {
    store(authToken, `/caixa/dentista/${id}`, {
      valor: selecionado.reduce((a, b) => a + b.valor_comissao, 0),
      data: atualData(),
      tipo: 0,
      ordens: selecionado
    }).then( _ => {
      setSelecionado([])
      setModalPayment(false)
      setPadrao(!padrao)
      setReload(!reload)
      setOption(!option)
    })
  }

  const columns = [
    {
      dataIndex: "pacientes",
      title: "Paciente",
      render: data => <span>{data.name}</span>
    },
    {
      dataIndex: "executado_em",
      title: "Data de execução",
      render: data => <span>{returnDate(data)}</span>
    },
    {
      dataIndex: "status_comissao",
      title: "Status",
      render: data => <span>{returnStatusComissao(data)}</span>,
    },
    {
      dataIndex: "",
      title: "Aprovado",
    },
    {
      dataIndex: "valor_total",
      title: "Valor",
      render: data => <span>{convertMoney(data)}</span>,
    },
    {
      dataIndex: "valor_comissao",
      title: "Valor Comissão",
      sort: true,
      render: data => <span>{convertMoney(data)}</span>,
    },
    {
      title: "Ações",
      classes: "text-right pr-0",
      render: data => (
        <Space size="middle">
          <Tooltip placement="top" title="Visualizar">
            <span onClick={() => showDetails(data.id) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
              <FolderOpenOutlined twoToneColor="#eb2f96"/>
            </span>
          </Tooltip>
          <Tooltip placement="top" title="Editar">
            <span onClick={() => editComissao(data.id) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
              <EditOutlined />
            </span>
          </Tooltip>
        </Space>
      )
    },
  ];

  const handleOnSelect = (row, isSelect) => {
    if (row.status_comissao === 3) {
      return false
    }
    if (isSelect) {
      setSelecionado([...selecionado, row])
    } else {
      setSelecionado(
        selecionado.filter(x => x !== row)
      )
    }
  }

  const handleOnSelectAll = (isSelect, rows) => {
    const ids = rows.map(r => r);
    if (isSelect) {
      setSelecionado(ids)
    } else {
      setSelecionado([])
    }
  }

  const selectRow = {
    mode: 'checkbox',
    clickToSelect: false,
    selected: selecionado.id,
    onSelect: handleOnSelect,
    onSelectAll: handleOnSelectAll,
    nonSelectable: pagamentos.map(r => r.status_comissao !== 'pagar' ? r.id : null),
  };

  const rowSelection = {
    onChange: ( rowKey, selectedRows) => {
      setSelecionado(selectedRows)
    },
    getCheckboxProps: (record) => ({
      disabled: record. status_comissao !== 'pagar' ,
      // Column configuration not to be checked
      name: record.name,
    }),
  };


  const rowStyle = (row, rowIndex) => {
    const style = {};
    if (row.status_comissao === 2) {
      style.backgroundColor = '#E7FCED';
    } else if (row.status_comissao === 1){
      style.backgroundColor = '#E7F9FC';
    } else {
      style.backgroundColor = '#fff';
    }

    return style;
  };

  return (
    <Card>
      <Modal
        show={comissaoDetails ? true : false}
        size="lg"
      >
        <Modal.Header>
          Procedimento
        </Modal.Header>
        <Modal.Body>
        {
          comissaoDetails ? 
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
                  Executado em
                </td>
                <td>
                  {returnDate(comissaoDetails.executado_em)}
                </td>
              </tr>
              <tr>
                <td>
                  Status
                </td>
                <td>
                  {returnStatusComissao(comissaoDetails.status_comissao)}
                </td>
              </tr>
              <tr>
                <td>
                  Valor
                </td>
                <td>
                  {convertMoney(comissaoDetails.valor_total)}
                </td>
              </tr>
              <tr>
                <td>
                  Valor Comissão
                </td>
                <td>
                  {convertMoney(comissaoDetails.valor_comissao)}
                </td>
              </tr>
              <tr>
                <td>
                  Calculo Comissão
                </td>
                <td>
                  {comissaoDetails.comissao} %
                </td>
              </tr>
            </tbody>
          </Table> : <></>
        }
          {
            comissaoDetails ? 
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
             { comissaoDetails.procedimentos ? 
                <tr key={comissaoDetails.orcamento_id}>
                <td>
                  {comissaoDetails.procedimentos.procedimento_nome}
                </td>
                <td>
                  { comissaoDetails.procedimentos.label ? comissaoDetails.procedimentos.label : 'Geral' }
                </td>
                <td>
                  {comissaoDetails.procedimentos.faces ? JSON.parse(comissaoDetails.procedimentos.faces).map(face => (
                    <span style={{color: 'red'}}>{face.label}
                    {' '}</span>
                  )): 'Geral'}
                </td>
                <td>
                  {convertMoney(comissaoDetails.procedimentos.valor)}
                </td>
                <td>
                  {comissaoDetails.procedimentos.status === 1 ? <span style={{color: 'green'}}>Executado</span> : <span style={{color: 'red'}}>Pendente</span>}
                </td>
              </tr>
              : ''
             }
            </tbody>
          </Table> : <></>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => {setComissaoDetails(undefined)}} className="mr-2" variant="danger">
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={modalPayment} size="lg" onHide={() => setModalPayment(false)} centered>
        <Modal.Header>
          Pagar Dentista
        </Modal.Header>
        <Modal.Body>
          <Form.Row className="justify-content-md-center">
            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Data</Form.Label>
              <Form.Control 
                type="datetime-local" 
                defaultValue={atualData()}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row className="justify-content-md-center">
            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Valor R$</Form.Label>
              <Form.Control 
                type="number" 
                defaultValue={selecionado.reduce((a, b) => a + b.valor_comissao, 0)}
                disabled
              />
            </Form.Group>
          </Form.Row>
          <span>Clique em confirmar para confirmar o pagamento do dentista!</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handlePayment()}>
              Confirmar
          </Button>
          <Button variant="secondary" onClick={() => setModalPayment(false)}>
              Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={ordemData ? true : false} size="lg" onHide={() => setOrdemData(undefined)} centered>
        <Modal.Header>
          Editar comissão
        </Modal.Header>
        <Modal.Body>
          <fieldset className="fildset-container" >
            <legend className="fildset-title">Comissão</legend>
            {
              ordemData ? 
              <Form.Row className="justify-content-md-center">
              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Label>Comissão Geral</Form.Label>
                <Form.Control 
                  type="number" 
                  defaultValue={ordemData.comissao} 
                  placeholder="Ex: 50 => 50%" 
                  onChange={e => setOrdemData({...ordemData, comissao: e.target.value})}
                />
              </Form.Group>
              </Form.Row> : <></>
            }
          </fieldset>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleUpdateComissao(ordemData.id)}>
              Salvar
          </Button>
          <Button variant="secondary" onClick={() => setOrdemData(undefined)}>
              Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
      <CardHeader title={`Comisões de ${dentistData.name}`}>
        <CardHeaderToolbar style={{flex: 1}}>
          <div style={{flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
            
           <div></div>
            
            <div style={{display: 'flex', flexDirection: 'row', width: '50%'}}>
          
             {/* {
               option === 2 ? 
               <fieldset className="fildset-container" >
               <legend className="fildset-title">Pendente</legend>
                 <span>{convertMoney(values.pendentes)}</span>
               </fieldset> : <></>
             } */}
          
           
             {
               activeKey === 'pagar' ? 
               <>
                <Space size="large" ><Statistic title="Pendente" value={convertMoney(values.pendentes)} />
                  <Space size="large" ><Statistic title="Selecionado" value={convertMoney(selecionado.reduce((a, b) => a + b.valor_comissao, 0))} /></Space>
                </Space>
               </>
               : <></>
              }


            {
              activeKey === 'pago' ? 
                <Space size="large" ><Statistic title="Pago" value={convertMoney(pagamentos.reduce((a, b) => a + b.valor_comissao, 0))} /></Space>
               : <></>
             }
             
             </div>
            <Button
              disabled={pagamentos.reduce((a, b) => a + b.valor_comissao, 0) === 0 || option !== 'pagar'}
              variant={selecionado.length > 0  ? 'primary' : 'secondary'} 
              onClick={() => setModalPayment(true)}
            >Pagar</Button>

          </div>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div style={{display: 'flex', flex: 1}}>
            <Tabs
              size="small"
              tabPosition="left"
              defaultActiveKey="pagar"
              activeKey={activeKey}
              onChange={(e) => setActiveKey(e)}
            >
            <TabPane tab="Pendentes" key="pagar" />
          
            <TabPane tab="Pagos" key="pago" />

            <TabPane tab="Todos" key="0" />
           </Tabs>
            <TableNew
              dataSource={pagamentos.map(item => ({...item, key: item.id}))} 
              columns={columns}  
              rowSelection={{
                type: selectionType,
                ...rowSelection,
              }}
              style={{width: '100%', paddingLeft: 10}}
            />
          </div>
      </CardBody>
    </Card>
  );
}
