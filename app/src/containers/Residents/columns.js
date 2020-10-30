import React from 'react';
import ActionButtons from '../../components/ActionButtons';

export const COLUMNS = ({ onUpdate }) => {
  return [
    {
      title: 'Nombres',
      dataIndex: 'firstName',
      key: 'firstName',
      width: 200,
    },
    {
      title: 'Apellidos',
      dataIndex: 'lastName',
      key: 'lastName',
      width: 200,
    },
    {
      title: 'Grado',
      dataIndex: 'grade',
      key: 'grade',
      width: 100,
    },
    {
      title: 'Acción',
      key: 'action',
      width: 100,
      render: record => (
        <ActionButtons onUpdate={() => onUpdate(record.key)} update />
      ),
    },
  ];
};
