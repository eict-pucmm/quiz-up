import React, { useState } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

import { auth } from '../../constants/firebase';
import { setUser } from '../../api/user';

const Login = () => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then(async res => {
        setUser(res.user.getIdToken(true));
        window.location.replace('/');
      })
      .catch(error => {
        setError(true);
        console.error('Error signing in with password and email', error);
      });
  };

  return (
    <Modal
      visible
      footer={null}
      title="Iniciar Sesion - Quiz Up"
      maskStyle={{
        background: 'linear-gradient(to bottom, #2980b9, #6dd5fa, #ffffff)',
      }}>
      {error && (
        <p style={{ color: 'red' }}>¡Correo electronico o clave incorrecta!</p>
      )}
      <Form
        form={form}
        layout="vertical"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 0 }}>
        <Form.Item label="Correo: ">
          <Input
            value={email}
            onChange={e => setEmail(e.target.value.trim())}
            name="email"
          />
        </Form.Item>
        <Form.Item label="Contraseña: " rules={[{ required: true }]}>
          <Input
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 14 }}>
          <Button
            key="submit"
            type="primary"
            onClick={event => {
              signInWithEmailAndPasswordHandler(event, email, password);
            }}>
            <LoginOutlined /> Iniciar Sesión
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Login;
