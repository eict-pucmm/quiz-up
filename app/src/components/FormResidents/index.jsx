import React from 'react';
import { Button, Input, Select, Form } from 'antd';
import { useMediaQuery } from 'react-responsive';

const { Option } = Select;

const FormResidents = ({ firstName, lastName, ...props }) => {
  const { setFirstName, setLastName, setGrade, onSubmit } = props;
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  return (
    <Form
      layout={isDesktop ? 'horizontal' : 'vertical'}
      labelCol={{ span: isDesktop ? 4 : 8 }}
      wrapperCol={{ span: isDesktop ? 8 : 0 }}>
      <Form.Item label="Nombres: ">
        <Input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          name="firstName"
        />
      </Form.Item>
      <Form.Item label="Apellidos: ">
        <Input
          name="lastName"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Grado: ">
        <Select
          defaultValue={'2do Año'}
          optionFilterProp="children"
          onChange={value => setGrade(value)}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }>
          {['2do Año', '3er Año'].map(value => (
            <Option value={value} key={value}>
              {value}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item wrapperCol={{ span: 14, offset: isDesktop ? 4 : 0 }}>
        <Button key="submit" type="primary" onClick={onSubmit}>
          Agregar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormResidents;
