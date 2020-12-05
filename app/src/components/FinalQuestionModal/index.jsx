import React, { useCallback } from 'react';
import { Modal, Button } from 'antd';
import { useMediaQuery } from 'react-responsive';

import { useStateValue } from '../../state';
import { setGame } from '../../state/actions';

import './styles.css';

const FinalQuestionModal = props => {
  const { dispatch } = useStateValue();
  const { socket, roomId } = props;
  const isDesktopOrBigger = useMediaQuery({ minWidth: 1024 });

  const openQuestion = useCallback(
    e => {
      e.preventDefault();
      //Desktop/TV cant control state
      if (isDesktopOrBigger) {
        return;
      }

      socket.current.emit(`countdown-${roomId}`, {
        roomId,
        amount: 30,
        status: true,
      });
      //TODO: emit on a different stream for the final question
      //we dont want a button we want a text input
      socket.current.emit('question', true);
      dispatch(setGame({ published: true }));
    },
    [dispatch, roomId, isDesktopOrBigger, socket]
  );

  return (
    <Modal
      visible
      closable={!isDesktopOrBigger}
      maskClosable={!isDesktopOrBigger}
      width={'80%'}
      title={
        <span className="final-question-modal-title">{'¡Pregunta Final!'}</span>
      }
      footer={[
        !isDesktopOrBigger && (
          <Button block key="back" type="primary" onClick={openQuestion}>
            Abrir Pregunta
          </Button>
        ),
      ]}></Modal>
  );
};

export default FinalQuestionModal;
