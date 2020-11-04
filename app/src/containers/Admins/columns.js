import React from 'react';
import { Checkbox } from 'antd';

import ActionButtons from '../../components/ActionButtons';

export const COLUMNS = ({ onRemove }) => {
  return [
    {
      title: 'Nombres',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Apellidos',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Acceso completo',
      dataIndex: 'allAccess',
      key: 'allAccess',
      render: allAccess => <Checkbox disabled checked={allAccess} />,
    },
    {
      title: 'Acción',
      key: 'action',
      render: record => (
        <ActionButtons onRemove={() => onRemove(record.key)} remove />
      ),
    },
  ];
};
