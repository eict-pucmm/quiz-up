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

  const handleChange = ({ target: { name, value } }) =>
    dispatch(addRound({ [name]: value }));

  const onSelectEvents = value => dispatch(addRound({ categories: value }));

  const onSelectTeams = value => dispatch(addRound({ teams: value }));

  return (
    <MyModal
      {...props}
      saving={round.saving}
      type="Ronda"
      title={`Agregar nueva ronda al evento: ${gameEvent.name}`}>
      {ROUND.map(attributes => (
        <Form.Item label={attributes.label} key={attributes.id}>
          <Input {...attributes} value={name} onChange={handleChange} />
        </Form.Item>
      ))}
      <Form.Item label="Categorías del evento">
        <Select mode="multiple" onChange={onSelectEvents}>
          {categories.map(({ name, _id }) => (
            <Option value={_id} key={_id}>
              {name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Equipos disponibles">
        <Select mode="multiple" onChange={onSelectTeams}>
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
