import React, { useState, Fragment, useEffect } from 'react';
import { Card, Spin } from 'antd';
import { useMediaQuery } from 'react-responsive';

import QUESTIONS from '../../constants/questions';
import QuestionsTable from '../../components/QuestionsTable';
import RoundController from '../../components/RoundController';
import AnswersModal from '../../components/AnswersModal';
import {
  disconnectSocket,
  initiateSocket,
  sendQuestionToServer,
  subscribeToAnswers,
  subscribeToTeams,
} from '../../helpers/socket';

import './styles.css';

const roomId = '668435';

const Game = () => {
  const [questions, setQuestions] = useState(QUESTIONS);
  const [visible, setVisible] = useState(false);
  const [published, setPublished] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [answers, setAnswers] = useState([]);
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
    if (roomId) initiateSocket(roomId);
    return () => disconnectSocket();
  }, []);

  useEffect(() => {
    subscribeToTeams((err, team) => {
      if (err) return;

      if (!teams.includes(team)) {
        setTeams(prevTeams => uniqueArray([...prevTeams, team]));
      }
    });
  }, [teams]);

  // useEffect(() => {
  //   socket.on('index', index =>{
  //     questions[index].disabled = true;
  //     showModal(index);
  //   });
  //   console.log('klk')

  //   return () => showModal(-1)
  // }, [questions]);
  // console.log('klk afuera')

  useEffect(() => {
    subscribeToAnswers((err, answer) => {
      if (err) return;
      setAnswers(prev => uniqueArray([...prev, answer]));
    });
  }, [answers]);

  const showModal = selectedQuestion => {
    setVisible(true);
    setQuestionIndex(selectedQuestion);
  };

  const openQuestion = e => {
    e.preventDefault();
    sendQuestionToServer({
      name: questions[questionIndex].name,
      index: questionIndex,
    });
    questions[questionIndex].disabled = true;
    setPublished(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setPublished(false);
    setAnswers([]);
  };

  return (
    <div className="game-container">
      <div className="header-game">
        <div className="game-title-placeholder"></div>
        <h1 className="round-title">Ronda X</h1>
        <span>id: 668435</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {isDesktopOrLaptop && (
          <div className="teams-container">
            {teams.map(team => (
              <div className="team-name" key={team}>
                <p>{team}</p>
                <p>0</p>
              </div>
            ))}
          </div>
        )}
        {loading ? (
          <Spin tip="Cargando..." size="large">
            <Card className="question-loading" />
          </Spin>
        ) : (
          <>
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
                published={published}
                openQuestion={openQuestion}
                visible={visible}
                handleCancel={handleCancel}
                questions={questions}
                questionIndex={questionIndex}
                answers={answers}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
