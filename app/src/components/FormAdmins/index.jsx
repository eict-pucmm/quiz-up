import React from 'react';
import EmailValidator from 'email-validator';
import { Button, Input, Form, Checkbox } from 'antd';
import { useMediaQuery } from 'react-responsive';

import { useStateValue } from '../../state';
import { addAdmin } from '../../state/actions';

const FormAdmins = ({ form, ...props }) => {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const {
    state: { adminToAdd },
    dispatch,
  } = useStateValue();
  const {
    errorFirstName,
    errorLastName,
    errorConfirm,
    errorPassword,
    errorEmail,
  } = adminToAdd;

  const handleCheckbox = e => {
    const allAccess = e.target.checked;
    form.setFieldsValue({ allAccess });
    dispatch(addAdmin({ allAccess }));
  };

  const handleNameChange = e => {
    const value = e.target.value;
    const field = e.target.name;
    const errors = {
      firstName: { var: 'errorFirstName', validate: value.length < 2 },
      lastName: { var: 'errorLastName', validate: value.length < 2 },
      email: { var: 'errorEmail', validate: !EmailValidator.validate(value) },
      password: { var: 'errorPassword', validate: value.length < 8 },
      confirmPassword: {
        var: 'errorConfirm',
        validate: value !== adminToAdd.password,
      },
    };
    const error = errors[field];
    dispatch(addAdmin({ [field]: value, [error.var]: error.validate }));
  };

  return (
    <Form
      form={form}
      layout={isDesktop ? 'horizontal' : 'vertical'}
      labelCol={{ span: isDesktop ? 4 : 8 }}
      wrapperCol={{ span: isDesktop ? 8 : 0 }}>
      <Form.Item label="Nombres">
        <Input
          name="firstName"
          onChange={handleNameChange}
          value={adminToAdd.firstName}
        />
        {errorFirstName && (
          <p className="red">Favor introducir mínimo 2 caracteres</p>
        )}
      </Form.Item>

      <Form.Item label="Apellidos">
        <Input
          name="lastName"
          onChange={handleNameChange}
          value={adminToAdd.lastName}
        />
        {errorLastName && (
          <p className="red">Favor introducir mínimo 2 caracteres</p>
        )}
      </Form.Item>

      <Form.Item label="Correo Electrónico">
        <Input
          name="email"
          onChange={handleNameChange}
          value={adminToAdd.email}
        />
        {errorEmail && <p className="red">Favor introducir un correo valido</p>}
      </Form.Item>

      <Form.Item label="Contraseña">
        <Input.Password
          name="password"
          onChange={handleNameChange}
          value={adminToAdd.password}
        />
        {errorPassword && (
          <p className="red">Favor introducir mínimo 8 caracteres</p>
        )}
      </Form.Item>
      <Form.Item label="Confirmar Contraseña">
        <Input.Password
          name="confirmPassword"
          onChange={handleNameChange}
          value={adminToAdd.confirmPassword}
        />
        {errorConfirm && (
          <p className="red">Favor introducir la misma contraseña</p>
        )}
      </Form.Item>

      <Form.Item label="Acceso Completo:" name="allAccess">
        <Checkbox onChange={handleCheckbox} checked={adminToAdd.allAccess} />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 14, offset: isDesktop ? 4 : 0 }}>
        <Button type="primary" htmlType="submit" onClick={props.onSubmit}>
          Agregar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormAdmins;
