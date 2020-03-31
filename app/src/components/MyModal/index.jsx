import React from "react";
import { Modal, Button, Form } from "antd";

const MyModal = ({
  children,
  onCancel,
  onSubmit,
  saving,
  title,
  type,
  visible
}) => {
  return (
    <Modal
      centered
      onCancel={onCancel}
      title={title}
      visible={visible}
      footer={[
        <Button key="submit" loading={saving} onClick={onSubmit}>
          Crear {type}
        </Button>
      ]}
    >
      <Form layout="vertical" size="medium" labelCol={{ span: 12 }}>
        {children}
      </Form>
    </Modal>
  );
};

export default MyModal;
