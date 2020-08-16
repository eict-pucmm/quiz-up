import React from 'react';
import { Form, Input } from 'antd';

import { addRound } from '../../state/actions';
import { useStateValue } from '../../state';
import ROUND from '../../constants/round';
import MyModal from '../MyModal';

const RoundModal = ({ gameEvent, ...props }) => {
  const {
    dispatch,
    state: { roundToAdd, rounds },
  } = useStateValue();
  const { name } = roundToAdd;

  const handleChange = ({ target: { name, value } }) =>
    dispatch(addRound({ [name]: value }));

  return (
    <MyModal
      {...props}
      saving={rounds.saving}
      type="Ronda"
      title={`Agregar nueva ronda al evento: ${gameEvent.name}`}
    >
      {ROUND.map(attributes => (
        <Form.Item label={attributes.label} key={attributes.id}>
          <Input {...attributes} value={name} onChange={handleChange} />
        </Form.Item>
      ))}
    </MyModal>
  );
};

export default RoundModal;
