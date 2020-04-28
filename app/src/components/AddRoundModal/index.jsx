import React from 'react';
import { Form, Input } from 'antd';
import ROUND from '../../constants/round';
import MyModal from '../MyModal';

const AddRoundModal = ({ roundToAdd, gameEvent, handleChange, ...props }) => {
  const { name } = roundToAdd;
  return (
    <MyModal
      {...props}
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

export default AddRoundModal;
