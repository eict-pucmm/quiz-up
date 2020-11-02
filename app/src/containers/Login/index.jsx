import React, { useState } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

import { auth } from '../../constants/firebase';
import { setUser } from '../../api/user';
import { getAdminById } from '../../api/admins';

const Login = () => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    setLoading(true);

    auth
      .signInWithEmailAndPassword(email, password)
      .then(async () => {
        const { uid, email } = auth.currentUser;
        const { data } = await getAdminById(uid);
        const token = await auth.currentUser.getIdToken(true);
        setUser(token, email, data._id);
        window.location.replace('/');
      })
      .catch(error => {
        setError(true);
        console.error('Error signing in with password and email', error);
      })
      .finally(() => {
        setLoading(false);
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
      {error && <p className="red">¡Correo electronico o clave incorrecta!</p>}
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
            loading={loading}
            type="primary"
            onClick={event => {
              signInWithEmailAndPasswordHandler(event, email, password);
            }}>
            Iniciar Sesión <LoginOutlined />
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Login;
