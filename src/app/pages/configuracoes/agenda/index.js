import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'
import { index, destroy, store, update } from "~/app/controllers/controller";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { Modal, Button, Form, Col, InputGroup } from 'react-bootstrap'
import { useFormik } from "formik";
import api from '~/app/services/api'
import * as Yup from "yup";

import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "~/_metronic/_partials/controls";

import './styles.css'
import daysJson from './days.json'

const labelsDay = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sabádo',
]

export default function ConfigurarAgenda() {
  const { user: { authToken } } = useSelector((state) => state.auth);
  const history = useHistory();
  const [days, setDays] = useState([])
  const [reload, setReload] = useState(false)
  const [needCreate, setNeedCreate] = useState(undefined)
  const [showCreate, setShowCreate] = useState(undefined)
  
  useEffect(() => {
    index(authToken, '/agenda').then(({data}) => {

      if (data.length === 0) {
        setNeedCreate(true)
        setShowCreate(true)
        setDays([])
        return
      }

      setNeedCreate(false)
      setShowCreate(false)
      setDays(JSON.parse(data[0].days))
    })
  }, [reload])
  
  const changeDay = (element, e, item) => {
    let daysNew = days
    let data
    let teste = daysNew.indexOf(item)

    if (teste === -1) {
      console.log('error')
      return
    }
    
    if (element === 'check') {
      data = e.target.checked
      daysNew[teste] = {...daysNew[teste], enable: data}
      console.log(daysNew[teste])
    }
    if (element === 'start') {
      data = e.target.value
      daysNew[teste] = {...daysNew[teste], start: data}
      console.log(daysNew[teste])
    }
    if (element === 'end') {
      data = e.target.value
      daysNew[teste] = {...daysNew[teste], end: data}
      console.log(daysNew[teste])
    }

    update(authToken, 'agenda', null, {days: daysNew}).then(() => {
      console.log('OK')
    })
  }

  const createAgenda = () => {
    setShowCreate(false)
    store(authToken, '/agenda', {days: daysJson}).then(() => {
      setReload(!reload)
    })
  }

  return (
    <Card>
      <CardBody className="card-body-agenda">
        <div className="container-all">
          <div className="container">
            <Card>
              <CardHeader title="Opções">
                  <CardHeaderToolbar>

                </CardHeaderToolbar>
              </CardHeader>
              {
                needCreate && showCreate ? 
                <CardBody>
                <h6>Você ainda não tem uma configuração de agenda!</h6>

                <div>
                    <Button onClick={() => createAgenda()}>Criar</Button>
                  </div>
              </CardBody> : <></>
              }
            </Card>
          </div>
          <div className="container">
            <Card>
              <CardHeader title="Seleção de Horarios">
                <CardHeaderToolbar>

                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {
                  !needCreate ? 
                  <div className="container-select-days">

                  {
                    days.map(item => (
                      <div className="select-day" key={item.day}>
                        <div className="day-of-week">
                        <Form.Check
                          type="checkbox"
                          className="select-day-check"
                          defaultChecked={item.enable}
                          onChange={(e) => {
                            changeDay('check', e, item)
                          }}
                        />
                        <span>{labelsDay[item.day]}</span>
                        </div>

                        <div className="hours-of-day">
                          <div className="startHour">
                            <div className="containerHour">
                    
                              <Form.Control
                                type="time"
                                className="form-control-hour-agenda"
                                defaultValue={item.start}
                                onChange={(e) => {
                                  changeDay('start', e, item)
                                }}
                              />
                            </div>
                          </div>
                          <span className="separator-hours">  {' '}  ás {' '} </span>
                          <div className="endHour">
                            <div className="containerHour">
                      
                              <Form.Control
                                className="form-control-hour-agenda"
                                type="time"
                                defaultValue={item.end}
                                onChange={(e) => {
                                  changeDay('end', e, item)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                    </div>
                    ))
                  }
            
                  </div> : <></>
                 
                }
              </CardBody>
            </Card>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}