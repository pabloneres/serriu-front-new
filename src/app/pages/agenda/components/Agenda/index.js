import React, { useState, useEffect } from "react";
import Scheduler, { Resource } from "devextreme-react/scheduler";
import notify from "devextreme/ui/notify";
import { data, holidays } from "./components/data.js";
import Utils from "./components/utils.js";
import DataCell from "./components/DataCell";
import DateCell from "./components/DateCell.js";
import TimeCell from "./components/TimeCell.js";
import { loadMessages, locale } from "devextreme/localization";
import ptMessages from "devextreme/localization/messages/pt.json";
import { index, update, show, store } from "~/app/controllers/controller";
import { useSelector, connect } from "react-redux";
import { ThemeProvider } from "styled-components";
import { useHistory, Redirect } from "react-router-dom";
import {
  Form,
  Table,
  Col,
  Button,
  CardGroup,
  Modal,
  ButtonToolbar,
  ButtonGroup
} from "react-bootstrap";
import {
  Card,
  CardHeader,
  CardBody,
  CardHeaderToolbar
} from "~/_metronic/_partials/controls";
import Select from "react-select";
import CreatableSelect, { makeCreatableSelect } from "react-select/creatable";

import "./styles.css";

const currentDate = new Date();
const views = ["week", "workWeek", "day"];
const currentView = views[0];
loadMessages(ptMessages);
locale(navigator.language);

