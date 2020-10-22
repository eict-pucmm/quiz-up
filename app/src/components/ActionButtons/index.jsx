import React from 'react';
import { Button } from 'antd';

const ActionButtons = props => {
  const { update = false, remove = false, onUpdate, onRemove } = props;

  return (
    <>
      {update && (
        <Button type="link" onClick={onUpdate}>
          Modificar
        </Button>
      )}
      {remove && (
        <Button danger type="text" onClick={onRemove}>
          Remover
        </Button>
      )}
    </>
  );
};

export default ActionButtons;
