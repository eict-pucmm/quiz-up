import React, { useState } from 'react';
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
  const [error, setError] = useState(false);

  const onClose = () => dispatch(setEvents({ openModal: false }));

  const handleChange = event => {
    const { name, value } = event.target;

    setError(value.length < 3);

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
      {...props}>
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
            <>
              <Input
                {...attributes}
                name={name}
                value={eventToAdd[name]}
                onChange={handleChange}
              />
              {error && (
                <p style={{ color: 'red' }}>
                  {'Favor introducir más de 3 caracteres'}
                </p>
              )}
            </>
          )}
        </Form.Item>
      ))}
    </MyModal>
  );
};

export default EventModal;
