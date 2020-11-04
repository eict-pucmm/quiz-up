import React, { useState, useEffect } from 'react';
import { Card, Modal, Empty, Button, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { getRoundsByEvent, saveRound } from '../../api/round';
import { setRoundAttributes, clearRoundFields } from '../../state/actions';
import { useStateValue } from '../../state';
import RoundModal from '../RoundModal';
import RoundCard from '../RoundCard';

import './styles.css';

const RoundList = props => {
  const { state, dispatch } = useStateValue();
  const [loading, setLoading] = useState(true);
  const [addRound, setAddRound] = useState(false);
  const [localRounds, setLocalRounds] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const { selectedRound, saving } = state.round;

  useEffect(() => {
    const get = async () => {
      const { data: rounds } = await getRoundsByEvent(props.gameEvent._id);

      setLocalRounds(rounds);
      setLoading(false);
    };

    if (!saving) get();
  }, [dispatch, saving, props.gameEvent._id]);

  const showModal = roundIndex => {
    setShowInfo(true);
    dispatch(setRoundAttributes({ selectedRound: roundIndex }));
  };

  const showAddRound = () => setAddRound(true);

  const closeAddRound = () => setAddRound(false);

  const handleOk = () => setShowInfo(false);

  const handleCancel = () => setShowInfo(false);

  const onSubmit = async () => {
    const { name, categories, participants } = state.roundToAdd;
    if (
      !name ||
      name.length < 3 ||
      categories.length !== 4 ||
      participants.length !== 4
    ) {
      return notification['error']({
        message: 'Por favor revise los datos de la ronda.',
      });
    }
    dispatch(setRoundAttributes({ saving: true }));

    const { error } = await saveRound({
      round: state.roundToAdd,
      event: props.gameEvent._id,
    });

    if (error) {
      dispatch(setRoundAttributes({ saving: false }));
      return notification['error']({
        message:
          '¡Oh no! Ha ocurrido un error con el servidor. Favor de comunicarse con su administrador.',
      });
    }

    notification['success']({
      message: 'El evento ha sido creada con exito',
    });

    dispatch(clearRoundFields());
    dispatch(setRoundAttributes({ saving: false }));
    setAddRound(false);
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
          <Modal
            centered
            cancelText="Cancelar"
            onCancel={handleCancel}
            onOk={handleOk}
            title={localRounds[selectedRound].name}
            visible={showInfo}>
            <p>Some contents...</p>
            {!state.viewOldEvents && (
              <Link
                className="start-round-btn"
                to={`/event/round/${localRounds[selectedRound]._id}`}>
                Empezar Ronda
              </Link>
            )}
          </Modal>
        </div>
      )}

      <RoundModal
        {...props}
        onCancel={closeAddRound}
        visible={addRound}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default RoundList;
