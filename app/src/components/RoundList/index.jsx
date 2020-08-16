import React, { useState, useEffect } from 'react';
import { Card, Modal, Row, Col, Empty, Button, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { getRoundsByEvent, saveRound } from '../../api/round';
import { setRounds, clearRoundFields } from '../../state/actions';
import { useStateValue } from '../../state';
import RoundModal from '../RoundModal';
import RoundCard from '../RoundCard';

import './styles.css';

const RoundList = props => {
  const { state, dispatch } = useStateValue();
  const [loading, setLoading] = useState(true);
  const [addRound, setAddRound] = useState(false);
  const { selectedRound, saving, openInfoModal, data } = state.rounds;

  useEffect(() => {
    const get = async () => {
      const { data: rounds } = await getRoundsByEvent(props.gameEvent._id);

      //TO-DO: fix issue with the structure of the rounds and events
      dispatch(setRounds({ data: rounds || [] }));
      setLoading(false);
    };

    if (!saving) get();
  }, [dispatch, saving, props.gameEvent._id]);

  const showModal = roundIndex =>
    dispatch(setRounds({ openInfoModal: true, selectedRound: roundIndex }));

  const showAddRound = () => setAddRound(true);
  const closeAddRound = () => setAddRound(false);

  const handleOk = () => dispatch(setRounds({ openInfoModal: false }));

  const handleCancel = () => dispatch(setRounds({ openInfoModal: false }));

  const onSubmit = async () => {
    dispatch(setRounds({ saving: true }));

    const { error } = await saveRound({
      round: state.roundToAdd,
      event: props.gameEvent._id,
    });

    if (error) {
      dispatch(setRounds({ saving: false }));
      return notification['error']({
        message: error.data.message || error.data,
      });
    }

    setTimeout(() => {
      notification['success']({
        message: 'El evento ha sido creada con exito',
      });

      dispatch(clearRoundFields());
      dispatch(setRounds({ saving: false }));
      setAddRound(false);
    }, 600);
  };

  if (loading) return <Card loading={loading} />;

  console.log('data', data);
  return (
    <>
      {data.length === 0 ? (
        <>
          <Empty description="Este evento NO tiene rondas">
            <Button onClick={showAddRound}>Agregar Ronda</Button>
          </Empty>
        </>
      ) : (
        <div>
          <Row gutter={[40, 16]}>
            <Col className="gutter-row" span={8}>
              <Card hoverable className="add-round-card" onClick={showAddRound}>
                <PlusOutlined />
                Agregar Ronda
              </Card>
            </Col>
            {data.map((round, index) => {
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
          </Row>
          <Modal
            cancelText="Cancelar"
            centered
            onCancel={handleCancel}
            onOk={handleOk}
            title={data[selectedRound].name}
            visible={openInfoModal}
          >
            <p>Some contents...</p>
            <Link
              className="start-round-btn"
              to={`/event/round/${data[selectedRound]._id}`}
            >
              Empezar Ronda
            </Link>
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