const App = () => {
  const {
    user: { authToken }
  } = useSelector(state => state.auth);
  const history = useHistory();
  const [dentistas, setDentistas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [dentistasSelecionado, setDentistasSelecionado] = useState();
  const [pacientesSelecionado, setPacientesSelecionado] = useState();
  const [agendamentos, setAgendamentos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novoPaciente, setNovoPaciente] = useState(false);
  const [horariosManha, setHorariosManha] = useState([
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
    "13:00"
  ]);
  const [horariosTarde, setHorariosTarde] = useState([
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00"
  ]);
  const [horarioSelecionado, setHorarioSelecionado] = useState(undefined);
  const [reload, setReload] = useState(false);
  const [currentDate, setCurrentDate] = useState(dataAtual());

  const [pacienteData, setPacienteData] = useState(undefined);
  const [obs, setObs] = useState("");

  useEffect(() => {
    index(authToken, "/dentists").then(({ data }) => {
      data = data.map(item => ({
        label: item.name,
        value: item.id
      }));

      setDentistas(data);
    });

    index(authToken, "/patients").then(({ data }) => {
      data = data.map(item => ({
        label: item.name,
        value: item.id
      }));
      setPacientes(data);
    });

    index(authToken, "/agendamentos").then(({ data }) => {
      setAgendamentos(data);
    });
  }, [reload]);

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

    store("agendamentos", isValidAppointment).then(data => {
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

  function toopltipComponent({ data }) {
    return (
      <div>
        <p>
          <strong>Dentista:</strong>
          {data.appointmentData.dentista_id}
        </p>
        <p>
          <strong>Paciente:</strong>
          {data.appointmentData.paciente_id}
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

  function handleSetHorario(index) {
    document.querySelector(`.${horarioSelecionado}`).classList.remove("active");

    setHorarioSelecionado(index);
    document.querySelector(`.${index}`).classList.add("active");
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
    if (!horarioSelecionado) {
      return;
    }

    const horario = horarioSelecionado.split("_");
    if (horario[0] === "manha") {
      return horariosManha[Number(horario[1]) + add];
    }

    return horariosTarde[Number(horario[1]) + add];
  }

  function createAgendamento(e) {
    e.preventDefault();

    const agendamento = {
      paciente_id: pacientesSelecionado
        ? pacientesSelecionado.value
        : undefined,
      dentista_id: dentistasSelecionado
        ? dentistasSelecionado.value
        : undefined,
      startDate: currentDate + " " + returnHorario(),
      endDate: currentDate + " " + returnHorario(1),
      obs: obs,
      pacienteData: pacienteData
    };
    console.log(agendamento);

    store(authToken, "agendamentos", agendamento).then(data => {
      clearFields();
      setShowModal(false);
      setReload(!reload);
    });
  }

  function clearFields() {
    setDentistasSelecionado("");
    setPacientesSelecionado("");
    setNovoPaciente(false);
    setHorarioSelecionado(undefined);
    setCurrentDate(dataAtual());
    setPacienteData(undefined);
    setObs("");
  }

  return (
    <Card>
      <Modal show={showModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Agendamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={e => {
              createAgendamento(e);
            }}
          >
            <Form.Row className="justify-content-md-center">
              {!novoPaciente ? (
                <Form.Group as={Col} controlId="formGridAddress1">
                  <Form.Label>Paciente</Form.Label>
                  <CreatableSelect
                    required
                    onCreateOption={e => {
                      handleCreate(e);
                    }}
                    placeholder="Selecione o paciente..."
                    options={pacientes}
                    onChange={value => {
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
                      onChange={e =>
                        setPacienteData({
                          ...pacienteData,
                          nome: e.target.value
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridAddress1">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      name="emailPaciente"
                      value={pacienteData.email}
                      onChange={e =>
                        setPacienteData({
                          ...pacienteData,
                          email: e.target.value
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridAddress1">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                      type="text"
                      name="telefonePaciente"
                      onChange={e =>
                        setPacienteData({
                          ...pacienteData,
                          telefone: e.target.value
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
                  options={dentistas}
                  onChange={value => {
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
                  onChange={e => setObs(e.target.value)}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row className="justify-content-md-center">
              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Label>Dia</Form.Label>
                <Form.Control
                  type="date"
                  value={currentDate}
                  onChange={e => {
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
                  // disabled
                  value={returnHorario()}
                  onChange={e => console.log(e.target.value)}
                  disabled
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Label>Término</Form.Label>
                <Form.Control
                  type="time"
                  value={returnHorario(1)}
                  // placeholder="Username"
                  aria-describedby="inputGroupPrepend"
                  disabled
                />
              </Form.Group>
            </Form.Row>

            <Form.Row className="justify-content-md-center">
              <Form.Label>Horário</Form.Label>
              <ButtonToolbar
                aria-label="Toolbar with button groups"
                style={{ justifyContent: "center" }}
              >
                <ButtonGroup className="mr-2" aria-label="First group">
                  {horariosManha.map((item, index) => (
                    <div
                      key={index}
                      className={`button-select manha_${index}`}
                      onClick={e => handleSetHorario(`manha_${index}`)}
                    >
                      {item}
                    </div>
                  ))}
                </ButtonGroup>
                <ButtonGroup className="mr-2" aria-label="First group">
                  {horariosTarde.map((item, index) => (
                    <div
                      key={index}
                      className={`button-select tarde_${index}`}
                      onClick={e => handleSetHorario(`tarde_${index}`)}
                    >
                      {item}
                    </div>
                  ))}
                </ButtonGroup>
              </ButtonToolbar>
            </Form.Row>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowModal(false);
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
      <CardHeader title="Agenda">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Agendar
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <Scheduler
        // timeZone="America/Sao_Paulo"
        dataSource={agendamentos}
        views={views}
        defaultCurrentView={currentView}
        defaultCurrentDate={currentDate}
        height={800}
        showAllDayPanel={false}
        firstDayOfWeek={dayWeek()}
        startDayHour={8}
        endDayHour={18}
        dataCellRender={renderDataCell}
        dateCellRender={renderDateCell}
        timeCellRender={renderTimeCell}
        editing={{ allowAdding: false }}
        appointmentTooltipComponent={toopltipComponent}
        onAppointmentFormOpening={onAppointmentFormOpeningFunc}
        onAppointmentAdding={onAppointmentAddingFunc}
        onAppointmentUpdating={onAppointmentUpdatingFunc}
      ></Scheduler>
    </Card>
  );

  function onAppointmentFormOpeningFunc(data) {
    let form = data.form;

    let date = new Date();

    form.option("items", [
      {
        label: {
          text: "Dentista"
        },
        editorType: "dxSelectBox",
        dataField: "dentista_id",
        editorOptions: {
          searchEnabled: true,
          width: "100%",
          flex: 1,
          items: dentistas,
          displayExpr: "name",
          valueExpr: "id",
          onValueChanged: function(args) {
            // movieInfo = getMovieById(args.value);
            // form.updateData("director", movieInfo.director);
            // form.updateData(
            //   "endDate",
            //   new Date(startDate.getTime() + 60 * 1000 * movieInfo.duration)
            // );
          }
        }
      },
      {
        label: {
          text: "Paciente"
        },
        editorType: "dxSelectBox",
        dataField: "paciente_id",
        editorOptions: {
          searchEnabled: true,
          width: "100%",
          items: pacientes,
          displayExpr: "name",
          valueExpr: "id",
          onValueChanged: function(args) {}
        }
      },
      {
        label: {
          text: "Início"
        },
        dataField: "startDate",
        editorType: "dxDateBox",
        editorOptions: {
          width: "100%",
          type: "datetime",
          // value: date,
          onValueChanged: function(args) {}
        }
      },
      {
        label: {
          text: "Término"
        },
        dataField: "endDate",
        editorType: "dxDateBox",
        editorOptions: {
          width: "100%",
          type: "datetime",
          // value: date,
          onValueChanged: function(args) {}
        }
      }
    ]);
  }
};
export default App;
