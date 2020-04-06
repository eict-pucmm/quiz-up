import React from 'react';
import { Card, Col } from 'antd';

const RoundCard = ({ round, showModal, loading, index }) => {
  const { _id, name } = round;
  return (
    <Col className="gutter-row" span={8}>
      <Card
        hoverable
        className="cursor-pointer"
        key={_id}
        loading={loading}
        onClick={() => showModal(index)}
        title={name}
        type="inner"
        extra={
          <span
            onClick={() => showModal(index)}
            className="more-info-label cursor-pointer"
          >
            Mas Informacion
          </span>
        }
      >
        Round Data
      </Card>
    </Col>
  );
};

export default RoundCard;
