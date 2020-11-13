/* eslint-disable no-unused-vars */
import React, { useState, Fragment, useEffect, useRef } from 'react';
import { Spin } from 'antd';
import { useMediaQuery } from 'react-responsive';
import io from 'socket.io-client';

import QUESTIONS from '../../constants/questions';
import QuestionsTable from '../../components/QuestionsTable';
import RoundController from '../../components/RoundController';
import AnswersModal from '../../components/AnswersModal';
import {
  disconnectSocket,
  initiateSocket,
  sendQuestionIndex,
  sendQuestionToServer,
  subscribeToAnswers,
  subscribeToQuestionIndex,
  subscribeToTeams,
} from '../../helpers/socket';
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
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1024 });
  const allTeamsConnected = teams.every(({ connected }) => connected);
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
  }, [roomId]);

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
    return () => socket.current.emit('leaveRoom', { roomId });
  }, [roomId]);

  useEffect(() => {
    socket.current.on('welcomeTeam', team => {
      if (!teams.includes(team)) {
        setTeams(prevTeams => uniqueArray([...prevTeams, team]));
      }
      const index = teams.findIndex(
        item => item.team.name === team && !item.connected
      );
      if (index === -1) {
        return;
      }
      teams[index].connected = true;
      setTeams(prev => [...prev]);
    });
  }, [teams]);

  // useEffect(() => {
  //   subscribeToQuestionIndex((err, index) => {
  //     console.log({err, index, questionIndex})
  //     if (err) return;
  //     if (questionIndex === index) return;

  //     showModal(index)

  //   })
  //   // socket.on('index', index =>{
  //   // console.log("index", index)
  //   //   // questions[index].disabled = true;
  //   //   // showModal(index);
  //   // });
  // }, [questionIndex]);

  useEffect(() => {
    socket.current.on('answer', answers =>
      setAnswers(prev => uniqueArray([...prev, answers]))
    );
  }, [answers]);
  console.log('answers outside use effect', answers);

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
                {!allTeamsConnected && (
                  <p className="missing-teams">
                    Todos los equipos deben conectarse...
                  </p>
                )}
                {teams.map(
                  ({ team, connected }) =>
                    connected && (
                      <div className="team-name" key={team._id}>
                        <p>{team.name}</p>
                        <p>0</p>
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
                published={published}
                openQuestion={openQuestion}
                visible={visible}
                handleCancel={handleCancel}
                questions={questions}
                questionIndex={questionIndex}
                answers={answers}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
