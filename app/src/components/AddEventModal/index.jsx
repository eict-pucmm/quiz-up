import React from "react";
import { Modal, Button, Form, Input } from "antd";
import DatePicker from "react-datepicker";
import EVENT from "../../constants/event";

import "react-datepicker/dist/react-datepicker.css";

const AddEventModal = ({
  visible,
  onCancel,
  onSubmit,
  handleChange,
  handleDateChange,
  eventToAdd,
  saving
}) => {
  const { name, dateOfEvent } = eventToAdd;

  return (
    <Modal
      centered
      cancelText="Cancelar"
      onCancel={onCancel}
      title={"Agregar un nuevo Evento"}
      visible={visible}
      footer={[
        <Button key="submit" loading={saving} onClick={onSubmit}>
          Crear Evento
        </Button>
      ]}
    >
      <Form
        layout="vertical"
        size="medium"
        labelCol={{
          span: 12
        }}
      >
        {EVENT.map(attributes => (
          <Form.Item label={attributes.label} key={attributes.id}>
            {attributes.id === "dateOfEvent" ? (
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
      </Form>
    </Modal>
  );
};

export default AddEventModal;
