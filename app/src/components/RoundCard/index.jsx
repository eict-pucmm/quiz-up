import React, { useEffect, useState } from 'react';
import { Card, Tag, Avatar, Tooltip, Divider } from 'antd';
import { useMediaQuery } from 'react-responsive';

import { getRoundById } from '../../api/round';

const RoundCard = ({ round, showModal, index }) => {
  const { _id, name } = round;
  const [fetchedRound, setFetchedRound] = useState({});
  const [loading, setLoading] = useState(true);
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  useEffect(() => {
    const loadRound = async () => {
      const { data } = await getRoundById(_id);

      setFetchedRound(data || round);
      setLoading(false);
    };

    loadRound();
  }, [_id, round]);

  return (
    <Card
      hoverable
      className="cursor-pointer event-rounds-card"
      key={_id}
      loading={loading}
      onClick={() => showModal(index)}
      title={name}
      type="inner"
      extra={
        <span
          onClick={() => showModal(index)}
          className="more-info-label cursor-pointer">
          {isDesktop ? 'Ver más' : '...'}
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
  );
};

export default RoundCard;
