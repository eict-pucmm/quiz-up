import React from "react";
import { Modal, Button, Form, Input } from "antd";
import ROUND from "../../constants/round";

const AddRoundModal = ({
  gameEvent,
  handleChange,
  onCancel,
  onSubmit,
  roundToAdd,
  saving,
  visible
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
        <Button key="submit" loading={saving} onClick={onSubmit}>
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
        {ROUND.map(attributes => (
          <Form.Item label={attributes.label} key={attributes.id}>
            <Input {...attributes} value={name} onChange={handleChange} />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default AddRoundModal;
