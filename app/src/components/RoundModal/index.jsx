import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';

import { addRound } from '../../state/actions';
import { useStateValue } from '../../state';
import ROUND from '../../constants/round';
import MyModal from '../MyModal';
import { getCategories } from '../../api/categories';
import { getTeams } from '../../api/teams';

const { Option } = Select;

const RoundModal = ({ gameEvent, ...props }) => {
  const {
    dispatch,
    state: { roundToAdd, round },
  } = useStateValue();
  const { name } = roundToAdd;
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await getCategories();
      setCategories(data || []);
    };

    const loadTeams = async () => {
      const { data } = await getTeams();

      setTeams(data);
    };

    loadCategories();
    loadTeams();
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    dispatch(addRound({ [name]: value }));
    setError(value.length < 3);
  };

  const onSelectEvents = value => dispatch(addRound({ categories: value }));

  const onSelectTeams = value => dispatch(addRound({ teams: value }));

  return (
    <MyModal
      {...props}
      saving={round.saving}
      type="Ronda"
      title={`Agregar nueva ronda al evento: ${gameEvent.name}`}>
      {ROUND.map(({ label, id, ...attr }) => (
        <Form.Item label={label} key={id}>
          <Input {...attr} value={name} onChange={handleChange} />
          {error && (
            <p style={{ color: 'red' }}>Favor introducir más de 3 carácteres</p>
          )}
        </Form.Item>
      ))}
      <Form.Item label="Categorías">
        <Select
          showArrow
          mode="multiple"
          onChange={onSelectEvents}
          placeholder="Categorías de esta ronda"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }>
          {categories.map(({ name, _id }) => (
            <Option value={_id} key={_id}>
              {name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Equipos">
        <Select
          mode="multiple"
          onChange={onSelectTeams}
          placeholder="Equipos que participaran en esta ronda">
          {teams.map(({ name, _id }) => (
            <Option value={_id} key={_id}>
              {name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </MyModal>
  );
};

export default RoundModal;
