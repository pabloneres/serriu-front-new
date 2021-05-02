import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardHeaderToolbar } from "~/_metronic/_partials/controls";
import { Link } from "react-router-dom";

import { Table, Modal, Button, Form, Col, InputGroup } from "react-bootstrap";

import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive, sortCaret  } from "~/_metronic/_helpers";

import { index, update, show } from "~/app/controllers/controller";
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

export function Recebidos(props) {
  const { params, url } = useRouteMatch();
  const { intl } = props;
  const {
    user: { authToken }
  } = useSelector(state => state.auth);
  const id = params.id
  const history = useHistory();

  const [reload, setReload] = useState(false);
  const [dentistData, setDentistData] = useState({})
  const [config, setConfig] = useState({})
  
  const [option, setOption] = useState(undefined)
  const [padrao, setPadrao] = useState(false)
  const [values, setValues] = useState({})
  const [optionsStatus, setOptionsStatus] = useState([
    {
      label: 'Todos',
      value: undefined
    },
    {
      label: 'Entrada',
      value: 0
    },
    {
      label: 'Saida',
      value: 1
    },
  ])

  const [pagamentos, setPagamentos] = useState([])
  const [ordemData, setOrdemData] = useState(undefined)
  const [showOrdemDetais, setShowOrdemDetais] = useState(false)
  const [selecionado, setSelecionado] = useState([])
  const [modalPayment, setModalPayment] = useState(false)

  useEffect(() => {
    show(authToken, '/dentist', id)
    .then(({data}) => {
      setDentistData(data[0])
    })
    .catch((err)=> history.push('/dentista'))
  }, [authToken, reload]);

  useEffect(() => {
    index(authToken, `caixa/dentista/${id}`).then(({ data }) => {
        setPagamentos(data);
      }
    );
  }, [option])

  const convertMoney = (value) => {
    return Number(value).toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL"
    })
  }

  const returnStatusComissao = (status) => {
    switch (status) {
      case 0:
        return 'Aguardando cliente aprovar' 
    
      case 1:
        return 'A Pagar' 
     
      case 2:
      return 'Pago' 
    
      default:
        return;
    }

    return 
  }

  const returnTipo = (value) => {
    switch (value) {
      case 0:
        return <span style={{color: 'green'}}>Entrada</span>
      case 1:
        return <span style={{color: 'red'}}>Saida</span>
    }
  }

  const returnDate = (date) => {
    return moment(date).format('LLLL')
  }

  const columns = [
    {
      dataField: "data",
      text: "Data",
      sort: true,
      sortCaret: sortCaret,
      formatter: returnDate,
    },
    {
      dataField: "tipo",
      text: "Tipo",
      sort: true,
      sortCaret: sortCaret,
      formatter: returnTipo,
    },
    {
      dataField: "valor",
      text: "Valor",
      sort: true,
      formatter: convertMoney,
      sortCaret: sortCaret,
    }
  ];

  const columnsExpand = [
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
      formatter: returnDate
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
    }
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
      style.backgroundColor = '#c8e6c9';
    } else {
      style.backgroundColor = '#fff';
    }

    return style;
  };

  const expandRow = {
    parentClassName: 'parent-expand-foo',
    renderer: row => (
      <BootstrapTable
        wrapperClasses="table-responsive"
        classes="table table-head-custom table-vertical-center overflow-hidden"
        bootstrap4
        bordered={false}
        remote
        keyField="id"
        defaultSorted={[{ dataField: "id", order: "asc" }]}
        onTableChange={() => {}}
        data={JSON.parse(row.ordens)}
        columns={columnsExpand}
        rowStyle={ rowStyle }
      >
        {/* <PleaseWaitMessage entities={entities} />
        <NoRecordsFoundMessage entities={entities} /> */}
      </BootstrapTable>
    ),
    showExpandColumn: true,
    expandHeaderColumnRenderer: ({ isAnyExpands }) => {
      if (isAnyExpands) {
        return <b>-</b>;
      }
      return <b>+</b>;
    },
    expandColumnRenderer: ({ expanded }) => {
      if (expanded) {
        return (
          <b>-</b>
        );
      }
      return (
        <b>+</b>
      );
    }
  };
  


  return (
    <Card>
      <CardHeader title={`Recebidos de ${dentistData.name}`}>
        <CardHeaderToolbar style={{flex: 1}}>
          <div style={{flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
            
            <Select
              className="select_agenda"
              placeholder="Filtro"
              options={optionsStatus}
              defaultValue={optionsStatus[0]}
              onChange={(value) => {
                setOption(value.value);
              }}
            />
            
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <fieldset className="fildset-container" >
              <legend className="fildset-title">Total</legend>
                <span>{convertMoney(pagamentos.reduce((a, b) => a + b.valor, 0))}</span>
              </fieldset>
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
          expandRow={ expandRow }
          defaultSorted={[{ dataField: "id", order: "asc" }]}
          onTableChange={() => {}}
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
