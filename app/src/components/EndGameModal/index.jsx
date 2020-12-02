import React from 'react';
import { Modal, Button } from 'antd';
import { useMediaQuery } from 'react-responsive';

import './styles.css';

const EndGameModal = props => {
  const { teams, firstPlace, title, socket } = props;
  const isDesktopOrBigger = useMediaQuery({ minWidth: 1024 });

  return (
    <Modal
      visible
      closable={false}
      maskClosable={false}
      width={'80%'}
      title={
        <span className="end-game-modal-title">{`${title} ha finalizado`}</span>
      }
      footer={[
        !isDesktopOrBigger && (
          <Button
            block
            key="back"
            type="primary"
            onClick={() => {
              socket.emit('apaga', { status: true });
            }}>
            Finalizar
          </Button>
        ),
      ]}>
      {teams
        .filter(({ total }) => total === firstPlace)
        .map(({ team, total }) => (
          <div key={team._id} className="end-game-container">
            <p className="end-game-title">¡Felicidades {team.name}!</p>
            <p className="end-game-subtitle">
              Ha quedado en primer lugar con un total de {total} puntos
            </p>
          </div>
        ))}
    </Modal>
  );
};

export default EndGameModal;
