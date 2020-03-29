import React from "react";
import { Modal, Button, Form, Input } from "antd";
import DatePicker from "react-datepicker";

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
      cancelText="Cancelar"
      centered
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
        labelCol={{
          span: 4
        }}
        wrapperCol={{
          span: 14
        }}
        layout="horizontal"
        size="medium"
      >
        <Form.Item>
          <Input name="name" value={name} onChange={handleChange} />
          <DatePicker
            selected={dateOfEvent}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEventModal;
