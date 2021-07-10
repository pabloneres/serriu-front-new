import React, {useEffect, useState, useRef, useContext} from 'react';
import { 
  Container,
  AList,
  ListContainer,
  Span,
  AInputNumber,
  ContainerAll,
  AButton
} from './styles';


import {Table, Form, Input, InputNumber, Popconfirm, Typography} from 'antd'

import { index, store } from '~/controllers/controller'
import { useSelector } from 'react-redux'
import { relativeTimeRounding } from 'moment';

function Geral(props) {
  const { token } = useSelector(state => state.auth)
  const { selectedClinic } = useSelector(state => state.clinic)
  const [form] = Form.useForm();
  const [cargos, setCargos] = useState([])
  const [values, setValues] = useState({})
  const [editingKey, setEditingKey] = useState('');

  const [reload, setReload] = useState(false)

  const isEditing = (record) => record.id === editingKey;

  useEffect(() => {
    index(token, '/department').then(({data}) => {
      let departments = data
      let newObj = []
        index(token, `/departmento_desconto?clinic_id=${selectedClinic.id}`).then(({data}) => {
          departments.forEach(department => {

            if (data.length > 0) {
              data.forEach(discount => {   
                if (discount.department_id === department.id) {
                  newObj.push({
                    ...department,
                    discount: discount.discount
                  })
                  console.log({department: department.id, discount: discount.id, value: discount.discount})
                } 
                
                if (discount.department_id !== department.id) {

                  newObj.forEach(obj => {
                    if (obj.id === discount.department_id) {
                      newObj.push({
                        ...department,
                        discount: discount.discount
                      })
                    }
                  })

                  console.log({department: department.id, discount: discount.id, value: discount.discount})
                  newObj.push({
                    ...department,
                    discount: 0
                  })
                }

              })
            } else {    
              newObj.push({
                ...department,
                discount: 0
              })
            }

          })
          setCargos(newObj)
        })
    })
  }, [reload])

  useEffect(() => {
    console.log(values)
  }, [values])

  const handleSave = (row, key) => {
    const dataSend = {
      discount: row.discount,
      department_id: key,
    }

    store(token, `/departmento_desconto/${selectedClinic.id}`, dataSend).then(() => {
      setReload(!relativeTimeRounding)
    })
  }

  const send = () => {
    console.log(values)
  }

  const columns = [
    {
      title: 'Cargo',
      dataIndex: 'name',
    },
    {
      title: 'Desconto máximo',
      dataIndex: 'discount',
      editable: true
    },
    {
      title: 'Ações',
      width: '250px',
      render: (data) => {
        const editable = isEditing(data);
        return editable ? (
          <span>
            <Popconfirm title="Deseja salvar ?" onConfirm={() => save(data.id)}>
              <AButton type="primary" style={{marginRight: 10}}>Salvar</AButton>
            </Popconfirm>
            <Popconfirm title="Deseja cancelar ?" onConfirm={cancel}>
              <AButton>Cancelar</AButton>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(data)}>
            Editar
          </Typography.Link>
        );
      },
    },
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'discount' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...cargos];
      const index = newData.findIndex((item) => key === item.id);

      handleSave(row, key)

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        console.log(newData)
        setCargos(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        console.log(newData)
        setCargos(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const edit = (data) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...data,
    });
    setEditingKey(data.id);
  };

  return (
    <Container title="Descontos">
      <ContainerAll>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={cargos}
            columns={mergedColumns}
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
        {/* <Table
          components={components}
          columns={columns.map((col) => {
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
                handleSave: () => {},
              }),
            };
          })}
          dataSource={cargos}
        /> */}
        {/* <AList>
          {
            cargos.map(cargo => (
              <AList.Item>
                <ListContainer>
                  <Span>{cargo.name}</Span>
                  <AInputNumber 
                  max={100}
                  value={values[cargo.id]}
                  onChange={(e) => {handleChangeValue(e, cargo)}} suffix="%"/>
                </ListContainer>
              </AList.Item>
            ))
          }
        </AList> */}
      </ContainerAll>
    </Container>
  )
}

