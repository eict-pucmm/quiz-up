import React, { useEffect, useState } from 'react';
import { Card, Tag, Avatar, Tooltip, Divider } from 'antd';
import { CrownOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

import { getRoundById } from '../../api/round';

import './styles.css';

const RoundCard = ({ round, showModal, index }) => {
  const { _id, name, finished } = round;
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

  const { categories, participants = [] } = fetchedRound;

  //TODO: does this go on a useMemo?
  const FIRST_PLACE_IN_POINTS =
    participants.length > 0 &&
    Math.max.apply(
      Math,
      participants.map(({ total }) => total)
    );

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
      {finished && <p className="finished-round-banner">FINALIZADO</p>}
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
      {finished && (
        <>
          <Divider />
          <p style={{ fontWeight: 'bold' }}>
            <CrownOutlined /> Ganador:
          </p>
          {participants
            .filter(({ total }) => total === FIRST_PLACE_IN_POINTS)
            .map(({ team }) => (
              <div key={team._id}>
                <Tag color="warning">{team.name}</Tag>
              </div>
            ))}
        </>
      )}
    </Card>
  );
};

export default RoundCard;
