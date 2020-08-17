import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';

import { addRound } from '../../state/actions';
import { useStateValue } from '../../state';
import ROUND from '../../constants/round';
import MyModal from '../MyModal';
import { getCategories } from '../../api/categories';

const { Option } = Select;

const RoundModal = ({ gameEvent, ...props }) => {
  const {
    dispatch,
    state: { roundToAdd, round },
  } = useStateValue();
  const { name } = roundToAdd;
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await getCategories();

      setCategories(data || []);
    };

    loadCategories();
  }, []);

  const handleChange = ({ target: { name, value } }) =>
    dispatch(addRound({ [name]: value }));

  const handleSelect = value => dispatch(addRound({ categories: value }));

  return (
    <MyModal
      {...props}
      saving={round.saving}
      type="Ronda"
      title={`Agregar nueva ronda al evento: ${gameEvent.name}`}
    >
      {ROUND.map(attributes => (
        <Form.Item label={attributes.label} key={attributes.id}>
          <Input {...attributes} value={name} onChange={handleChange} />
        </Form.Item>
      ))}
      <Form.Item label="Categorías del evento">
        <Select mode="multiple" onChange={handleSelect}>
          {categories.map(({ name, _id }) => (
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
