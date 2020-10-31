import React, { useState, useEffect } from 'react';
import { Card, Empty, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import RoundModal from '../RoundModal';
import RoundCard from '../RoundCard';
import { getRoundsByEvent } from '../../api/round';
import { useStateValue } from '../../state';
import { addRound, setRoundAttributes } from '../../state/actions';

import './styles.css';

const RoundList = props => {
  const { state, dispatch } = useStateValue();
  const [loading, setLoading] = useState(true);
  const [createRound, setCreateRound] = useState(false);
  const [localRounds, setLocalRounds] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const { saving } = state.round;

  useEffect(() => {
    const get = async () => {
      const { data: rounds } = await getRoundsByEvent(props.gameEvent._id);

      setLocalRounds(rounds || []);
      setLoading(false);
    };

    if (!saving) get();
  }, [dispatch, saving, props.gameEvent._id]);

  const showModal = roundIndex => {
    setShowInfo(true);
    const { name, participants, categories } = localRounds[roundIndex];
    const teams = participants.map(({ team }) => team);
    dispatch(setRoundAttributes({ roundId: localRounds[roundIndex]._id }));
    dispatch(addRound({ name, categories, teams }));
  };

  const showAddRound = () => {
    const openModal = showInfo ? setShowInfo : setCreateRound;
    openModal(true);
  };

  const closeAddRound = () => {
    const openModal = showInfo ? setShowInfo : setCreateRound;
    openModal(false);
  };

  if (loading) return <Card loading={loading} />;

  return (
    <>
      {localRounds.length === 0 ? (
        <>
          <Empty description="Este evento NO tiene rondas">
            <Button onClick={showAddRound}>Agregar Ronda</Button>
          </Empty>
        </>
      ) : (
        <div className="round-list-container">
          <Card
            hoverable
            className="add-round-card event-rounds-card"
            onClick={showAddRound}>
            <PlusOutlined />
            Agregar Ronda
          </Card>
          {localRounds.map((round, index) => {
            return (
              <RoundCard
                index={index}
                key={round._id}
                loading={loading}
                round={round}
                showModal={showModal}
              />
            );
          })}
        </div>
      )}

      <RoundModal
        {...props}
        showInfo={showInfo}
        onCancel={closeAddRound}
        visible={createRound || showInfo}
      />
    </>
  );
};

export default RoundList;
