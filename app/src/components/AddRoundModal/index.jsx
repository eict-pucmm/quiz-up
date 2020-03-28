import React from "react";
import { Modal, Button, Form, Input } from "antd";

const AddRoundModal = ({
  gameEvent,
  visible,
  onCancel,
  onSubmit,
  handleChange,
  roundToAdd
}) => {
  const { name } = roundToAdd;
  return (
    <Modal
      cancelText="Cancelar"
      centered
      onCancel={onCancel}
      title={`Agregar nueva ronda al evento: ${gameEvent.name}`}
      visible={visible}
      footer={[
        <Button key="submit" onClick={onSubmit}>
          Crear Ronda
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
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRoundModal;
