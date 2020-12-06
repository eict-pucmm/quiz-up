import React, { useEffect } from 'react';
import { Modal, Button } from 'antd';
import { useMediaQuery } from 'react-responsive';

import './styles.css';

const EndGameModal = props => {
  const isDesktopOrBigger = useMediaQuery({ minWidth: 1024 });
  const {
    teams,
    firstPlace,
    title,
    socket,
    openAnnouncement,
    finished,
  } = props;

  useEffect(() => {
    if (isDesktopOrBigger) {
      return;
    }
    if (openAnnouncement) {
      socket.emit('askToJoinBonusQuestion', { status: true });
    }
  }, [isDesktopOrBigger, openAnnouncement, socket]);

  return (
    <Modal
      visible
      closable={false}
      maskClosable={false}
      width={'80%'}
      title={
        <span className="end-game-modal-title">
          {openAnnouncement ? 'Pregunta Bono' : `${title} ha finalizado`}
        </span>
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
      {openAnnouncement && (
        <div className="end-game-container">
          <p>
            Ya casi terminamos. Ahora los equipos con puntaje positivo tienen la
            oportunidad de apostar para ganar (o perder) más puntos al responder
            una pregunta final. ¿Se atreven a enfrentar el reto?
          </p>
        </div>
      )}

      {finished &&
        teams
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
