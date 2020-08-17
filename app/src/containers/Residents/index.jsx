import React, { useState, useEffect } from 'react';
import {
  Breadcrumb,
  Button,
  notification,
  Input,
  Table,
  Select,
  Form,
} from 'antd';

import { getResidents, saveResident } from '../../api/resident';

const { Option } = Select;

const Residents = () => {
  const [form] = Form.useForm();
  const [residents, setResidents] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [grade, setGrade] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      title: 'Nombres',
      dataIndex: 'firstName',
      key: 'firstName',
      width: 200,
      render: text => <p>{text}</p>,
    },
    {
      title: 'Apellidos',
      dataIndex: 'lastName',
      key: 'lastName',
      width: 200,
      render: text => <p>{text}</p>,
    },
    {
      title: 'Grado',
      dataIndex: 'grade',
      key: 'grade',
      width: 100,
      render: text => <p>{text}</p>,
    },
  ];

  useEffect(() => {
    const get = async () => {
      const { data } = await getResidents();

      setResidents(data || []);
      setLoading(false);
    };

    if (!saving) get();
  }, [saving]);

  const onSubmit = async () => {
    setSaving(true);
    setLoading(true);

    const { error } = await saveResident({ firstName, lastName, grade });

    if (error) {
      setSaving(false);
      return notification['error']({
        message: error.data.message || error.data,
      });
    }

    setTimeout(() => {
      notification['success']({
        message: 'El residente ha sido agregado con exito',
      });

      setFirstName('');
      setLastName('');
      setGrade('');
      setSaving(false);
    }, 600);
  };

  return (
    <>
      <Breadcrumb className="breadcrumb-title">
        <Breadcrumb.Item>Residentes</Breadcrumb.Item>
      </Breadcrumb>
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}
      >
        <Form.Item label="Agregar Residente:" />
        <Form.Item label="Nombres: ">
          <Input
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            name="firstName"
          />
        </Form.Item>
        <Form.Item label="Apellidos: " rules={[{ required: true }]}>
          <Input
            name="lastName"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Grado: " rules={[{ required: true }]}>
          <Select
            defaultValue={'2do Año'}
            optionFilterProp="children"
            onChange={value => setGrade(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {['2do Año', '3er Año'].map(value => (
              <Option value={value} key={value}>
                {value}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
          <Button key="submit" type="primary" onClick={onSubmit}>
            Agregar
          </Button>
        </Form.Item>
      </Form>

      <div className="outer-categories-card">
        <Table
          loading={loading}
          columns={columns}
          dataSource={residents}
          pagination={{ pageSize: 6 }}
          scroll={{ y: 400 }}
        />
      </div>
    </>
  );
};

export default Residents;
