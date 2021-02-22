import React, { useState, useEffect, useRef } from "react";
import Scheduler, { Resource, View } from "devextreme-react/scheduler";
import notify from "devextreme/ui/notify";
import { data, holidays } from "./components/data.js";
import Utils from "./components/utils.js";
import DataCell from "./components/DataCell";
import DateCell from "./components/DateCell.js";
import TimeCell from "./components/TimeCell.js";
import { loadMessages, locale } from "devextreme/localization";
import ptMessages from "devextreme/localization/messages/pt.json";
import {
  index,
  update,
  show,
  store,
  destroy,
} from "~/app/controllers/controller";
import { useSelector, connect } from "react-redux";
import { ThemeProvider } from "styled-components";
import { useHistory, Redirect } from "react-router-dom";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import {
  Form,
  Table,
  Col,
  Button,
  CardGroup,
  Modal,
  ButtonToolbar,
  ButtonGroup,
  Tooltip,
  OverlayTrigger,
  Overlay,
  Popover,
} from "react-bootstrap";
import {
  Card,
  CardHeader,
  CardBody,
  CardHeaderToolbar,
} from "~/_metronic/_partials/controls";
import Select from "react-select";
import CreatableSelect, { makeCreatableSelect } from "react-select/creatable";
import SVG from "react-inlinesvg";
import daysJson from './components/days.json'

import "./styles.css";
import moment from "moment";
import "moment/locale/pt-br";
moment.locale("pt-br");

const currentDate = new Date();
const views = ["week", "workWeek", "day"];
const currentView = views[0];
loadMessages(ptMessages);
locale(navigator.language);

