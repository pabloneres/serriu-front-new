import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody} from "~/_metronic/_partials/controls";
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import { Form, Col, Button, Navbar, Nav  } from "react-bootstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { update, show } from '~/controllers/controller'
import { UploadOutlined } from '@ant-design/icons'
import { Input, Upload, Radio, message } from 'antd'

import {
  Container,
  ContainerTitle,
  Title,
  ContainerUpload,
  ImageUpload,
  UploadButton,
} from './styles'


function UploadClient(props) {
  const { params, url } = useRouteMatch()
  const { intl } = props;
  const { token } = useSelector((state) => state.auth);
  const history = useHistory();
  const [patient, setPatient] = useState({})
  const [reload, setReload] = useState(false)

  const prop = {
    name: 'image',
    action: process.env.REACT_APP_API_URL + '/attachment',
    headers: {
      Authorization: "Bearer " + token
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        // message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        // message.error(`${info.file.name} file upload failed.`);
      }
    },
  }

  useEffect(() => {
    show(token, '/patient', params.id)
      .then(({data}) => {
        setPatient(data)
      })
      .catch((err)=> history.push('/pacientes'))
  }, [reload])

  const handleUpdate = (e, prop) => {
    const data = {...patient, [prop]: e.target.value}
    setPatient(data)

    update(token, '/patient', params.id, data).then(_ => {
      // setReload(!reload)
    }).catch(error => console.error(error))
  }

  return (
    <Card>
      <CardHeader title="Uploads do Paciente"></CardHeader>
      <CardBody>
        <Container>
          <ContainerUpload>
            <ContainerTitle>
              <Title>
                Upload - CPF
              </Title>
            </ContainerTitle>
            <ImageUpload
              src="https://data.pixiz.com/output/user/frame/preview/400x400/0/8/8/3/1163880_6ec48.jpg"
              onClick={() => {}}
            />
            <Upload
              {...prop}
            >
              <UploadButton>
                Clique para enviar
              </UploadButton>
            </Upload>
            <Radio.Group onChange={(e) => { handleUpdate(e, 'cpf_verified') }} value={patient.cpf_verified}>
              <Radio value={1}>Verificado</Radio>
              <Radio value={0}>Não verificado</Radio>
            </Radio.Group>
          </ContainerUpload>

          <ContainerUpload>
            <ContainerTitle>
              <Title>
                Upload - RG
              </Title>
            </ContainerTitle>
            <ImageUpload
              onClick={() => {}}
            />
            <Upload
              {...prop}
            >
              <UploadButton>
                Clique para enviar
              </UploadButton>
            </Upload>
            <Radio.Group onChange={(e) => { handleUpdate(e, 'rg_verified') }} value={patient.rg_verified}>
              <Radio value={1}>Verificado</Radio>
              <Radio value={0}>Não verificado</Radio>
            </Radio.Group>
          </ContainerUpload>

          <ContainerUpload>
            <ContainerTitle>
              <Title>
                Upload - Endereço
              </Title>
            </ContainerTitle>
            <ImageUpload
              onClick={() => {}}
            />
            <Upload
              {...prop}
            >
              <UploadButton>
                Clique para enviar
              </UploadButton>
            </Upload>
            <Radio.Group onChange={(e) => { handleUpdate(e, 'address_verified') }} value={patient.address_verified}>
              <Radio value={1}>Verificado</Radio>
              <Radio value={0}>Não verificado</Radio>
            </Radio.Group>
          </ContainerUpload>
        </Container>
      </CardBody>
    </Card>
  );
}

export default UploadClient