export default Geral;

const Extra = (props) => {
  return (
    <AButton onClick={() => props.send()} type="primary">Salvar</AButton>
  )
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber max={100} /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};


// import React, { useState } from 'react';
// import { Table, Input, InputNumber, Popconfirm, Form, Typography } from 'antd';
// const originData = [];

// for (let i = 0; i < 100; i++) {
//   originData.push({
//     key: i.toString(),
//     name: `Edrward ${i}`,
//     age: 32,
//     address: `London Park no. ${i}`,
//   });
// }

// const EditableCell = ({
//   editing,
//   dataIndex,
//   title,
//   inputType,
//   record,
//   index,
//   children,
//   ...restProps
// }) => {
//   const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
//   return (
//     <td {...restProps}>
//       {editing ? (
//         <Form.Item
//           name={dataIndex}
//           style={{
//             margin: 0,
//           }}
//           rules={[
//             {
//               required: true,
//               message: `Please Input ${title}!`,
//             },
//           ]}
//         >
//           {inputNode}
//         </Form.Item>
//       ) : (
//         children
//       )}
//     </td>
//   );
// };

// const EditableTable = () => {
//   const [form] = Form.useForm();
//   const [data, setData] = useState(originData);
//   const [editingKey, setEditingKey] = useState('');

//   const isEditing = (record) => record.key === editingKey;

//   const edit = (record) => {
//     form.setFieldsValue({
//       name: '',
//       age: '',
//       address: '',
//       ...record,
//     });
//     setEditingKey(record.key);
//   };

//   const cancel = () => {
//     setEditingKey('');
//   };

//   const save = async (key) => {
//     try {
//       const row = await form.validateFields();
//       const newData = [...data];
//       const index = newData.findIndex((item) => key === item.key);

//       if (index > -1) {
//         const item = newData[index];
//         newData.splice(index, 1, { ...item, ...row });
//         setData(newData);
//         setEditingKey('');
//       } else {
//         newData.push(row);
//         setData(newData);
//         setEditingKey('');
//       }
//     } catch (errInfo) {
//       console.log('Validate Failed:', errInfo);
//     }
//   };

//   const columns = [
//     {
//       title: 'name',
//       dataIndex: 'name',
//       width: '25%',
//       editable: true,
//     },
//     {
//       title: 'age',
//       dataIndex: 'age',
//       width: '15%',
//       editable: true,
//     },
//     {
//       title: 'address',
//       dataIndex: 'address',
//       width: '40%',
//       editable: true,
//     },
//     {
//       title: 'operation',
//       dataIndex: 'operation',
//       render: (_, record) => {
//         const editable = isEditing(record);
//         return editable ? (
//           <span>
//             <a
//               href="javascript:;"
//               onClick={() => save(record.key)}
//               style={{
//                 marginRight: 8,
//               }}
//             >
//               Save
//             </a>
//             <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
//               <a>Cancel</a>
//             </Popconfirm>
//           </span>
//         ) : (
//           <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
//             Edit
//           </Typography.Link>
//         );
//       },
//     },
//   ];
//   const mergedColumns = columns.map((col) => {
//     if (!col.editable) {
//       return col;
//     }

//     return {
//       ...col,
//       onCell: (record) => ({
//         record,
//         inputType: col.dataIndex === 'age' ? 'number' : 'text',
//         dataIndex: col.dataIndex,
//         title: col.title,
//         editing: isEditing(record),
//       }),
//     };
//   });
//   return (
//     <Form form={form} component={false}>
//       <Table
//         components={{
//           body: {
//             cell: EditableCell,
//           },
//         }}
//         bordered
//         dataSource={data}
//         columns={mergedColumns}
//         rowClassName="editable-row"
//         pagination={{
//           onChange: cancel,
//         }}
//       />
//     </Form>
//   );
// };