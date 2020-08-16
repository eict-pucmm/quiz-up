import React from 'react';
import { Form, Input } from 'antd';
import DatePicker from 'react-datepicker';
import debounce from 'lodash/debounce';

import { setEvents, addEvent } from '../../state/actions';
import { useStateValue } from '../../state';
import EVENT from '../../constants/event';
import MyModal from '../MyModal';

import 'react-datepicker/dist/react-datepicker.css';

const EventModal = props => {
  const {
    dispatch,
    state: { events, eventToAdd },
  } = useStateValue();

  const onClose = () => dispatch(setEvents({ openModal: false }));

  const handleChange = event => {
    const { name, value } = event.target;

    dispatch(addEvent({ [name]: value }));
  };

  const handleDateChange = debounce(date => {
    dispatch(addEvent({ dateOfEvent: date }));
  }, 500);

  return (
    <MyModal
      onCancel={onClose}
      visible={events.openModal}
      saving={events.saving}
      title="Agregar un nuevo Evento"
      type="Evento"
      {...props}
    >
      {EVENT.map(({ label, id, name, ...attributes }) => (
        <Form.Item label={label} key={id}>
          {id === 'dateOfEvent' ? (
            <DatePicker
              {...attributes}
              className="ant-input"
              name={name}
              onChange={handleDateChange}
              selected={eventToAdd[name]}
            />
          ) : (
            <Input
              {...attributes}
              name={name}
              value={eventToAdd[name]}
              onChange={handleChange}
            />
          )}
        </Form.Item>
      ))}
    </MyModal>
  );
};

export default EventModal;
