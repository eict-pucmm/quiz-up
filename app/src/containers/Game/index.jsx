/* eslint-disable no-unused-vars */
import React, { useState, Fragment, useEffect, useRef } from 'react';
import { Card, Spin } from 'antd';
import { useMediaQuery } from 'react-responsive';
import io from 'socket.io-client';

import QUESTIONS from '../../constants/questions';
import QuestionsTable from '../../components/QuestionsTable';
import RoundController from '../../components/RoundController';
import AnswersModal from '../../components/AnswersModal';

import './styles.css';

const Game = () => {
  const socket = useRef(null);
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
    socket.current = io('https://quizup-api-pucmm.site/');

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.current.emit('joinRoom', { teamName: 'ADMIN', roomId: '668435' });
    return () => socket.current.emit('leaveRoom', { roomId: '668435' });
  }, []);

  useEffect(() => {
    socket.current.on('welcomeTeam', team => {
      if (!teams.includes(team)) {
        setTeams(prevTeams => uniqueArray([...prevTeams, team]));
      }
    });
  }, [teams]);

  useEffect(() => {
    socket.current.on('answer', answers =>
      setAnswers(prev => uniqueArray([...prev, answers]))
    );
  }, [answers]);

  const showModal = selectedQuestion => {
    setVisible(true);
    setQuestionIndex(selectedQuestion);
  };

  const openQuestion = e => {
    e.preventDefault();
    socket.current.emit('question', questions[questionIndex].name);
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
