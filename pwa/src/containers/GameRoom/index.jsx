import React, { useEffect, useState } from 'react';
import Title from 'antd/lib/typography/Title';
import { Button } from 'antd';

import { useStateValue } from '../../state/';
import {
  answerQuestion,
  disconnectSocket,
  initiateSocket,
  subscribeToQuestion,
} from '../../helpers/socket';

import './styles.css';

const GameRoom = props => {
  const { roomId } = props.match.params; // Gets roomId from URL
  const [question, setQuestion] = useState();
  const [startTime, setStartTime] = useState();
  const {
    dispatch,
    state: {
      userInfo: { teamName },
    },
  } = useStateValue();

  const disabled = question === false || question === undefined;

  useEffect(() => {
    if (roomId && teamName) initiateSocket(roomId, teamName);

    subscribeToQuestion((err, q) => {
      if (err) return;
      setQuestion(q);
      setStartTime(performance.now());
    });

    return () => disconnectSocket();
  }, [dispatch, roomId, teamName]);

  const handleClick = () => {
    setQuestion(undefined);
    const endTime = performance.now();
    const timeDiff = endTime - startTime;

    answerQuestion(
      { teamName, timeToAnswer: Math.round(timeDiff) / 1000 },
      roomId
    );
  };

  return (
    <div className="container-game-room">
      <Title level={1}>{teamName}</Title>
      <Button
        className={`btn-answer ${disabled && 'btn-disabled'}`}
        disabled={disabled}
        onClick={handleClick}
        shape={'circle'}
        size={'size'}
        type={'danger'}>
        Responder
      </Button>
      <Title level={1}>Puntaje: {' 800'}</Title>
    </div>
  );
};

export default GameRoom;
