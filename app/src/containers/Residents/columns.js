import React from 'react';
import { Avatar, Tooltip } from 'antd';

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
      title: 'Creado Por',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 150,
      render: record => {
        if (!record) return;
        const { firstName, lastName } = record;
        return (
          <Tooltip title={`${firstName} ${lastName}`} placement="top">
            <Avatar
              style={{
                backgroundColor: '#f99548',
              }}>{`${firstName[0]}${lastName[0]}`}</Avatar>
          </Tooltip>
        );
      },
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
