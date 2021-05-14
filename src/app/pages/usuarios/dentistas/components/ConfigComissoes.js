import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from "react-inlinesvg";
import { Link } from "react-router-dom";
import { index, destroy, store, update } from "~/app/controllers/controller";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { Modal, Button, Form, Col, InputGroup } from "react-bootstrap";
import { useFormik } from "formik";
import api from "~/app/services/api";
import * as Yup from "yup";
import notify from "devextreme/ui/notify";
import {MixedWidget1} from '../../../../../_metronic/_partials/widgets/index'
import {Input , Form as FormNew} from 'antd'

import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "~/_metronic/_partials/controls";

import { DropdownMenu1 } from "~/_metronic/_partials/dropdowns";

import './styles.css'

export function ConfigComissoes() {

  const { params, url } = useRouteMatch()
  const {
    user: { authToken,  },
  } = useSelector((state) => state.auth);
  const {
    user
  } = useSelector((state) => state.auth);
  const history = useHistory();
  const [days, setDays] = useState([]);
  const [agendaConfig, setAgendaConfig] = useState(undefined);
  const [reload, setReload] = useState(false);
  const [needCreate, setNeedCreate] = useState(true);
  const [showCreate, setShowCreate] = useState(true);
  const [selectMenu, setSelectMenu] = useState("horarios");
  const [modal, setModal] = useState(false);
  const [config, setConfig] = useState({undefined})
  const [configEspecialidade, setConfigEspecialidades] = useState([])
  const [editComissao, setEditComissao] = useState(undefined)


  const [tipoPagamento, setTipoPagamento] = useState(1)

  useEffect(() => {
    index(authToken, `/configuracao/comissao/${params.id}`).then(({ data }) => {
      setConfig(data.comissao)
      console.log(data.configEspecialidade)
      setConfigEspecialidades(data.configEspecialidade)
    })
  }, [reload]);


  const updateConfig = (item) => {
    update(authToken, `/configuracao/comissao`, params.id, item ).then((data) => {
      setReload(!reload)
    })  
  }

  const updateComissaoEspecialidade = (id) => {
    update(authToken, `/especialidade/comissao`, id, editComissao ).then((data) => {
      setEditComissao(undefined)
      setReload(!reload)
    })  
  }

  return (
    <Card>
      <Modal size="lg" show={editComissao ? true : false} onHide={() => setEditComissao(undefined)} >
        <Modal.Header closeButton>
          <Modal.Title>Alterar comissão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form style={{display: 'flex', justifyContent: 'space-around', paddingLeft: 10, paddingRight: 10}}>
            <Form.Row className="justify-content-md-center">
              <FormNew.Item
                style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}
                label="Clinico Geral à vista"
              >
                <Input
                  type="number" 
                  defaultValue={editComissao ? editComissao.comissao_vista : ''} 
                  placeholder="Ex: 50 => 50%" 
                  onChange={e => setEditComissao({...editComissao, comissao_vista: e.target.value})}
                  disabled={editComissao ? editComissao.recebe_comissao === 0 : ''}
                  suffix="%"
                />
              </FormNew.Item>
            </Form.Row>
            <Form.Row className="justify-content-md-center">
              <FormNew.Item
                style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}
                label="Clinico Geral Boleto"
              >
                <Input
                  type="number" 
                  defaultValue={editComissao ? editComissao.comissao_boleto : ''} 
                  placeholder="Ex: 50 => 50%" 
                  onChange={e => setEditComissao({...editComissao, comissao_boleto: e.target.value})}
                  disabled={editComissao ? editComissao.recebe_comissao === 0 : ''}
                  suffix="%"
                />
              </FormNew.Item>
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setEditComissao(undefined)
            }}
          >
            Fechar
          </Button>
          <Button variant="primary" onClick={() => {updateComissaoEspecialidade(editComissao.id)}}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal size="lg" show={modal} onHide={() => {}} >
        <Modal.Header closeButton>
          <Modal.Title>Alterar métodos de pagamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>

          <fieldset className="fildset-container" >
          <legend className="fildset-title">Recebe Comissão</legend>
            <Form.Row className="justify-content-md-center">
              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Check
                  type="radio"
                  label="Sim"
                  name="recebe"
                  id="recebe"
                  defaultChecked={config.recebe_comissao === 1}
                  onChange={(e) => updateConfig({recebe_comissao: e.target.checked ? 1 : 0})}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Check
                  type="radio"
                  label="Não"
                  name="recebe"
                  id="recebe2"
                  defaultChecked={config.recebe_comissao === 0}
                  onChange={(e) => updateConfig({recebe_comissao: e.target.checked ? 0 : 1})}
                />
              </Form.Group>
            </Form.Row>
          </fieldset>

          <fieldset className="fildset-container" >
          <legend className="fildset-title">Pagamento</legend>
            <Form.Row className="justify-content-md-center">
              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Check
                  type="radio"
                  label="Por Orçamento"
                  name="recebimentoType"
                  id="pagamento"
                  disabled={config.recebe_comissao === 0}
                  defaultChecked={config.pagamento === 0}
                  onChange={(e) => updateConfig({pagamento: e.target.checked ? 0 : 1})}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Check
                  type="radio"
                  label="Na Execução do Procedimento"
                  name="recebimentoType"
                  id="pagamento2"
                  disabled={config.recebe_comissao === 0}
                  defaultChecked={config.pagamento === 1}
                  onChange={(e) => updateConfig({pagamento: e.target.checked ? 1 : 0})}
                />
              </Form.Group>
            </Form.Row>
          </fieldset>
          
          <fieldset className="fildset-container" >
          <legend className="fildset-title">Taxas</legend>
            <Form.Row className="justify-content-md-center">
              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Check 
                  type="checkbox" 
                  label="Descontar Taxas de Pagamento" 
                  id="impostos"
                  disabled={config.recebe_comissao === 0}
                  defaultChecked={config.descontar_impostos === 1}
                  onChange={(e) => updateConfig({descontar_impostos: e.target.checked ? 1 : 0})}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Label>Descontar Impostos</Form.Label>
                <Form.Control 
                  type="number" 
                  defaultValue={config.impostos} 
                  disabled={config.descontar_impostos === 0 && config.recebe_comissao === 0}
                  onChange={e => updateConfig({impostos: e.target.value})}
                  placeholder="Ex: 50 => 50%" />
              </Form.Group>
            </Form.Row>
          </fieldset>
        
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setModal(false);
            }}
          >
            Fechar
          </Button>
          {/* <Button variant="primary" onClick={() => {}}>
            Salvar
          </Button> */}
        </Modal.Footer>
      </Modal>
      <CardBody className="card-body-agenda">
        <div className="container-all">
          <div className="container">
            <Card>
              <CardHeader title="Opções">
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              {needCreate && showCreate ? (
                <CardBody>
                  <div className="container-comissao" style={{borderColor: config.recebe_comissao === 0 ? 'red' : 'rgb(56, 142, 60)'}}>
                      <div className="header-container-comissao" style={{backgroundColor: config.recebe_comissao === 0 ? 'red' : 'rgb(56, 142, 60)'}}>
                        <span> Opções de Pagamento </span>
                      </div>
                      <div className="body-container-comissao">
                        Recebe ?
                        <div className="modo-pagamento">
                          <div className="modo-pagamento-row">
                            <input type="checkbox" name="teste" id="" checked={config.recebe_comissao === 1} />
                            <span>Recebe comissão</span>
                          </div>
                          <div className="modo-pagamento-row">
                            <input type="checkbox" name="teste" id="" checked={config.recebe_comissao === 0} />
                            <span>Não recebe comissão</span>
                          </div>
                        </div>
                        <div className="modo-pagamento">
                          <div className="modo-pagamento-row">
                            <input type="checkbox" name="teste" id="" checked={config.pagamento === 0} />
                            <span>Orçamento</span>
                          </div>
                          <div className="modo-pagamento-row">
                            <input type="checkbox" name="teste" id="" checked={config.pagamento === 1} />
                            <span>Procedimento</span>
                          </div>
                        </div>
                        <div className="buttons-actions">
                          <Button onClick={() => setModal(!modal)}>Editar</Button>
                        </div>
                      </div>
                  </div>
                </CardBody>
              ) : (
                <></>
              )}

              {
                !needCreate ? (
                  <ul className="ul_button_config">
                    <li
                      className={`button_config ${
                        selectMenu === "horarios" ? "active_button" : ""
                      }`}
                      onClick={() => setSelectMenu("horarios")}
                    >
                      Horarios
                    </li>
                    <li
                      className={`button_config ${
                        selectMenu === "escala" ? "active_button" : ""
                      }`}
                      onClick={() => setSelectMenu("escala")}
                    >
                      Escala
                    </li>
                  </ul>
                ) : <></>
              }
            </Card>
          </div>
          <div className="container">
            <Card>
              <CardHeader title="Comissão">
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
              
                {
                  configEspecialidade.map(item => (
                    <div className="container-comissao" style={{borderColor: config.recebe_comissao === 0 ? 'red' : 'rgb(56, 142, 60)', marginBottom: 10}}>
                      <div className="header-container-comissao" style={{backgroundColor: config.recebe_comissao === 0 ? 'red' : 'rgb(56, 142, 60)'}}>
                        <span> {item.especialidade.name} </span>
                      </div>
                      <div className="body-container-comissao">
                        <div style={{width: '100%', display: 'flex', justifyContent: 'space-evenly', marginTop: 20}}>
                        <div className="comissao-valor">
                          <span>Comissão Geral</span>
                          <span className="span-comissao">{item.comissao_vista}%</span>
                        </div>
                        <div className="comissao-valor">
                          <span>Comissão Boleto</span>
                          <span className="span-comissao">{item.comissao_boleto}%</span>
                        </div>
                        </div>
                        <div className="buttons-actions">
                          <Button onClick={() => setEditComissao(item)}>Editar</Button>
                        </div>
                      </div>
                    </div>
                  ))
                }
              
              </CardBody>
            </Card>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
