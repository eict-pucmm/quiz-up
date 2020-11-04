import React from 'react';
import { Avatar, Tooltip } from 'antd';

import ActionButtons from '../../components/ActionButtons';

export const COLUMNS = ({ onUpdate, onRemove }) => {
  return [
    {
      title: 'Centros Medicos',
      dataIndex: 'name',
      key: 'medicalCenter',
      width: 500,
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
      width: 200,
      render: record => (
        <ActionButtons
          onUpdate={() => onUpdate(record.key)}
          onRemove={() => onRemove(record.key)}
          update
          remove
        />
      ),
    },
  ];
};
