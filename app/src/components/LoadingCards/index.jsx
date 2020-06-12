import React from 'react';
import { Card } from 'antd';

const LoadingCards = ({ loading }) => (
  <div className="loading-card">
    {[1, 2, 3].map(i => (
      <Card key={i} loading={loading} />
    ))}
  </div>
);

export default LoadingCards;
