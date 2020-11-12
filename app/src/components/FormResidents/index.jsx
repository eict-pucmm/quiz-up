import React from 'react';
import { Button, Input, Select, Form } from 'antd';
import { useMediaQuery } from 'react-responsive';

const { Option } = Select;

const FormResidents = ({ firstName, lastName, form, ...props }) => {
  const { setFirstName, setLastName, setGrade, onSubmit, editing } = props;
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  return (
    <Form
      form={form}
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
      <Form.Item label="Grado: " name="grade">
        <Select
          defaultValue={'2do Año'}
          optionFilterProp="children"
          onChange={value => {
            form.setFieldsValue({ grade: value });
            setGrade(value);
          }}
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
        <Button type="primary" htmlType="submit" onClick={onSubmit}>
          {editing ? 'Actualizar' : 'Agregar'}
        </Button>
        {editing && (
          <Button
            type="danger"
            onClick={props.cancelUpdate}
            className="cancel-btn-form">
            Cancelar
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default FormResidents;
