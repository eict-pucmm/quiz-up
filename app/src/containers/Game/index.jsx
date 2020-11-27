/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Spin, message } from 'antd';
import { useMediaQuery } from 'react-responsive';
import { LoadingOutlined } from '@ant-design/icons';

import QuestionsTable from '../../components/QuestionsTable';
import RoundController from '../../components/RoundController';
import AnswersModal from '../../components/AnswersModal';
import { getRoundById, updateRound } from '../../api/round';
import { useStateValue } from '../../state';
import { setGame } from '../../state/actions';

import './styles.css';

const Game = props => {
  const { idOfRound } = props.match.params;
  const { state, dispatch } = useStateValue();
  const { questions, roomId, teams, published } = state.game;
  const { questionIndex } = state.game;
  const socket = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1024 });
  // console.log('WHATEVER', { published });
  // const uniqueArray = array => Array.from(new Set(array));
  const HEADERS =
    questions.length > 0
      ? [
          questions[0].categorySelected,
          questions[5].categorySelected,
          questions[10].categorySelected,
          questions[15].categorySelected,
        ]
      : [];

  useEffect(() => {
    const getRoundInfo = async () => {
      const { data } = await getRoundById(idOfRound);
      dispatch(
        setGame({
          roomId: data.roomId,
          title: data.name,
          teams: data.participants,
          questions: data.questions,
        })
      );
      setLoading(false);
    };

    if (loading) getRoundInfo();
  }, [idOfRound, dispatch, loading]);

  //connect-disconect to socket
  useEffect(() => {
    socket.current = io('https://quizup-api-pucmm.site/');
    // socket.current = io('http://localhost:8080/');
    return () => {
      socket.current.disconnect();
    };
  }, []);

  //when roomId is fetched -> join it
  useEffect(() => {
    const QUEUE = isDesktopOrLaptop ? 'desktop' : 'mobile';
    socket.current.emit('joinRoom', { teamName: `ADMIN-${QUEUE}`, roomId });
    return () => {
      socket.current.emit('leaveRoom', { roomId });
    };
  }, [roomId, isDesktopOrLaptop]);

  useEffect(() => {
    const welcomeTeams = () => {
      socket.current.on('welcomeTeam', team => {
        const index =
          teams.length > 0 &&
          teams.findIndex(i => i.team && i.team.name === team && !i.connected);

        if (index !== -1) {
          if (teams.length > 0) {
            dispatch(
              setGame({ teams: [...teams, (teams[index].connected = true)] })
            );
            const { error } = updateRound(idOfRound, {
              ...state.game,
              participants: teams,
            });
            //TODO" do something with this
            // console.log('ERRR welcome teams', { error });
            return message.success(`Bienvenido ${team}`);
          }
        }
        return;
      });
    };

    const allTeamsConnected = () =>
      teams.map(({ connected }) => connected).every(v => v === true);
    // console.log('useEffect ~ allTeamsConnected', allTeamsConnected());
    if (!allTeamsConnected()) welcomeTeams();
  }, [teams, dispatch, idOfRound, state.game]);

  //subscribe to sockets for timer and the index of the selected question
  // TODO: check how this is affecting multiple re-renders
  useEffect(() => {
    const subscribeToIndexChange = () => {
      const QUEUE = isDesktopOrLaptop ? 'indexDesktop' : 'indexMobile';

      socket.current.on(QUEUE, ({ index, open }) => {
        // console.log('🚀 { index, open }', { index, open });
        if (index !== -1) dispatch(setGame({ questionIndex: index }));

        if (!visible) {
          setVisible(open);
          dispatch(setGame({ timer: 15 }));
        }
      });
    };

    if (!visible) subscribeToIndexChange();
  }, [dispatch, isDesktopOrLaptop, visible]);

  useEffect(() => {
    function subscribeToTimer() {
      // console.log('REEE subscribed to timer');
      socket.current.on('timer', ({ timer, open }) => {
        // questions[questionIndex].timer = timer;
        dispatch(setGame({ published: open, timer }));
        if (timer === 0 || !open) {
          dispatch(setGame({ published: false, timer: 15 }));
          if (!isDesktopOrLaptop) {
            //deactivate team buttons
            socket.current.emit('question', false);
            //stop countdown
            socket.current.emit('countdown', { roomId, status: false });
          }
        }
      });
    }

    if (roomId) subscribeToTimer();
    // eslint-disable-next-line
  }, [dispatch, roomId, isDesktopOrLaptop]);

  useEffect(() => {
    const subscribeToTeamsInfo = () => {
      // console.log('subscribing to info');
      socket.current.on('teamsInfo', teams => {
        // console.log('REEEE', { teams });
        dispatch(setGame({ teams }));
      });
    };

    if (visible) subscribeToTeamsInfo();
  }, [visible, dispatch]);

  // disable the question after its published
  useEffect(() => {
    if (questionIndex !== -1 && published) {
      questions[questionIndex].disabled = true;
      const { error } = updateRound(idOfRound, { questions });
      // console.log('ERROR ON DISABLE QUESTION', { error });
    }
  }, [questionIndex, published, questions, idOfRound]);

  useEffect(() => {
    const getAnswers = () => {
      socket.current.on('answer', answer => {
        // console.log('getAnswers ~ answer', answer);
        //TODO: should we remove repeated values from answers array?
        questions[questionIndex].answers.push(answer);
        dispatch(setGame({ questions }));
      });
    };

    if (visible) getAnswers();
  }, [questions, dispatch, visible, questionIndex]);

  const showModal = selectedQuestion => {
    setVisible(true);
    dispatch(setGame({ questionIndex: selectedQuestion }));

    const QUEUE = isDesktopOrLaptop
      ? 'subscribeToIndexMobile'
      : 'subscribeToIndexDesktop';

    if (!isDesktopOrLaptop) {
      socket.current.emit(QUEUE, {
        index: selectedQuestion,
        open: true,
      });
    }
  };

  const openQuestion = useCallback(
    e => {
      e.preventDefault();
      if (!isDesktopOrLaptop) {
        socket.current.emit('countdown', { roomId, status: true });
        socket.current.emit('question', true);
      }
      dispatch(setGame({ published: true, questions }));
    },
    [dispatch, roomId, questions, isDesktopOrLaptop]
  );

  const handleCancel = useCallback(() => {
    setVisible(false);
    dispatch(setGame({ published: false, timer: 15 }));
    const QUEUE = isDesktopOrLaptop
      ? 'subscribeToIndexMobile'
      : 'subscribeToIndexDesktop';

    if (!isDesktopOrLaptop) {
      socket.current.emit('question', false);
      socket.current.emit('countdown', { roomId, status: false });
      socket.current.emit(QUEUE, {
        index: -1,
        open: false,
      });
    }
  }, [dispatch, isDesktopOrLaptop, roomId]);

  const handleRightAnswer = (e, team, questionId) => {
    e.preventDefault();

    const index =
      teams.length > 0 && teams.findIndex(i => i.team && i.team.name === team);

    if (index !== -1 && teams.length > 0 && !isDesktopOrLaptop) {
      socket.current.emit('countdown', { roomId, status: false });
      teams[index].answered.push(questionId);
      dispatch(setGame({ teams }));
    }

    const { error } = updateRound(idOfRound, {
      participants: teams.filter(team => typeof team === 'object'),
    });
    // console.log('handleRightAnwers', { error });

    //close modal and reset part of the state
    handleCancel();
  };

  const handleWrongAnswer = (e, team, questionId) => {
    e.preventDefault();

    const index =
      teams.length > 0 && teams.findIndex(i => i.team && i.team.name === team);

    if (index !== -1 && teams.length > 0) {
      teams[index].failed.push(questionId);
      dispatch(setGame({ teams }));
    }

    const { error } = updateRound(idOfRound, {
      participants: teams.filter(team => typeof team === 'object'),
    });
    // console.log('handleWRONGAnswer', { error });
  };

  return (
    <div className="game-container">
      {loading ? (
        <Spin tip="Cargando..." size="large" className="round-loading" />
      ) : (
        <>
          <div className="header-game">
            <div className="game-title-placeholder"></div>
            <h1 className="round-title">{state.game.title}</h1>
            <span>id: {roomId}</span>
          </div>
          <div className="game-content">
            {isDesktopOrLaptop && (
              <div className="teams-container">
                {teams.map(
                  ({ team, connected, total }) =>
                    team && (
                      <div className="team-name" key={team._id}>
                        <p>{team.name}</p>
                        {connected ? (
                          <p>{total}</p>
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

            {questions.length > 0 && visible ? (
              <AnswersModal
                handleCancel={handleCancel}
                handleRightAnswer={handleRightAnswer}
                handleWrongAnswer={handleWrongAnswer}
                openQuestion={openQuestion}
                visible
              />
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
