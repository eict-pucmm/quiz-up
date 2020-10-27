import React, { useState, useEffect } from 'react';
import {
  Breadcrumb,
  Button,
  Input,
  Form,
} from 'antd';


import { auth , provider } from '../../constants/firebase'

const Login = () => {
    const [form] = Form.useForm();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

     const signInWithEmailAndPasswordHandler = (event, email, password) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
        .then( async res => {              
            localStorage.setItem('USER', res.user)
            window.location.replace("/")
            
        })
        .catch(error => {
            setError("Error signing in with password and email!");
            console.error("Error signing in with password and email", error);
        });
     }


  return (
    <>
      <Breadcrumb className="breadcrumb-title">
        <Breadcrumb.Item>Iniciar Sesión</Breadcrumb.Item>
      </Breadcrumb>
      {error && 
            <p style={{color:"red"}}>{error}</p>
        }
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 8 }}>
        
        <Form.Item label="Correo: ">
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
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

        <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
          <Button key="submit" type="primary" onClick={(event) => {signInWithEmailAndPasswordHandler(event, email, password)}}>
            Iniciar Sesión
          </Button>
        </Form.Item>
      </Form>

    </>
  );
};

export default Login