import React, { useEffect, useState } from 'react';
import { Button, Input, Alert, Space, Form, InputNumber } from 'antd';

const FinalQuestion = ({ form, ...props }) => {
  return (
    <div>
      <Alert
        message="Pregunta Ronda Final"
        description="Desea participar en la Pregunta de Bono Final ?"
        type="info"
        action={
          <Space direction="vertical">
            <Button size="small" type="primary" onClick={props.handleAccept}>
              Aceptar
            </Button>
            <Button size="small" danger type="ghost" onClick={props.handleDeny}>
              Rechazar
            </Button>
          </Space>
        }
      />
      {props.participating && (
        <div>
          <Form form={form}>
            <Form.Item label="Puntaje a apostar:">
              <InputNumber
                min={0}
                max={props.points}
                defaultValue={0}
                onChange={e => props.handleNumberVal(e)}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 14, offset: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={props.handleFinal}>
                Enviar
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};

export default FinalQuestion;
