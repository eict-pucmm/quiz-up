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

  const { categories, participants } = fetchedRound;

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
      <p>Categorías:</p>
      {categories &&
        categories.map(c => (
          <Tag color="blue" key={c}>
            {c}
          </Tag>
        ))}
      <Divider />
      <p>Equipos:</p>
      <Avatar.Group>
        {participants &&
          participants.map(({ team }) => (
            <Tooltip title={team.name} placement="top" key={team.name}>
              <Avatar
                size="large"
                style={{
                  color: '#FFFF',
                  background:
                    'linear-gradient( to bottom, #99e6ff, dodgerblue )',
                }}>
                {team.name[0]}
              </Avatar>
            </Tooltip>
          ))}
      </Avatar.Group>
    </Card>
  );
};

export default RoundCard;
