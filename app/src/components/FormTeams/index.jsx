import React from 'react';
import { Button, Input, Select, Form } from 'antd';
import { useMediaQuery } from 'react-responsive';

import { useStateValue } from '../../state';
import { addTeam, setTeams } from '../../state/actions';

const { Option } = Select;

const FormTeams = ({ form, ...props }) => {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const { state, dispatch } = useStateValue();
  const { allMedicalCenters, allResidents, editing } = state.teams;
  const {
    name,
    errorName,
    errorMedicalCenter,
    errorResidents,
  } = state.teamToAdd;

  const handleNameChange = e => {
    const name = e.target.value;
    if (editing) dispatch(setTeams({ nameChanged: true }));
    dispatch(addTeam({ name, errorName: name.length < 3 }));
  };

  const onResidentChange = value => {
    form.setFieldsValue({ residents: value });
    dispatch(
      addTeam({
        residents: value,
        errorResidents: value === 0 || value > 3,
      })
    );
  };

  const handleMedChange = value => {
    form.setFieldsValue({ medicalCenter: value });
    dispatch(addTeam({ medicalCenter: value }));
  };

  return (
    <Form
      form={form}
      layout={isDesktop ? 'horizontal' : 'vertical'}
      labelCol={{ span: isDesktop ? 4 : 8 }}
      wrapperCol={{ span: isDesktop ? 8 : 0 }}>
      {errorName && <p className="red">Favor introducir mínimo 3 caracteres</p>}
      <Form.Item label="Nuevo Equipo: " name="name">
        <Input
          value={name}
          onChange={handleNameChange}
          placeholder="Nombre del equipo"
        />
      </Form.Item>

      {errorResidents && <p className="red">Favor seleccionar 3 residentes</p>}
      <Form.Item label="Residentes" name="residents">
        <Select
          showArrow
          mode="multiple"
          onChange={onResidentChange}
          placeholder="Selecionar residentes">
          {allResidents.map(({ firstName, lastName, key }) => (
            <Option value={firstName + ' ' + lastName} key={key}>
              {firstName + ' ' + lastName}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {errorMedicalCenter && (
        <p className="red">Favor introducir un centro médico valido</p>
      )}
      <Form.Item label="Centro Médico: " name="medicalCenter">
        <Select
          showArrow
          placeholder="Seleccionar centro médico del equipo"
          onChange={handleMedChange}>
          {allMedicalCenters.map(({ name, _id }) => (
            <Option value={name} key={_id}>
              {name}
            </Option>
          ))}
        </Select>
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

export default FormTeams;
