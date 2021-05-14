import React, {useState, useEffect} from 'react';
import { Card, Select, Table, Space, Tooltip, Button, Input,  Form as FormNew } from 'antd'
import { index, destroy, store, update } from '~/app/controllers/controller'
import {Form} from 'react-bootstrap'
import { useSelector } from "react-redux";
// import { Container } from './styles';
import { useHistory, useRouteMatch } from "react-router-dom";
import { FolderOpenOutlined, DeleteOutlined,
  EditOutlined, DollarCircleOutlined } from '@ant-design/icons';

const {Option} = Select

export function Especialidades() {  
  const { params, url } = useRouteMatch();
  const {user: {authToken}} = useSelector((state) => state.auth);
  const [especialidade, setEspecialidade] = useState(undefined)
  const [especialidades, setEspecialidades] = useState(undefined)
  const [especialidadesOptions, setEspecialidadesOptions] = useState(undefined)
  const [reload, setReload] = useState(false)
  
  const [comissaoVista, setComissaoVista] = useState(undefined)
  const [comissaoBoleto, setComissaoBoleto] = useState(undefined)


  useEffect(() => {
    index(authToken, 'especialidades').then(({data}) => {
      setEspecialidadesOptions(data.map(item => ({
        label: item.name,
        value: item.id
      })))
    })

    index(authToken, `/especialidade/comissao/${params.id}`).then(({data}) => {
      setEspecialidades(data)
    })
  }, [reload])

  const handleCreate = () => {
    store(authToken, `/especialidade/comissao/${params.id}`, 
    {especialidade, comissaoVista, comissaoBoleto}).then(({data}) => {
      setReload(!reload)
    })
  }

  const handleDelete = (id) => {
    destroy(authToken, '/especialidade/comissao', id).then(_ => {
      setReload(!reload)
    })
  }

  return (
    <Card title="Especialidades">
      <div className="container-especialidades">
        <div className="select-especialidades" style={{alignSelf: 'self-start'}}>
          <Select
            style={{ width: '100%' }}
            placeholder="Selecione as Especialidades"
            options={especialidadesOptions}
            value={especialidade}
            onChange={(e) => {
              console.log(e)
              setEspecialidade(e)
            }}
          />
          <div className="selected">
            <div className="config-select-especialidade">
              <Form.Row className="justify-content-md-center" style={{flexWrap: 'nowrap', width: '100%'}}>
                <FormNew.Item
                  style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}
                  label="Comissão - À vista"
                >
                  <Input
                    type="number"  
                    placeholder="Ex: 50 => 50%" 
                    onChange={e => setComissaoVista(e.target.value)}
                    value={comissaoVista}
                    disabled={!especialidade}
                    suffix="%"
                  />
                </FormNew.Item>
                <FormNew.Item
                  style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}
                  label="Comissão - Boleto"
                >
                  <Input
                    type="number"  
                    placeholder="Ex: 50 => 50%" 
                    onChange={e => setComissaoBoleto(e.target.value)}
                    value={comissaoBoleto}
                    disabled={!especialidade}
                    suffix="%"
                  />
                </FormNew.Item>
              </Form.Row>
            </div>
            <Button onClick={() => handleCreate()} disabled={!especialidade}>Selecionar</Button>
          </div>
        </div>
        <div className="selected-especialidades">
          <Table
            columns={[
              {
                title: 'Especialidade',
                dataIndex: 'especialidade',
                render: data => <span>{data.name}</span>
              },
              {
                title: '% - À vista',
                dataIndex: 'comissao_vista',
                render: data => <span>{data}%</span>
              },
              {
                title: '% - Boleto',
                dataIndex: 'comissao_boleto',
                render: data => <span>{data}%</span>
              },
              {
                title: "Ações",
                classes: "text-right pr-0",
                render: data => (
                  <Space size="middle">
                    <Tooltip placement="top" title="Excluir">
                      <span onClick={() => handleDelete(data.id) }  style={{"cursor": "pointer"}} className="svg-icon menu-icon">
                        <DeleteOutlined twoToneColor="#eb2f96"/>
                      </span>
                    </Tooltip>
                  </Space>
                )
              },
            ]}
            dataSource={especialidades}
          />
        </div>
      </div>
    </Card>
  );
}