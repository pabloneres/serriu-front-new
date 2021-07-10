import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form, notification } from 'antd';
import { convertMoney } from '~/modules/Util'
import { DatabaseOutlined } from '@ant-design/icons';
import notify from "devextreme/ui/notify";
import { Notify } from '~/modules/global'

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

function EditableTable({ data, setDesconto, desconto, setSelecionado }) {
  // const [selecionado, setSelecionado] = useState([]);
  const [selectionType, setSelectionType] = useState("checkbox");
  const columns = [
    {
      title: "Procedimento",
      dataIndex: "procedimento",
      render: (data) => <span>{data.name}</span>,
    },
    {
      title: "Valor un",
      render: (data) => (
        <span>{data.valor ? convertMoney(data.valor) : ""}</span>
      )
    },
    {
      title: "Valor total",
      editable: true,
      dataIndex: 'valorTotal',
      render: data => (
        <span>{convertMoney(data)}</span>
      )
    },
    {
      title: "%",
      render: data => (
        <span>{((data.valor - data.desconto) * 100 / data.valor).toFixed(2)}%</span>
      )
    },
    {
      title: "Status",
      dataIndex: "status_pagamento",
      render: (data) => <span>{data}</span>,
    },
  ]

  const handleSave = (row) => {

    if (row.valorTotal > row.valor) {
      Notify('error', 'Erro geral', 'erro geral test')
      return
    }

    setDesconto(row)
    // const newData = data;
    // const index = newData.findIndex((item) => row.key === item.id);
    // const item = newData[index];
    // newData.splice(index, 1, { ...item, ...row });
    // this.setState({
    //   dataSource: newData,
    // });
  };

  // const { dataSource } = this.state;
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columnsNew = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  const rowSelection = {
    onChange: (rowKey, selectedRows) => {
      setSelecionado(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.status_pagamento === "pago",
    }),
  };

  return (
    <Table
      pagination={false}
      components={components}
      rowClassName={() => 'editable-row'}
      dataSource={data.map(item => ({
        ...item,
        valorTotal: item.desconto === 0 ? item.valor : item.desconto,
        key: item.id
      }))}
      columns={columnsNew}
      rowSelection={setSelecionado ? {
        type: selectionType,
        ...rowSelection,
      } : false}
    />
  );
}

export default EditableTable

// components={componentsNew}
// columns={columnsNew}
// dataSource={data.procedimentos.map((item) => ({
//   ...item,
//   key: item.id,
// }))}