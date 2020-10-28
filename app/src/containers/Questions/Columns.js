import React from 'react';
import { Tag } from 'antd';

import ActionButtons from '../../components/ActionButtons';

export const COLUMNS = ({ onRemove, onUpdate }) => {
  return [
    {
      title: 'Pregunta',
      dataIndex: 'name',
      key: 'pregunta',
    },
    {
      title: 'Categorías',
      dataIndex: 'categories',
      key: 'categories',
      render: text => (
        <>
          {text.map(category => (
            <Tag color="blue" key={category}>
              {category}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Valor',
      dataIndex: 'points',
      key: 'points',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.points - b.points,
    },
    {
      title: 'Acción',
      key: 'action',
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
