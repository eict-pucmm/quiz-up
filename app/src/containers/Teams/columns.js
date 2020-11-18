import React from 'react';
import { Avatar, Tooltip, Tag } from 'antd';

import ActionButtons from '../../components/ActionButtons';

export const COLUMNS = ({ onUpdate }) => {
  return [
    {
      title: 'Equipo',
      dataIndex: 'name',
      key: 'team',
    },
    {
      title: 'Residentes',
      dataIndex: 'residents',
      key: 'residents',
      render: text => (
        <>
          {text.map(cualquiera => (
            <Tag color="blue" key={cualquiera}>
              {cualquiera}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Centro Médico',
      dataIndex: 'medicalCenter',
      key: 'medicalCenter',
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
                backgroundColor: '#fde3cf',
              }}>{`${firstName[0]}${lastName[0]}`}</Avatar>
          </Tooltip>
        );
      },
    },
    {
      title: 'Acción',
      key: 'action',
      render: record => (
        <ActionButtons onUpdate={() => onUpdate(record.key)} update />
      ),
    },
  ];
};
