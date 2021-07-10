import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardHeaderToolbar } from "~/_metronic/_partials/controls";
import { Link } from "react-router-dom";

import { Table, Modal, Button, Form, Col, InputGroup } from "react-bootstrap";

import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive, sortCaret  } from "~/_metronic/_helpers";

import { index, update, show, store} from "~/controllers/controller";
import BootstrapTable from "react-bootstrap-table-next";
import ActionsColumnFormatter from '~/utils/ActionsColumnFormatter'
import Select from 'react-select'

import moment from "moment";
import "moment/locale/pt-br";
moment.locale("pt-br");

const atualData = () => {
  let atual = new Date()
  atual = moment(atual).format()

  var separados = atual.split(':')
  separados = separados[0] + ':' + separados[1]

  return separados
}

function Comissoes(props) {
  const { params, url } = useRouteMatch();
  const { intl } = props;
  const {
    user: { authToken }
  } = useSelector(state => state.auth);
  const history = useHistory();
  const id = props.id

  const [reload, setReload] = useState(false);
  const [dentistData, setDentistData] = useState({})
  const [config, setConfig] = useState({})
  
  const [option, setOption] = useState(1)
  const [padrao, setPadrao] = useState(false)
  const [values, setValues] = useState({})
  const [optionsStatus, setOptionsStatus] = useState([
    {
      label: 'Todos',
      value: undefined
    },
    {
      label: 'Pendente',
      value: 1
    },
    {
      label: 'Pago',
      value: 2
    },
  ])

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
    index(authToken, `/comissao/${id}?status=${option}`).then(
      ({ data }) => {
        setPagamentos(data);
      }
    );
  }, [option])

  useEffect(() => {
    index(authToken, `/comissao/${id}?status=${undefined}`).then(
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
        return 'Pendente' 
     
      case 2:
      return 'Pago' 
    
      default:
        return;
    }

    return 
  }

  const convertDate = (date) => {
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
      setModalPayment(false)
      setPadrao(!padrao)
    })
  }

  const columns = [
    {
      dataField: "pacientes.name",
      text: "Paciente",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "executado_em",
      text: "Data de execução",
      sort: true,
      sortCaret: sortCaret,
      formatter: convertDate
    },
    {
      dataField: "status_comissao",
      text: "Status",
      sort: true,
      sortCaret: sortCaret,
      formatter: returnStatusComissao,
    },
    {
      dataField: "",
      text: "Aprovado",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "valor_total",
      text: "Valor",
      sort: true,
      formatter: convertMoney,
      sortCaret: sortCaret,
    },
    {
      dataField: "valor_comissao",
      text: "Valor Comissão",
      sort: true,
      formatter: convertMoney,
      sortCaret: sortCaret,
    },
    {
      dataField: "action",
      text: "Ações",
      classes: "text-right pr-0",
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        showDetails,
        options: ['view'],
      },
      sortCaret: sortCaret,
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
      },
    },
  ];

  const handleOnSelect = (row, isSelect) => {
    if (row.status_comissao === 2) {
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
    nonSelectable: pagamentos.map(r => r.status_comissao !== 1 ? r.id : null),
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
                  {convertDate(comissaoDetails.executado_em)}
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
            
            <Select
              className="select_agenda"
              placeholder="Filtro"
              options={optionsStatus}
              defaultValue={optionsStatus[1]}
              onChange={(value) => {
                setOption(value.value);
              }}
            />
            
            <div style={{display: 'flex', flexDirection: 'row', width: '50%'}}>
          
             {
               option === 0 ? 
               <fieldset className="fildset-container" >
               <legend className="fildset-title">Pendente</legend>
                 <span>{convertMoney(values.pendentes)}</span>
               </fieldset> : <></>
             }
          
           
             {
               option === undefined || option === 1 ? 
               <>
                <fieldset className="fildset-container" style={{marginRight: 20}} >
                <legend className="fildset-title">Pendente</legend>
                  <span>{convertMoney(values.pendentes)}</span>
                </fieldset>
               </>
               : <></>
             }


            {
               option === 2 ? 
               <fieldset className="fildset-container" >
               <legend className="fildset-title">Pago</legend>
                 <span>{convertMoney(pagamentos.reduce((a, b) => a + b.valor_comissao, 0))}</span>
               </fieldset> : <></>
             }

             </div>

          </div>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <BootstrapTable
          wrapperClasses="table-responsive"
          classes="table table-head-custom table-vertical-center overflow-hidden"
          bootstrap4
          bordered={false}
          remote
          keyField="id"
          defaultSorted={[{ dataField: "id", order: "asc" }]}
          onTableChange={() => {}}
          selectRow={ selectRow }
          data={pagamentos}
          columns={columns}
          rowStyle={ rowStyle }
        >
          {/* <PleaseWaitMessage entities={entities} />
          <NoRecordsFoundMessage entities={entities} /> */}
        </BootstrapTable>
      </CardBody>
    </Card>
  );
}

export default Comissoes
