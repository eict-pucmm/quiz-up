import React from 'react';
import { Modal, Button } from 'antd';

const MyModal = props => {
  const { children, onCancel, onSubmit, saving, title, type, visible } = props;
  return (
    <Modal
      centered
      onCancel={onCancel}
      title={title}
      visible={visible}
      footer={[
        <Button key="submit" loading={saving} onClick={onSubmit}>
          Crear {type}
        </Button>,
      ]}>
      <>{children}</>
    </Modal>
  );
};

export default MyModal;
