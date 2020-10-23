import React from 'react';
import { Button, Input, Select, Form } from 'antd';
import { useMediaQuery } from 'react-responsive';

const { Option } = Select;

const FormTeams = ({ allResidents, teamName, ...props }) => {
  const { handleNameChange, handleMedChange, onSelectChange, onSubmit } = props;
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  //TODO: add input validations and select for no more than 3 residents
  return (
    <Form
      layout={isDesktop ? 'horizontal' : 'vertical'}
      labelCol={{ span: isDesktop ? 4 : 8 }}
      wrapperCol={{ span: isDesktop ? 8 : 0 }}>
      <Form.Item label="Nuevo Equipo: ">
        <Input
          value={teamName}
          onChange={handleNameChange}
          placeholder="Nombre del equipo"
        />
      </Form.Item>
      <Form.Item label="Residentes">
        <Select
          showArrow
          mode="multiple"
          onChange={onSelectChange}
          placeholder="Selecionar residentes">
          {allResidents.map(({ firstName, lastName, key }) => (
            <Option value={firstName + ' ' + lastName} key={key}>
              {firstName + ' ' + lastName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Centro Medico: ">
        <Select
          showArrow
          placeholder="Seleccionar centro medico del equipo"
          onChange={handleMedChange}>
          {/*TODO: add request for the medical centers*/}
          {['Centro Medico #1', 'Centro Medico #2'].map(cm => (
            <Option value={cm} key={cm}>
              {cm}
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

export default FormTeams;
