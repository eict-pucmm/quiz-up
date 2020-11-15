import React, { useState, Fragment, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Spin, message } from 'antd';
import { useMediaQuery } from 'react-responsive';
import { LoadingOutlined } from '@ant-design/icons';

import QUESTIONS from '../../constants/questions';
import QuestionsTable from '../../components/QuestionsTable';
import RoundController from '../../components/RoundController';
import AnswersModal from '../../components/AnswersModal';
import { getRoundById } from '../../api/round';

import './styles.css';

const Game = props => {
  const { idOfRound } = props.match.params;
  const socket = useRef(null);
  const [questions, setQuestions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [published, setPublished] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [roomId, setRoomId] = useState();
  const [title, setTitle] = useState();
  const [timer, setTimer] = useState(15);
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1024 });
  const HEADERS =
    questions.length > 0
      ? [
          questions[0].category,
          questions[5].category,
          questions[10].category,
          questions[15].category,
        ]
      : [];

  const uniqueArray = array => Array.from(new Set(array));

  useEffect(() => {
    const getRoundInfo = async () => {
      const { data } = await getRoundById(idOfRound);
      setRoomId(data.roomId);
      setTitle(data.name);
      setTeams(data.participants);
      setLoading(false);
      //TODO: change to data.questions
      setQuestions(data.questions.length > 0 ? data.questions : QUESTIONS);
    };

    getRoundInfo();
  }, [idOfRound]);

  useEffect(() => {
    socket.current = io('https://quizup-api-pucmm.site/');

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.current.emit('joinRoom', { teamName: 'ADMIN', roomId });
    subscribeToTimer();
    subscribeToIndexChange();
    return () => socket.current.emit('leaveRoom', { roomId });
  }, [roomId]);

  const subscribeToTimer = () => {
    socket.current.on('timer', ({ timer, open }) => {
      setPublished(open);
      setTimer(timer);
      if (timer === 0) {
        socket.current.emit('question', false);
      }
    });
  };

  const subscribeToIndexChange = () => {
    socket.current.on('index', ({ index, open }) => {
      setVisible(open);
      if (index !== -1) setQuestionIndex(index);
      else {
        setTimer(15);
        setAnswers([]);
      }
    });
  };

  useEffect(() => {
    if (questionIndex !== -1 && published) {
      questions[questionIndex].disabled = true;
    }
  }, [questionIndex, published, questions]);

  useEffect(() => {
    socket.current.on('welcomeTeam', team => {
      const index =
        teams.length > 0 &&
        teams.findIndex(i => i.team && i.team.name === team && !i.connected);

      if (index !== -1) {
        if (teams.length > 0) {
          setTeams([...teams, (teams[index].connected = true)]);
          return message.success(`Bienvenido ${team}`);
        }
      }
      return;
    });
  }, [teams]);

  useEffect(() => {
    socket.current.on('answer', answers => {
      setAnswers(prev => uniqueArray([...prev, answers]));
    });
  }, [answers]);

  const showModal = selectedQuestion => {
    setVisible(true);
    setQuestionIndex(selectedQuestion);

    socket.current.emit('subscribeToIndex', {
      index: selectedQuestion,
      open: true,
    });
  };

  const openQuestion = e => {
    e.preventDefault();
    setPublished(true);
    setTimer(15);
    socket.current.emit('countdown', { roomId, status: true });
    socket.current.emit('question', true);
    questions[questionIndex].disabled = true;
  };

  const handleCancel = () => {
    socket.current.emit('countdown', { roomId, status: false });
    socket.current.emit('subscribeToIndex', { index: -1, open: false });
    setVisible(false);
    setPublished(false);
    setTimer(15);
    setAnswers([]);
  };

  const handleRightAnswer = (e, team) => {
    e.preventDefault();

    const index =
      teams.length > 0 && teams.findIndex(i => i.team && i.team.name === team);

    if (index !== -1 && teams.length > 0) {
      console.log({ question: questions[questionIndex], team: teams[index] });
    }

    //close modal and reset part of the state
    handleCancel();
  };

  // eslint-disable-next-line no-unused-vars
  const handleWrongAnswer = (e, team) => {
    /**TODO */
  };

  return (
    <div className="game-container">
      {loading ? (
        <Spin tip="Cargando..." size="large" className="round-loading" />
      ) : (
        <>
          <div className="header-game">
            <div className="game-title-placeholder"></div>
            <h1 className="round-title">{title}</h1>
            <span>id: {roomId}</span>
          </div>
          <div className="game-content">
            {isDesktopOrLaptop && (
              <div className="teams-container">
                {teams.map(
                  ({ team, connected }) =>
                    team && (
                      <div className="team-name" key={team._id}>
                        <p>{team.name}</p>
                        {connected ? (
                          <p>0</p>
                        ) : (
                          <div style={{ fontSize: '16px', color: 'red' }}>
                            <span style={{ marginRight: '2%' }}>
                              Esperando equipo
                            </span>
                            <LoadingOutlined />
                          </div>
                        )}
                      </div>
                    )
                )}
              </div>
            )}
            {isDesktopOrLaptop ? (
              <QuestionsTable
                questions={questions}
                showModal={showModal}
                headers={HEADERS}
              />
            ) : (
              <RoundController
                questions={questions}
                showModal={showModal}
                headers={HEADERS}
              />
            )}

            {questions.length === 0 ? (
              <Fragment />
            ) : (
              <AnswersModal
                answers={answers}
                handleCancel={handleCancel}
                handleRightAnswer={handleRightAnswer}
                handleWrongAnswer={handleWrongAnswer}
                openQuestion={openQuestion}
                published={published}
                questionIndex={questionIndex}
                questions={questions}
                timer={timer}
                visible={visible}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
