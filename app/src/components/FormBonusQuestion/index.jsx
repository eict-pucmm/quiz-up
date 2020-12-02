import React from 'react';
import { Button, Input, Form } from 'antd';
import { useMediaQuery } from 'react-responsive';

import { useStateValue } from '../../state';
import { addQuestion, setQuestionsAttributes } from '../../state/actions';

const BonusQuestionsForm = ({ form, ...props }) => {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const { state, dispatch } = useStateValue();
  const { editing } = state.questions;
  const { name, errorName } = state.questionToAdd;

  const handleNameChange = e => {
    const name = e.target.value;
    if (editing) dispatch(setQuestionsAttributes({ nameChanged: true }));
    dispatch(addQuestion({ name, errorName: name.length < 4 }));
  };

  return (
    <Form
      form={form}
      layout={isDesktop ? 'horizontal' : 'vertical'}
      labelCol={{ span: isDesktop ? 4 : 8 }}
      wrapperCol={{ span: isDesktop ? 8 : 0 }}>
      {errorName && <p className="red">Favor introducir mínimo 4 caracteres</p>}
      <Form.Item label="Nueva Pregunta Bono:">
        <Input value={name} onChange={handleNameChange} />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 14, offset: isDesktop ? 4 : 0 }}>
        <Button type="primary" htmlType="submit" onClick={props.onSubmit}>
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

export default BonusQuestionsForm;