const App = () => {
  const {
    user: { authToken },
  } = useSelector((state) => state.auth);
  const history = useHistory();
  const [dentistas, setDentistas] = useState([]);
  const [dentistasModal, setDentistasModal] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [dentistasSelecionado, setDentistasSelecionado] = useState();
  const [statusSelecionado, setStatusSelecionado] = useState(0);
  const [pacientesSelecionado, setPacientesSelecionado] = useState();
  const [agendamentos, setAgendamentos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalDetalhes, setShowModalDetalhes] = useState(false);
  const [novoPaciente, setNovoPaciente] = useState(false);
  const [horarios, setHorarios] = useState([
    {
      id: 0,
      hora: "08:00",
      disabled: false,
    },
    {
      id: 1,
      hora: "08:30",
      disabled: false,
    },
    {
      id: 2,
      hora: "09:00",
      disabled: false,
    },
    {
      id: 3,
      hora: "09:30",
      disabled: false,
    },
    {
      id: 4,
      hora: "10:00",
      disabled: false,
    },
    {
      id: 5,
      hora: "10:30",
      disabled: false,
    },
    {
      id: 6,
      hora: "11:00",
      disabled: false,
    },
    {
      id: 7,
      hora: "11:30",
      disabled: false,
    },
    {
      id: 8,
      hora: "12:00",
      disabled: false,
    },
    {
      id: 9,
      hora: "12:30",
      disabled: false,
    },
    {
      id: 10,
      hora: "13:00",
      disabled: false,
    },
    {
      id: 11,
      hora: "13:30",
      disabled: false,
    },
    {
      id: 12,
      hora: "14:00",
      disabled: false,
    },
    {
      id: 13,
      hora: "14:30",
      disabled: false,
    },
    {
      id: 14,
      hora: "15:00",
      disabled: false,
    },
    {
      id: 15,
      hora: "15:30",
      disabled: false,
    },
    {
      id: 16,
      hora: "16:00",
      disabled: false,
    },
    {
      id: 17,
      hora: "16:30",
      disabled: false,
    },
    {
      id: 18,
      hora: "17:00",
      disabled: false,
    },
    {
      id: 19,
      hora: "17:30",
      disabled: false,
    },
    {
      id: 20,
      hora: "18:00",
      disabled: false,
    },
  ]);
  const [horariosSelecionado, setHorariosSelecionado] = useState([]);
  const [reload, setReload] = useState(false);
  const [reloadAgendamentos, setReloadAgendamentos] = useState(false);
  const [currentDate, setCurrentDate] = useState(dataAtual());

  const [pacienteData, setPacienteData] = useState(undefined);
  const [agendamentoData, setAgendamentoData] = useState(undefined);
  const [obs, setObs] = useState("");
  const [clickHorario, setClickHorario] = useState(undefined);
  const [clickHorario2, setClickHorario2] = useState(undefined);
  const [startOrEnd, setStartOrEnd] = useState(undefined);
  const [agendaView, setAgendaView] = useState(0);
  const [dadosAgendamento, setDadosAgendamento] = useState({ undefined });
  const [days, setDays] = useState([])

  useEffect(() => {
    index(authToken, "/dentists").then(({ data }) => {
      data = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));

      setDentistas([
        {
          label: "Todos",
          value: 0,
        },
        ...data,
      ]);
      setDentistasModal(data);
    });

    index(authToken, "/patients").then(({ data }) => {
      data = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setPacientes(data);
    });

    index(authToken, '/agenda').then(({data}) => {

      if (data.length === 0) {
        setDays(daysJson)
        return
      }

      setDays(JSON.parse(data[0].days))
    })
  }, [reload]);

  useEffect(() => {
    index(authToken, `/agendamentos?dentista_id=${agendaView}`).then(
      ({ data }) => {
        setAgendamentos(data);
      }
    );
  }, [reload, reloadAgendamentos, agendaView]);

  function onAppointmentAddingFunc(e) {
    const isValidAppointment = Utils.isValidAppointment(
      e.component,
      e.appointmentData
    );
    if (!isValidAppointment) {
      e.cancel = true;
      notifyDisableDate();
    }

    store("agendamentos", isValidAppointment).then((data) => {
      setReload(!reload);
    });
  }

  function onAppointmentUpdatingFunc(e) {
    const isValidAppointment = Utils.isValidAppointment(e.component, e.newData);
    if (!isValidAppointment) {
      e.cancel = true;
      this.notifyDisableDate();
    }
  }

  function notifyDisableDate() {
    notify("Data não permitida", "warning", 1000);
  }

  function notifyOK() {
    notify("Agendamento Criado", "success", 1000);
  }

  function applyDisableDatesToDateEditors(form) {
    const startDateEditor = form.getEditor("startDate");
    startDateEditor.option("disabledDates", holidays);

    const endDateEditor = form.getEditor("endDate");
    endDateEditor.option("disabledDates", holidays);
  }

  function renderDataCell(itemData) {
    return <DataCell itemData={itemData} days={days} />;
  }

  function renderDateCell(itemData) {
    return <DateCell itemData={itemData} />;
  }

  function renderTimeCell(itemData) {
    return <TimeCell itemData={itemData} />;
  }

  function toopltipComponent(props) {
    return (
      <div>
        <p>
          <strong>Dentista:</strong>
          {props.data.appointmentData.dentista.name}
        </p>
        <p>
          <strong>Paciente:</strong>
          {props.data.appointmentData.paciente.name}
        </p>
      </div>
    );
  }

  function dayWeek() {
    var d = new Date();
    var day = d.getDay();

    return day;
  }

  function handleCreate(e) {
    setNovoPaciente(true);

    setPacienteData({ ...pacienteData, nome: e });
  }

  function handleSetHorario(e, item, index) {
    if (horariosSelecionado.indexOf(item) != -1) {
      if (horariosSelecionado[0] === item) {
        for (let index = horariosSelecionado[0].id; index <= horariosSelecionado[horariosSelecionado.length - 1].id; index++) {
          document.querySelector(`.button-select-${index}`).classList.remove('active')
        }
        let elements = document.querySelectorAll(`.button-select`)
        elements.forEach((item) => {
          item.classList.remove('disabled')
        })
        setHorariosSelecionado([])
        setClickHorario(clickHorario2)
      }

      e.target.classList.remove('active')

      let arr = horariosSelecionado

      let selected = arr.indexOf(item)

      arr.splice(selected, 1)

      let ordenedArr = arr.sort((a, b) => {
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
      })

      setHorariosSelecionado(ordenedArr)
      console.log(ordenedArr)
      setClickHorario({...clickHorario, endDate: ordenedArr[ordenedArr.length - 1].hora})

      return
    }

    let arr = [...horariosSelecionado, item]
    
    let ordenedArr = arr.sort((a, b) => {
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    })

    for (let index = 0; index < ordenedArr[0].id; index++) {
      document.querySelector(`.button-select-${index}`).classList.add('disabled')
    }

    
    if (ordenedArr.length > 1) {
      let newArr = []
      for (let index = ordenedArr[0].id; index <= ordenedArr[ordenedArr.length - 1].id; index++) {
        newArr.push(horarios[index])
        document.querySelector(`.button-select-${index}`).classList.add('active')
      }
  
      
      ordenedArr = [...newArr]
    }
    
    ordenedArr = ordenedArr.sort((a, b) => {
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    })

    console.log(ordenedArr)

    setHorariosSelecionado(ordenedArr);

    setClickHorario({...clickHorario, startDate: ordenedArr[0].hora})

    e.target.classList.add("active");
  }

  function dataAtual() {
    const data = new Date();
    var dia = data.getDate() <= 9 ? `0${data.getDate()}` : data.getDate();
    var mes =
      data.getMonth() <= 9 ? `0${data.getMonth() + 1}` : data.getMonth() + 1;
    var ano = data.getFullYear();

    return `${ano}-${mes}-${dia}`;
  }

  function returnHorario(add = 0) {
    if (!horariosSelecionado) {
      return undefined;
    }

    if (horariosSelecionado.length === 1) {
      let horario = horariosSelecionado[0];

      horario = horarios[horarios.indexOf(horario) + 1];
      return horario;
    }

    const lastHorario = horariosSelecionado[horariosSelecionado.length - 1];

    return lastHorario ? lastHorario.hora : undefined;
  }

  function createAgendamento(e) {
    e.preventDefault();

    if (!pacientesSelecionado && !pacienteData) {
      alert("Preencha todos os campos!");
      return;
    }

    if (!dentistasSelecionado) {
      alert("Preencha todos os campos!");
      return;
    }

    let agendamento;

    if (!clickHorario) {
      agendamento = {
        paciente_id: pacientesSelecionado
          ? pacientesSelecionado.value
          : undefined,
        dentista_id: dentistasSelecionado
          ? dentistasSelecionado.value
          : undefined,
        startDate: currentDate + " " + horariosSelecionado[0],
        endDate: currentDate + " " + returnHorario(),
        obs: obs,
        pacienteData: pacienteData,
      };
    }

    if (clickHorario) {
      agendamento = {
        paciente_id: pacientesSelecionado
          ? pacientesSelecionado.value
          : undefined,
        dentista_id: dentistasSelecionado
          ? dentistasSelecionado.value
          : undefined,
        startDate: clickHorario.dia + " " + clickHorario.startDate,
        endDate: clickHorario.dia + " " + returnHorario(),
        obs: obs,
        pacienteData: pacienteData,
        status: statusSelecionado
      };
    }

    // if (clickHorario && horariosSelecionado.length > 0) {
    //   agendamento = {
    //     paciente_id: pacientesSelecionado
    //       ? pacientesSelecionado.value
    //       : undefined,
    //     dentista_id: dentistasSelecionado
    //       ? dentistasSelecionado.value
    //       : undefined,
    //     startDate: clickHorario.dia + " " + horariosSelecionado[0],
    //     endDate: clickHorario.dia + " " + returnHorario(),
    //     obs: obs,
    //     pacienteData: pacienteData,
    //   };
    // }

    store(authToken, "agendamentos", agendamento).then((data) => {
      clearFields();
      setShowModal(false);
      setReload(!reload);
    });
  }

  function clearFields() {
    setDentistasSelecionado("");
    setPacientesSelecionado("");
    setNovoPaciente(false);
    setHorariosSelecionado([]);
    setCurrentDate(dataAtual());
    setClickHorario(undefined);
    setClickHorario2(undefined);
    setPacienteData(undefined);
    setStartOrEnd(undefined);
    setStatusSelecionado(0)
    setObs("");
  }

  const ReturnAppointament = (props) => {
    setAgendamentoData(props.appointmentData);
    const { appointmentData } = props;
    return (
      <div
        className="appointament_render"
        style={{ borderLeftColor: appointmentData.dentista.color_schedule }}
      >
        <span>{appointmentData.paciente.name.split(" ")[0]}</span>
        <div className="status_circle"></div>
      </div>
    );
  };

  const ReturnAppointamentClick = (props) => {
    const { appointmentData } = props;

    const popover = (
      <Popover id="popover-basic" style={{minWidth: 350}}>
        <Popover.Content>
          <div className="row-popover-title">
            <span>Codigo: <span className="paciente-code">{appointmentData.paciente.id_acesso}</span></span>
            <div className="actions">
              <span onClick={() => alert('Em manutenção')} style={{"cursor": "pointer"}} className="svg-icon menu-icon">
                <SVG style={{"fill": "#545454", "color": "#3699FF"}} src={toAbsoluteUrl("/assets/icons/email.svg")} />
              </span>
              <span onClick={() => alert('Em manutenção')} style={{"cursor": "pointer"}} className="svg-icon menu-icon">
                <SVG style={{"fill": "#545454", "color": "#3699FF",  marginLeft: 8 }} src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")} />
              </span>
              <span
                onClick={() => handleDelete(appointmentData.id)}
                style={{ cursor: "pointer" }}
                className="svg-icon menu-icon"
              >
                <SVG
                  style={{ fill: "#545454", color: "#3699FF", marginLeft: 8 }}
                  src={toAbsoluteUrl("/media/svg/icons/Design/delete.svg")}
                />
              </span>
          </div>
          </div>
          <div className="row-popover" >
            <SVG
              style={{ fill: "#000", color: "#000", marginLeft: 8, width: 20 }}
              src={toAbsoluteUrl("/assets/icons/user.svg")}
            />
            <span>{appointmentData.paciente.name}</span>
          </div>
          <div className="row-popover">
            <SVG
              style={{ fill: "#000", color: "#000", marginLeft: 8, width: 20 }}
              src={toAbsoluteUrl("/assets/icons/dent.svg")}
            />
            <span>{appointmentData.dentista.name}</span>
          </div>
          <div className="row-popover" >
            <SVG
              style={{ fill: "#000", color: "#000", marginLeft: 8, width: 20 }}
              src={toAbsoluteUrl("/assets/icons/day.svg")}
            />
            <span>
              {moment(appointmentData.startDate).calendar()} -{" "}
              {moment(appointmentData.endDate).format("LT")}
            </span>
          </div>
          {
           appointmentData.obs ? 
           <div className="row-popover">
           <SVG
               style={{ fill: "#000", color: "#000", marginLeft: 8, width: 20 }}
               src={toAbsoluteUrl("/assets/icons/text.svg")}
             />
             <span>{appointmentData.obs}</span>
           </div> : <></>
         }
          <div className="row-popover">
            <span>Status</span>
            <span>
              <Form.Control
                as="select"
                defaultValue={appointmentData.status}
                value={props.color}
                onChange={(e) => {
                  updateAgendamento({
                    id: appointmentData.id,
                    status: e.target.value
                  })
                }}
              >
                <option className="teste-option" value={0} style={{color: ReturnStatusColor(0)}} >Agendado</option>
                <option value={1} style={{color: ReturnStatusColor(1)}} >Trabalhando</option>
                <option value={2} style={{color: ReturnStatusColor(2)}} >Cancelado</option>
                <option value={3} style={{color: ReturnStatusColor(3)}} >Atendido</option>
              </Form.Control>
              {/* <Select
                defaultValue={appointmentData.status}
                className="select_status"
                options={[
                  {
                    label: 'Agendado',
                    value: 0
                  },
                  {
                    label: 'Confirmado',
                    value: 1
                  },
                  {
                    label: 'Cancelado',
                    value: 2
                  },
                  {
                    label: 'Atendido',
                    value: 3
                  },
                ]}

                onChange={(e) => {
                  appointmentData.status = e
                }}
              /> */}
            </span>
          </div>

        </Popover.Content>
      </Popover>
    );

    return (
      <OverlayTrigger trigger="click" placement="auto" overlay={popover}>
        <div
          className="appointament_render"
          style={{ borderLeftColor: appointmentData.dentista.color_schedule }}
        >
          <span>{appointmentData.paciente.name.split(" ")[0]}</span>
          <div
            className="status_circle"
            style={{
              backgroundColor: ReturnStatusColor(appointmentData.status),
            }}
          ></div>
        </div>
      </OverlayTrigger>
    );
  };

  const handleDelete = (id) => {
    destroy(authToken, "agendamentos", id).then(() => {
      setShowModalDetalhes(false);
      setReloadAgendamentos(!reloadAgendamentos);
    });
  };

  const handleEdit = (agendamento) => {
    setDadosAgendamento(agendamento);

    setShowModal(true);
  };

  const clicarAgendar = async (props) => {
    const { cellData } = props;

    const isValidAppointment = Utils.isValidAppointmentRender(cellData.startDate, days)

    if (!isValidAppointment) {
      props.cancel = true
      notifyDisableDate();
      return
    }

    const startDate = moment(cellData.startDate)
      .format("HH:mm:ss")
      .split(":");
    const endDate = moment(cellData.endDate)
      .format("HH:mm:ss")
      .split(":");


    setClickHorario({
      dia: moment(cellData.startDate).format("YYYY-MM-DD"),
      startDate: startDate[0] + ":" + startDate[1],
      endDate: endDate[0] + ":" + endDate[1],
    });
    setClickHorario2({
      dia: moment(cellData.startDate).format("YYYY-MM-DD"),
      startDate: startDate[0] + ":" + startDate[1],
      endDate: endDate[0] + ":" + endDate[1],
    });

    setShowModal(true);
  };

  const ReturnStatus = (status) => {
    //status
    //Agendado - 0
    //Confirmado - 1
    //Cancelado - 2
    //Atendido - 3
    switch (status) {
      case 0:
        return <strong style={{ color: "rgb(196, 196, 28)" }}>Agendado</strong>;
      case 1:
        return <strong style={{ color: "green" }}>Confirmado</strong>;
      case 2:
        return <strong style={{ color: "orange" }}>Cancelado</strong>;
      case 3:
        return <strong style={{ color: "blue" }}>Atendido</strong>;
    }
  };

  const ReturnStatusColor = (status) => {
    //status
    //Agendado - todo - 0
    //Confirmado - working - 1
    //Cancelado - 2
    //Atendido  - done - 3
    switch (status) {
      case 0:
        return "blue";
      case 1:
        return "orange";
      case 2:
        return "red";
      case 3:
        return "green";
    }
  };

  const updateAgendamento = (data) => {
    update(authToken, 'agendamentos', data.id, data)
    .then(() => {
      setReloadAgendamentos(!reloadAgendamentos)
    })
    .catch(() => {})
  }

  const [modalConfirm, setModalConfirm] = useState(false);
  const [changeAgendamento, setChangeAgendamento] = useState(undefined);

  return (
    <Card>
      <Modal show={showModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agendamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              createAgendamento(e);
            }}
          >
            <Form.Row className="justify-content-md-center">
              {!novoPaciente ? (
                <Form.Group as={Col} controlId="formGridAddress1">
                  <Form.Label>Paciente</Form.Label>
                  <CreatableSelect
                    required
                    onCreateOption={(e) => {
                      handleCreate(e);
                    }}
                    placeholder="Selecione o paciente..."
                    options={pacientes}
                    onChange={(value) => {
                      setPacientesSelecionado(value);
                    }}
                  />
                </Form.Group>
              ) : (
                <>
                  <Form.Group as={Col} controlId="formGridAddress1">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      name="nomePaciente"
                      value={pacienteData.nome}
                      onChange={(e) =>
                        setPacienteData({
                          ...pacienteData,
                          nome: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridAddress1">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                      type="text"
                      name="telefonePaciente"
                      onChange={(e) =>
                        setPacienteData({
                          ...pacienteData,
                          telefone: e.target.value,
                        })
                      }
                      value={pacienteData.telefone}
                    />
                  </Form.Group>
                </>
              )}

              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Label>Dentista</Form.Label>
                <Select
                  required
                  placeholder="Selecione o dentista..."
                  options={dentistasModal}
                  onChange={(value) => {
                    setDentistasSelecionado(value);
                  }}
                />
              </Form.Group>

            </Form.Row>


            <Form.Row className="justify-content-md-center">
              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Label>Obs</Form.Label>
                <Form.Control
                  type="text"
                  // value={returnHorario(1)}
                  placeholder="Observação"
                  aria-describedby="inputGroupPrepend"
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridAddress1">
                 
                <Form.Label style={{display: 'flex', alignItems: 'center' }}>
                  Status {'  '} <div className="render_status" style={{backgroundColor: ReturnStatusColor(statusSelecionado)}} ></div>
                </Form.Label>
                <Select
                  isSearchable={false}
                  required
                  placeholder="Selecione o status..."
                  options={[
                    {
                      label: 'Agendado',
                      value: 0
                    },
                    {
                      label: 'Trabalhando',
                      value: 1
                    },
                    {
                      label: 'Cancelado',
                      value: 2
                    },
                    {
                      label: 'Atendido',
                      value: 3
                    }
                  ]}
                  onChange={(value) => {
                    setStatusSelecionado(value.value);
                  }}
                />
               
                {/* <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue={0}
                  onChange={(e) => {
                  
                  }}
                >
                  <option className="teste-option" value={0} style={{color: ReturnStatusColor(0)}} >Agendado</option>
                  <option value={1} style={{color: ReturnStatusColor(1)}} >Trabalhando</option>
                  <option value={2} style={{color: ReturnStatusColor(2)}} >Cancelado</option>
                  <option value={3} style={{color: ReturnStatusColor(3)}} >Atendido</option>
                </Form.Control> */}
              </Form.Group>
            </Form.Row>

            <Form.Row className="justify-content-md-center">
              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Label>Dia</Form.Label>
                <Form.Control
                  type="date"
                  value={clickHorario ? clickHorario.dia : currentDate}
                  onChange={(e) => {
                    setCurrentDate(e.target.value);
                  }}
                  // placeholder="Username"
                  aria-describedby="inputGroupPrepend"
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Label>Início</Form.Label>
                <Form.Control
                  type="time"
                  // placeholder="Username"
                  aria-describedby="inputGroupPrepend"
                  style={{
                    backgroundColor: startOrEnd === "start" ? "#3699FF" : "",
                  }}
                  defaultValue={clickHorario ? clickHorario.startDate : undefined}
                  onChange={(e) => {}}
                  value={horariosSelecionado[0] ? horariosSelecionado[0].hora : undefined}
                  // disabled
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Label>Término</Form.Label>
                <Form.Control
                  type="time"
                  onClick={() => setStartOrEnd("end")}
                  style={{
                    backgroundColor: startOrEnd === "end" ? "#3699FF" : "",
                  }}
                  defaultValue={clickHorario ? clickHorario.endDate : undefined}
                  value={horariosSelecionado.length > 0 ? 
                    horariosSelecionado[horariosSelecionado.length - 1].hora : 
                    undefined
                  }
                  // placeholder="Username"
                  aria-describedby="inputGroupPrepend"
                  // disabled
                />
              </Form.Group>
            </Form.Row>

            <Form.Row className="justify-content-md-center">
              <Form.Label>Horário</Form.Label>

              <Form.Row className="justify-content-md-center">
                {horarios.map((item, index) => (
                  <div
                    key={item.id}
                    className={`button-select button-select-${item.id} `}
                    onClick={(e) => {
                      if (item.disabled) {
                        return
                      }

                      handleSetHorario(e, item, index)
                    }}
                  >
                    {item.hora}
                  </div>
                ))}
              </Form.Row>
            </Form.Row>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowModal(false);
                  setClickHorario(undefined);
                }}
              >
                Fechar
              </Button>
              <Button variant="primary" type="submit">
                Salvar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <Scheduler
        timeZone="America/Sao_Paulo"
        dataSource={agendamentos}
        views={views}
        defaultCurrentView={currentView}
        defaultCurrentDate={currentDate}
        height={800}
        showAllDayPanel={false}
        firstDayOfWeek={1}
        startDayHour={8}
        endDayHour={18}
        dataCellRender={renderDataCell}
        dateCellRender={renderDateCell}
        timeCellRender={renderTimeCell}
        appointmentRender={ReturnAppointamentClick}
        editing={{ allowAdding: false, allowUpdating: true }}
        onCellClick={(e) => {
          clicarAgendar(e)
        }}
        onAppointmentDblClick={(e) => {
          e.cancel = true;
        }}
        appointmentTooltipComponent={toopltipComponent}
        onAppointmentClick={(e) => {
          e.cancel = true;
        }}
        onAppointmentUpdating={e => {

          const isValidAppointment = Utils.isValidAppointment(e.component, e.newData, days);

          console.log(isValidAppointment)

          if (!isValidAppointment) {
            e.cancel = true;
            notifyDisableDate();

            return
          }
          
          var change = window.confirm('Deseja alterar agendamento ?', 'Sim', 'Cancelar')
          
          if (!change) {
            e.cancel = true
            return
          }

          const dia = moment(e.newData.startDate).format("YYYY-MM-DD")
          const startDate = moment(e.newData.startDate)
          .format("HH:mm:ss")
          .split(":");
          const endDate = moment(e.newData.endDate)
          .format("HH:mm:ss")
          .split(":");

          const current = {
            dia,
            startDate: startDate[0] + ":" + startDate[1],
            endDate: endDate[0] + ":" + endDate[1],
          }

          updateAgendamento({
            id: e.newData.id,
            startDate: current.dia + ' ' + current.startDate,
            endDate: current.dia + ' ' + current.endDate
          })

        }}
      ></Scheduler>
    </Card>
  );


  // function ModalConfirmUpdate(props) {
  //   return (
  //     <Modal
  //       {...props}
  //       size="sm"
  //       aria-labelledby="contained-modal-title-vcenter"
  //       centered
  //     >
  //       <Modal.Body>
  //         <span>Deseja alterar esse agendamento ?</span>
  //       </Modal.Body>
  //       <Modal.Footer>
  //         <Button variant="primary" onClick={() => props.change(true)}>Sim</Button>
  //         <Button variant="secondary" onClick={props.onHide}>Não</Button>
  //       </Modal.Footer>
  //     </Modal>
  //   );
  // }


};
export default App;
