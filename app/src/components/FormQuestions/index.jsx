import React from 'react';
import { Button, Input, Select, InputNumber, Form } from 'antd';
import { useMediaQuery } from 'react-responsive';

import { useStateValue } from '../../state';
import { addQuestion, setQuestionsAttributes } from '../../state/actions';

const { Option } = Select;
const POINTS = [100, 200, 300, 400, 500];

const FormQuestions = ({ form, ...props }) => {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const { state, dispatch } = useStateValue();
  const { allCategories, editing } = state.questions;
  const { name, errorPoints, errorName, errorCategories } = state.questionToAdd;

  const handlePointsChange = value => {
    form.setFieldsValue({ points: value });
    dispatch(
      addQuestion({ points: value, errorPoints: !POINTS.includes(value) })
    );
  };

  const handleSelect = value => {
    form.setFieldsValue({ categories: value });
    dispatch(addQuestion({ categories: value, errorCategories: value === 0 }));
  };

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
      {errorName && <p className="red">Favor introducir minimo 4 caracteres</p>}
      <Form.Item label="Nueva Pregunta:">
        <Input value={name} onChange={handleNameChange} />
      </Form.Item>

      {errorCategories && (
        <p className="red">Favor de seleccionar al menos una categoria</p>
      )}
      <Form.Item label="Categorias:" name="categories">
        <Select mode="multiple" onChange={handleSelect}>
          {allCategories.map(({ name }) => (
            <Option value={name} key={name}>
              {name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {errorPoints && (
        <p className="red">
          Favor introducir un valor de 100, 200, 300, 400, 500
        </p>
      )}
      <Form.Item label="Valor en puntos: " name="points">
        <InputNumber
          min={POINTS[0]}
          max={POINTS[4]}
          step={POINTS[0]}
          defaultValue={POINTS[0]}
          onChange={handlePointsChange}
        />
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

export default FormQuestions;
