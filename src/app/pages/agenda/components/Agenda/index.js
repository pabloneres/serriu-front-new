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
  const [pacientesSelecionado, setPacientesSelecionado] = useState();
  const [agendamentos, setAgendamentos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalDetalhes, setShowModalDetalhes] = useState(false);
  const [novoPaciente, setNovoPaciente] = useState(false);
  const [horarios, setHorarios] = useState([
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ]);
  const [horariosSelecionado, setHorariosSelecionado] = useState([]);
  const [reload, setReload] = useState(false);
  const [currentDate, setCurrentDate] = useState(dataAtual());

  const [pacienteData, setPacienteData] = useState(undefined);
  const [agendamentoData, setAgendamentoData] = useState(undefined);
  const [obs, setObs] = useState("");
  const [clickHorario, setClickHorario] = useState(undefined);
  const [startOrEnd, setStartOrEnd] = useState(undefined);
  const [agendaView, setAgendaView] = useState(0);
  const [dadosAgendamento, setDadosAgendamento] = useState({ undefined });

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
  }, [reload]);

  useEffect(() => {
    index(authToken, `/agendamentos?dentista_id=${agendaView}`).then(
      ({ data }) => {
        setAgendamentos(data);
      }
    );
  }, [reload, agendaView]);

  function onAppointmentAddingFunc(e) {
    const isValidAppointment = Utils.isValidAppointment(
      e.component,
      e.appointmentData
    );
    if (!isValidAppointment) {
      e.cancel = true;
      notifyDisableDate();
    }
    console.log(e.appointmentData);

    store("agendamentos", isValidAppointment).then((data) => {
      console.log(data);
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
    notify("Problemas para criar o agendamento", "warning", 1000);
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
    return <DataCell itemData={itemData} />;
  }

  function renderDateCell(itemData) {
    return <DateCell itemData={itemData} />;
  }

  function renderTimeCell(itemData) {
    return <TimeCell itemData={itemData} />;
  }

  function toopltipComponent(props) {
    console.log(props);
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
    if (!startOrEnd) {
      alert("Selecione Início ou Término");
      return;
    }

    if (startOrEnd === "start") {
      setClickHorario({
        ...clickHorario,
        dia: clickHorario.dia ? clickHorario.dia : currentDate,
        startDate: item,
      });
    }

    if (startOrEnd === "end") {
      setClickHorario({
        ...clickHorario,
        dia: clickHorario.dia ? clickHorario.dia : currentDate,
        endDate: item,
      });
    }

    // if (e.target.classList.contains('active') === true) {
    //   e.target.classList.remove('active')
    //   horariosSelecionado.splice(horariosSelecionado.indexOf(item), 1)
    //   setHorariosSelecionado([...horariosSelecionado])
    //   return
    // }
    setHorariosSelecionado([...horariosSelecionado, item]);

    e.target.classList.add("active");
  }

  function dataAtual() {
    const data = new Date();
    var dia = data.getDate() <= 9 ? `0${data.getDate()}` : data.getDate();
    var mes =
      data.getMonth() <= 9 ? `0${data.getMonth() + 1}` : data.getMonth() + 1;
    var ano = data.getFullYear();

    console.log(`${ano}-${mes}-${dia}`);

    return `${ano}-${mes}-${dia}`;
  }

  function returnHorario(add = 0) {
    if (!horariosSelecionado) {
      return;
    }

    if (horariosSelecionado.length === 1) {
      let horario = horariosSelecionado[0];

      horario = horarios[horarios.indexOf(horario) + 1];
      return horario;
    }

    const lastHorario = horariosSelecionado[horariosSelecionado.length - 1];
    return lastHorario;
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
        endDate: clickHorario.dia + " " + clickHorario.endDate,
        obs: obs,
        pacienteData: pacienteData,
      };
    }

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
    setPacienteData(undefined);
    setStartOrEnd(undefined);
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
            <span>Codigo: {appointmentData.paciente.id_acesso}</span>
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
                <option value={0} style={{color: ReturnStatusColor(0)}} >Agendado</option>
                <option value={1} style={{color: ReturnStatusColor(1)}} >Confirmado</option>
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
                  console.log(e)
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
      setReload(!reload);
    });
  };

  const handleEdit = (agendamento) => {
    setDadosAgendamento(agendamento);

    setShowModal(true);
  };

  const clicarAgendar = async (props) => {
    const { cellData } = props;
    console.log(cellData);

    const startDate = moment(cellData.startDate)
      .format("HH:mm:ss")
      .split(":");
    const endDate = moment(cellData.endDate)
      .format("HH:mm:ss")
      .split(":");

    console.log(startDate[0] + ":" + startDate[1]);
    console.log(endDate[0] + ":" + endDate[1]);

    setClickHorario({
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
    //Agendado - 0
    //Confirmado - 1
    //Cancelado - 2
    //Atendido - 3
    switch (status) {
      case 0:
        return "rgb(196, 196, 28)";
      case 1:
        return "green";
      case 2:
        return "orange";
      case 3:
        return "blue";
    }
  };

  const updateAgendamento = (data) => {
    console.log(data)

    update(authToken, 'agendamentos', data.id, data)
    .then(() => {
      setReload(!reload)
    })
    .catch(() => {})
  }

  const [modalConfirm, setModalConfirm] = useState(false);
  const [changeAgendamento, setChangeAgendamento] = useState(undefined);

  return (
    <Card>
      <Modal show={showModalDetalhes && agendamentoData} size="lg">
        <Modal.Header>
          Detalhes do Agendamento
          <div className="actions">
            <span style={{ cursor: "pointer" }} className="svg-icon menu-icon">
              <SVG
                style={{ fill: "#3699FF", color: "#3699FF" }}
                src={toAbsoluteUrl("/media/svg/icons/Design/create.svg")}
              />
            </span>
            <span
              onClick={() => handleDelete()}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <SVG
                style={{ fill: "#3699FF", color: "#3699FF", marginLeft: 8 }}
                src={toAbsoluteUrl("/media/svg/icons/Design/delete.svg")}
              />
            </span>
          </div>
        </Modal.Header>
        {agendamentoData ? (
          <Modal.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Informações</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Paciente</td>
                  <td>{agendamentoData.paciente.name}</td>
                </tr>
                <tr>
                  <td>Dentista</td>
                  <td>{agendamentoData.dentista.name}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>{ReturnStatus(agendamentoData.status)}</td>
                </tr>
              </tbody>
            </Table>
            <div className="card_data">
              <h3>Data e Hora</h3>
              <div className="container_horas">
                <div className="hora">
                  <span>Dia</span>
                  <h2>
                    {moment(agendamentoData.startDate).format("DD/MM/YYYY")}
                  </h2>
                </div>
                <div className="hora">
                  <span>Início</span>
                  <h2>{moment(agendamentoData.startDate).format("hh:mm")}</h2>
                </div>
                <div className="hora">
                  <span>Término</span>
                  <h2>{moment(agendamentoData.endDate).format("hh:mm")}</h2>
                </div>
              </div>
            </div>
            <div className="container_obs">
              <h3>Obs</h3>
              <p>{agendamentoData.obs}</p>
            </div>
          </Modal.Body>
        ) : (
          <></>
        )}
        <Modal.Footer>
          <Button onClick={() => setShowModalDetalhes(false)}>Fechar</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModal} size="xl">
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
            </Form.Row>

            <Form.Row className="justify-content-md-center">
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
                  onClick={() => setStartOrEnd("start")}
                  style={{
                    backgroundColor: startOrEnd === "start" ? "#3699FF" : "",
                  }}
                  defaultValue={
                    clickHorario
                      ? clickHorario.startDate
                      : horariosSelecionado[0]
                  }
                  onChange={(e) => console.log(e.target.value)}
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
                  defaultValue={clickHorario ? clickHorario.endDate : returnHorario()}
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
                    key={index}
                    className={`button-select`}
                    onClick={(e) => handleSetHorario(e, item, index)}
                  >
                    {item}
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
      {/* <ModalConfirmUpdate
        show={modalConfirm}
        onHide={() => setModalConfirm(false)}
        change={(e) => setChangeAgendamento(e)}
      /> */}
      {/* <CardHeader title="Agenda">
        <CardHeaderToolbar>
        <Select
          className="select_agenda"
          onCreateOption={e => {
            handleCreate(e);
          }}
          placeholder="Visualizar agenda de..."
          options={dentistas}
          onChange={value => {
            console.log(value)
            setAgendaView(value.value)
          }}
        />
        </CardHeaderToolbar>
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Agendar
          </button>
        </CardHeaderToolbar>
      </CardHeader> */}
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
          
          console.log(current)

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
