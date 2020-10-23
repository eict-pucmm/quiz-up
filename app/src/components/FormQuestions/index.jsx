import React from 'react';
import { Button, Input, Select, InputNumber, Form } from 'antd';
import { useMediaQuery } from 'react-responsive';

const { Option } = Select;

const FormQuestions = ({ questionName, allCategories, ...props }) => {
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  return (
    <Form
      layout={isDesktop ? 'horizontal' : 'vertical'}
      labelCol={{ span: isDesktop ? 4 : 8 }}
      wrapperCol={{ span: isDesktop ? 8 : 0 }}>
      {/** TODO: add error message when value length is less than 4 */}
      <Form.Item label="Nueva Pregunta:">
        <Input value={questionName} onChange={props.handleNameChange} />
      </Form.Item>

      {/** TODO: add error message when value is not 100 || 200 || 300 || 400 || 500 */}
      <Form.Item label="Categorias:">
        <Select mode="multiple" onChange={props.onSelectChange}>
          {allCategories.map(({ name }) => (
            <Option value={name} key={name}>
              {name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Valor en puntos: ">
        <InputNumber
          min={100}
          max={500}
          step={100}
          defaultValue={100}
          onChange={props.handleValueChange}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ span: 14, offset: isDesktop ? 4 : 0 }}>
        <Button key="submit" type="primary" onClick={props.onSubmit}>
          Agregar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormQuestions;
