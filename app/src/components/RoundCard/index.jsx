import React, { useEffect, useState } from 'react';
import { Card, Col, Tag, Avatar, Tooltip, Divider } from 'antd';

import { getRoundById } from '../../api/round';

const RoundCard = ({ round, showModal, index }) => {
  const { _id, name } = round;
  const [fetchedRound, setFetchedRound] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRound = async () => {
      const { data } = await getRoundById(_id);

      setFetchedRound(data || round);
      setLoading(false);
    };

    loadRound();
  }, [_id, round]);

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
            className="more-info-label cursor-pointer">
            Mas Informacion
          </span>
        }>
        <p>Categorias:</p>
        {fetchedRound.categories &&
          fetchedRound.categories.map(({ name, _id }) => (
            <Tag color="blue" key={_id}>
              {name}
            </Tag>
          ))}
        <Divider />
        <p>Equipos:</p>
        <>
          {['A', 'B', 'C', 'D'].map(letter => (
            <Tooltip title={`Equipo ${letter}`} placement="top" key={letter}>
              <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                E{letter}
              </Avatar>
            </Tooltip>
          ))}
        </>
      </Card>
    </Col>
  );
};

export default RoundCard;
