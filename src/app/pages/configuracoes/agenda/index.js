import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'
import { index, destroy, store } from '~/app/controllers/machineController'
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

export default function ConfigurarAgenda() {
  const { user: { authToken } } = useSelector((state) => state.auth);
  const history = useHistory();

  const daysWeek = [
    {
      label: 'Segunda',
      start: '08:00',
      end: '18:00'
    },
    {
      label: 'Terça',
      start: '08:00',
      end: '18:00'
    },
    {
      label: 'Quarta',
      start: '08:00',
      end: '18:00'
    },
    {
      label: 'Quinta',
      start: '08:00',
      end: '18:00'
    },
    {
      label: 'Sexta',
      start: '08:00',
      end: '18:00'
    },
    {
      label: 'Sabado',
      start: '08:00',
      end: '18:00'
    },
    {
      label: 'Domingo',
      start: '08:00',
      end: '18:00'
    },
  ]

  return (
    <Card>
      <CardHeader title="Configurar Agenda">
        <CardHeaderToolbar>

        </CardHeaderToolbar>
      </CardHeader>
      <CardBody className="card-body-agenda">
        <div className="container-all">
          <div className="container">
            <Card>
              <CardHeader title="Opções">
                  <CardHeaderToolbar>

                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>

              </CardBody>
            </Card>
          </div>
          <div className="container">
            <Card>
              <CardHeader title="Seleção de Horarios">
                <CardHeaderToolbar>

                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <div className="container-select-days">
         
                {
                  daysWeek.map(item => (
                    <div className="select-day">
                      <div className="day-of-week">
                      <Form.Check
                        type="checkbox"
                        className="select-day-check"
                        checked
                      />
                      <span>{item.label}</span>
                      </div>

                      <div className="hours-of-day">
                        <div className="startHour">
                          <div className="containerHour">
                            <span>Abertura</span>
                            <Form.Control
                              type="time"
                              className="form-control-hour-agenda"
                              defaultValue={item.start}
                            />
                          </div>
                        </div>
                        <span className="separator-hours">-</span>
                        <div className="endHour">
                          <div className="containerHour">
                            <span>Fechamento</span>
                            <Form.Control
                              className="form-control-hour-agenda"
                              type="time"
                              defaultValue={item.end}
                            />
                          </div>
                        </div>
                      </div>
                  </div>
                  ))
                }
         
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}