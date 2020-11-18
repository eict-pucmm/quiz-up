import React, { useRef } from 'react';
import { Form, Input, Select } from 'antd';

import { SHARED_PROPS } from '../';
import { addRound, setRoundAttributes } from '../../../state/actions';
import { useStateValue } from '../../../state';

const { Option } = Select;

const GeneralData = props => {
  const {
    dispatch,
    state: { roundToAdd },
  } = useStateValue();
  const { allCategories, allTeams, form } = props;
  const { errorName, errorCategories, errorTeams } = roundToAdd;
  const categoriesRef = useRef();
  const teamsRef = useRef();

  const handleChange = ({ target: { value } }) => {
    if (props.showInfo) dispatch(setRoundAttributes({ nameChanged: true }));
    dispatch(addRound({ name: value, errorName: value.length < 3 }));
  };

  const onSelectEvents = value => {
    form.setFieldsValue({ categories: value });
    dispatch(
      addRound({ categories: value, errorCategories: value.length !== 4 })
    );
    if (value.length === 4) categoriesRef.current.blur();
  };

  const onSelectTeams = value => {
    form.setFieldsValue({ teams: value });
    const participants = value.map(v => ({ team: v }));
    dispatch(addRound({ participants, errorTeams: value.length !== 4 }));
    if (value.length === 4) teamsRef.current.blur();
  };

  return (
    <>
      {errorName && <p className="red">Favor introducir más de 3 caracteres</p>}
      <Form.Item label="Nombre">
        <Input
          name="name"
          value={roundToAdd.name}
          placeholder="Nombre de la ronda"
          onChange={handleChange}
        />
      </Form.Item>

      {errorCategories && (
        <p className="red">Favor de seleccionar 4 categorías</p>
      )}
      <Form.Item label="Categorías" name="categories">
        <Select
          {...SHARED_PROPS}
          ref={categoriesRef}
          onChange={onSelectEvents}
          placeholder="Categorías de esta ronda">
          {allCategories.map(({ name, _id }) => (
            <Option value={name} key={_id}>
              {name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {errorTeams && <p className="red">Favor de seleccionar 4 equipos</p>}
      <Form.Item label="Equipos" name="teams">
        <Select
          {...SHARED_PROPS}
          ref={teamsRef}
          onChange={onSelectTeams}
          placeholder="Equipos que participaran en esta ronda">
          {allTeams.map(({ name, _id }) => (
            <Option value={_id} key={_id}>
              {name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

export default GeneralData;
