import React, { useEffect, useState } from 'react';
import Title from 'antd/lib/typography/Title';
import { Button, Input, Form, message } from 'antd';

import { useStateValue } from '../../state/';
import { setUserInfo } from '../../state/actions';
import { getTeamByRoomIdAndTeamName } from '../../api/teams';
import {
  answerQuestion,
  disconnectSocket,
  initiateSocket,
  subscribeToQuestion,
  subscribeToTeamInfo,
  subscribeToVamonos,
  subscribeToRightOrWrongAnswer,
} from '../../helpers/socket';

import './styles.css';

import FinalQuestion from '../../components/FinalQuestion';

const { TextArea } = Input;

const GameRoom = props => {
  // console.log('WHATEVER');
  const { roomId } = props.match.params; // Gets roomId from URL
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState();
  const [points, setPoints] = useState(0);
  const [startTime, setStartTime] = useState();
  const [finalQuestion, setFinalQuestion] = useState(true);
  const [participating, setParticipating] = useState(false);
  const [textAvailable, setTextAvailable] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [pointsToUse, setPointsToUse] = useState(0);
  const [form] = Form.useForm();

  const {
    dispatch,
    state: {
      userInfo: { teamName },
    },
  } = useStateValue();

  const disabled = question === false || question === undefined;

  useEffect(() => {
    const getTeamInfo = async () => {
      const { data } = await getTeamByRoomIdAndTeamName(roomId, teamName);
      setPoints(data.total);
      setLoading(true);
    };

    if (loading && teamName) getTeamInfo();
  }, [loading, teamName, roomId]);

  useEffect(() => {
    if (!teamName) {
      const team = localStorage.getItem('TEAM');
      dispatch(setUserInfo({ teamName: team }));
    }

    if (roomId && teamName) {
      initiateSocket(roomId, teamName);
      localStorage.setItem('TEAM', teamName);
    }

    subscribeToQuestion((err, q) => {
      if (err) return;
      setQuestion(q);
      setStartTime(performance.now());
    });

    subscribeToTeamInfo((err, teams) => {
      if (err) return;
      const info = teams.find(({ team }) => team.name === teamName);
      setPoints(info.total);
    });

    if (roomId) {
      subscribeToVamonos((err, status) => {
        if (err) return;
        if (status) window.location.replace('/');
      });
    }

    subscribeToRightOrWrongAnswer((err, { team, action, points }) => {
      if (err) return;
      const o =
        action === 'answered'
          ? { type: 'success', msg: 'ganado' }
          : { type: 'error', msg: 'perdido' };

      return message[o.type](`El equipo ${team} ha ${o.msg} ${points} puntos`);
    });

    return () => {
      disconnectSocket();
    };
  }, [dispatch, roomId, teamName]);

  const handleClick = () => {
    setQuestion(undefined);
    const endTime = performance.now();
    const timeDiff = endTime - startTime;

    answerQuestion(
      { team: teamName, timeToAnswer: Math.round(timeDiff) / 1000 },
      roomId
    );
  };

  const handleAccept = () => {
    setParticipating(true);
  };

  const handleDeny = () => {
    setFinalQuestion(false);
  };

  const handleFinal = () => {
    setFinalQuestion(false);
    setTextAvailable(true);
  };

  const handleNumberVal = e => {
    setPointsToUse(e.value);
  };

  return (
    <div className="container-game-room">
      <Title level={1}>{teamName}</Title>

      {!finalQuestion && !textAvailable && (
        <Button
          className={`btn-answer ${disabled && 'btn-disabled'}`}
          disabled={disabled}
          onClick={handleClick}
          shape={'circle'}
          size={'size'}
          type={'danger'}>
          Responder
        </Button>
      )}

      {finalQuestion && !textAvailable && (
        <FinalQuestion
          form={form}
          handleDeny={handleDeny}
          handleFinal={handleFinal}
          handleAccept={handleAccept}
          points={points}
          handleNumberVal={handleNumberVal}
          participating={participating}
        />
      )}

      {!finalQuestion && textAvailable && (
        <div>
          <Form form={form}>
            <Form.Item label="Nueva Pregunta:">
              <TextArea
                value={finalAnswer}
                onChange={e => setFinalAnswer(e.value)}
              />
            </Form.Item>
          </Form>
        </div>
      )}

      <Title level={1}>Puntaje: {points}</Title>
    </div>
  );
};

export default GameRoom;
