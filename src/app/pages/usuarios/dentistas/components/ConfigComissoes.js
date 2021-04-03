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


  const [tipoPagamento, setTipoPagamento] = useState(1)

  useEffect(() => {
    index(authToken, `/configuracao/comissao/${params.id}`).then(({ data }) => {
      setConfig(data)
    })
  }, [reload]);


  const updateConfig = (item) => {
    update(authToken, `/configuracao/comissao`, params.id, item ).then((data) => {
      setReload(!reload)
    })  
  }

  return (
    <Card>
      <Modal size="lg" show={modal} onHide={() => {}} >
        <Modal.Header closeButton>
          <Modal.Title>Adicionar nova configuração de comissão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>

            <fieldset className="fildset-container" >
              <legend className="fildset-title">Aprovação da Clinica</legend>
              <Form.Row className="justify-content-md-center">
                <Form.Group as={Col} controlId="formGridAddress1">
                  <Form.Check 
                    type="checkbox" 
                    label="Requer Aprovação" 
                    defaultChecked={config.requer_aprovacao === 1} 
                    onChange={e => updateConfig({requer_aprovacao: e.target.checked ? 1 : 0})}
                  />
                </Form.Group>
              </Form.Row>
            </fieldset>
         
            {/* <fieldset className="fildset-container" >
              <legend className="fildset-title">Forma de Cobrança</legend>
               <Form.Row className="justify-content-md-center">
                <Form.Group as={Col} controlId="formGridAddress1">
                  <Form.Check
                    type="radio"
                    label="Porcentagem"
                    name="paymentType"
                    value={1}
                    defaultChecked={config.forma_cobranca === 0}
                    id="porcentagemPagamento"
                    onChange={(e) => updateConfig({forma_cobranca: e.target.checked ? 0 : 1})}
                  />
                </Form.Group>
              
                <Form.Group as={Col} controlId="formGridAddress1">
                  <Form.Check
                    type="radio"
                    label="Valor Fixo Procedimento"
                    name="paymentType"
                    value={2}
                    defaultChecked={config.forma_cobranca === 1}
                    onChange={(e) => updateConfig({forma_cobranca: e.target.checked ? 1 : 0})}
                    id="porcentagemPagamento"
                  />
                </Form.Group>
              </Form.Row>
            </fieldset> */}

          {
            tipoPagamento === 1 ? 
            <fieldset className="fildset-container" >
              <legend className="fildset-title">Comissão</legend>
              <Form.Row className="justify-content-md-center">
                <Form.Group as={Col} controlId="formGridAddress1">
                  <Form.Label>Comissão Geral</Form.Label>
                  <Form.Control 
                    type="number" 
                    defaultValue={config.comissao_geral} 
                    placeholder="Ex: 50 => 50%" 
                    onChange={e => updateConfig({comissao_geral: e.target.value})}
                  />
                </Form.Group>
              </Form.Row>
            </fieldset> : 
              <></>
          }

          <fieldset className="fildset-container" >
          <legend className="fildset-title">Pagamento</legend>
            <Form.Row className="justify-content-md-center">
              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Check
                  type="radio"
                  label="No Recebimento do Pagamento"
                  name="recebimentoType"
                  id="pagamento"
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
                  defaultChecked={config.descontar_impostos === 1}
                  onChange={(e) => updateConfig({descontar_impostos: e.target.checked ? 1 : 0})}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Label>Descontar Impostos</Form.Label>
                <Form.Control 
                  type="number" 
                  defaultValue={config.impostos} 
                  disabled={config.descontar_impostos === 0}
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
                  <div>
                    <h6 style={{fontSize: 14}}>Alteração de Comissão</h6>
                    <Button onClick={() => setModal(!modal)}>Alterar</Button>
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
                <div className="container-comissao">
                  <div className="header-container-comissao">
                    <span>Recebimento</span>
                  </div>
                  <div className="body-container-comissao">
                    <div className="modo-pagamento">
                      <div className="modo-pagamento-row">
                        <input type="checkbox" name="teste" id="" checked={config.forma_cobranca === 0} />
                        <span>Porcentagem</span>
                      </div>
                      <div className="modo-pagamento-row">
                        <input type="checkbox" name="teste" id="" checked={config.forma_cobranca === 1} />
                        <span>Procedimento</span>
                      </div>
                    </div>
                    <div className="comissao-valor">
                      <span>Comissão Geral</span>
                      <span className="span-comissao">{config.comissao_geral}%</span>
                    </div>
                    <div className="buttons-actions">
                      <Button onClick={() => setModal(true)}>Editar</Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
