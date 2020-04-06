import React from 'react';
import { Form, Input } from 'antd';
import DatePicker from 'react-datepicker';
import EVENT from '../../constants/event';
import MyModal from '../MyModal';

import 'react-datepicker/dist/react-datepicker.css';

const AddEventModal = ({
  eventToAdd,
  handleChange,
  handleDateChange,
  ...props
}) => {
  const { name, dateOfEvent } = eventToAdd;

  return (
    <MyModal {...props} title={'Agregar un nuevo Evento'} type="Evento">
      {EVENT.map((attributes) => (
        <Form.Item label={attributes.label} key={attributes.id}>
          {attributes.id === 'dateOfEvent' ? (
            <DatePicker
              {...attributes}
              className="ant-input"
              onChange={handleDateChange}
              selected={dateOfEvent}
            />
          ) : (
            <Input {...attributes} value={name} onChange={handleChange} />
          )}
        </Form.Item>
      ))}
    </MyModal>
  );
};

export default AddEventModal;
