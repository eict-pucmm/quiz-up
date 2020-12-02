/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import uniqBy from 'lodash/uniqBy';
import { Spin, message } from 'antd';
import { useMediaQuery } from 'react-responsive';

import QuestionsTable from '../../components/QuestionsTable';
import RoundController from '../../components/RoundController';
import AnswersModal from '../../components/AnswersModal';
import TeamsLeaderboard from '../../components/TeamsLeaderboard';
import EndGameModal from '../../components/EndGameModal';
import { getRoundById, updateRound } from '../../api/round';
import { useStateValue } from '../../state';
import { setGame } from '../../state/actions';

import './styles.css';

const Game = props => {
  const { idOfRound } = props.match.params;
  const { state, dispatch } = useStateValue();
  const { questions, roomId, teams, published } = state.game;
  const { questionIndex, finished } = state.game;
  const socket = useRef(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const isDesktopOrBigger = useMediaQuery({ minWidth: 1024 });
  // console.log('WHATEVER', { published });

  const HEADERS =
    questions.length > 0
      ? [
          questions[0].categorySelected,
          questions[5].categorySelected,
          questions[10].categorySelected,
          questions[15].categorySelected,
        ]
      : [];

  //TODO: does this go on a useMemo?
  const FIRST_PLACE_IN_POINTS =
    teams.length > 0 &&
    Math.max.apply(
      Math,
      teams.map(({ total }) => total)
    );

  useEffect(() => {
    const getRoundInfo = async () => {
      const { data } = await getRoundById(idOfRound);
      dispatch(
        setGame({
          roomId: data.roomId,
          title: data.name,
          teams: data.participants,
          questions: data.questions,
          finished: data.finished,
        })
      );
      setLoading(false);
    };

    if (loading) getRoundInfo();
  }, [idOfRound, dispatch, loading]);

  //connect-disconect to socket
  useEffect(() => {
    socket.current = io(process.env.REACT_APP_QU_BASE_API);
    // socket.current = io(process.env.REACT_APP_QU_LOCAL_API);
    return () => {
      socket.current.disconnect();
    };
  }, []);

  //when roomId is fetched -> join it
  useEffect(() => {
    const QUEUE = isDesktopOrBigger ? 'desktop' : 'mobile';
    socket.current.emit('joinRoom', { teamName: `ADMIN-${QUEUE}`, roomId });
    return () => {
      socket.current.emit('leaveRoom', { roomId });
    };
  }, [roomId, isDesktopOrBigger]);

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
      const QUEUE = isDesktopOrBigger ? 'indexDesktop' : 'indexMobile';

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
  }, [dispatch, isDesktopOrBigger, visible]);

  useEffect(() => {
    function subscribeToTimer() {
      // console.log('REEE subscribed to timer');
      socket.current.on('timer', ({ timer, open }) => {
        // questions[questionIndex].timer = timer;
        dispatch(setGame({ published: open, timer }));
        if (!open) {
          dispatch(setGame({ published: false, timer: 15 }));

          if (isDesktopOrBigger) {
            return;
          }
          //deactivate team buttons
          socket.current.emit('question', false);
          //stop countdown
          socket.current.emit(`countdown-${roomId}`, { roomId, status: false });
        }
      });
    }

    if (roomId) subscribeToTimer();
    // eslint-disable-next-line
  }, [dispatch, roomId, isDesktopOrBigger]);

  useEffect(() => {
    const subscribeToFinishedRound = () => {
      socket.current.on('roundFinished', status => {
        dispatch(setGame({ finished: status }));
      });
    };

    if (roomId) subscribeToFinishedRound();
    // eslint-disable-next-line
  }, [dispatch, roomId, isDesktopOrBigger]);

  useEffect(() => {
    const subscribeToVamonos = () => {
      socket.current.on('vamonos', status => {
        //if true apaga y vamonos
        if (status) window.location.replace('/');
      });
    };

    if (roomId) subscribeToVamonos();
    // eslint-disable-next-line
  }, [dispatch, roomId, isDesktopOrBigger]);

  useEffect(() => {
    const subscribeToTeamsInfo = () => {
      console.log('subscribing to info');
      socket.current.on('teamsInfo', teams => {
        // console.log('REEEE', { teams });
        dispatch(setGame({ teams }));
      });
    };

    if (visible) subscribeToTeamsInfo();
  }, [visible, dispatch]);

  useEffect(() => {
    const subscribeToRightOrWrongAnswer = () => {
      // console.log('subscribing to answers');
      socket.current.on('answersDesktop', ({ team, points, action }) => {
        const o =
          action === 'answered'
            ? { type: 'success', msg: 'ganado' }
            : { type: 'error', msg: 'perdido' };

        return message[o.type](
          `El equipo ${team} ha ${o.msg} ${points} puntos`
        );
      });
    };

    if (visible) subscribeToRightOrWrongAnswer();
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
        questions[questionIndex].answers.push(answer);
        //uniqBy returns an array with unique values
        questions[questionIndex].answers = uniqBy(
          questions[questionIndex].answers,
          a => a.team
        );
        questions[questionIndex].answers.sort(
          (a1, a2) => a1.timeToAnswer - a2.timeToAnswer
        );
        dispatch(setGame({ questions }));
      });
    };

    if (visible) getAnswers();
  }, [questions, dispatch, visible, questionIndex]);

  const showModal = selectedQuestion => {
    //Desktop/TV cant control state
    if (isDesktopOrBigger) {
      return;
    }
    setVisible(true);
    dispatch(setGame({ questionIndex: selectedQuestion }));

    socket.current.emit('subscribeToIndexDesktop', {
      index: selectedQuestion,
      open: true,
    });
  };

  const openQuestion = useCallback(
    e => {
      e.preventDefault();
      //Desktop/TV cant control state
      if (isDesktopOrBigger) {
        return;
      }
      socket.current.emit(`countdown-${roomId}`, { roomId, status: true });
      socket.current.emit('question', true);
      dispatch(setGame({ published: true, questions }));
    },
    [dispatch, roomId, questions, isDesktopOrBigger]
  );

  const handleCancel = useCallback(() => {
    //Desktop/TV cant control state
    if (isDesktopOrBigger) {
      return;
    }

    setVisible(false);
    dispatch(setGame({ published: false, timer: 15 }));

    socket.current.emit('question', false);
    socket.current.emit(`countdown-${roomId}`, { roomId, status: false });
    socket.current.emit('subscribeToIndexDesktop', {
      index: -1,
      open: false,
    });
  }, [dispatch, isDesktopOrBigger, roomId]);

  //correctAnswer can be either true or false
  const handleAnswersActions = async (
    team,
    questionId,
    correctAnswer = true
  ) => {
    const index =
      teams.length > 0 && teams.findIndex(i => i.team && i.team.name === team);

    if (index !== -1 && teams.length > 0 && !isDesktopOrBigger) {
      const ACTION = correctAnswer ? 'answered' : 'failed';

      if (ACTION === 'answered') {
        socket.current.emit(`countdown-${roomId}`, { roomId, status: false });
      }

      //get the participant in the answers array
      const answerIndex = questions[questionIndex].answers.findIndex(
        i => i.team === team
      );
      //add the `pressed` attribute
      questions[questionIndex].answers[answerIndex] = {
        ...questions[questionIndex].answers[answerIndex],
        pressed: true,
      };

      //push to the right action
      teams[index][ACTION].push(questionId);

      dispatch(setGame({ teams, questions }));
    }

    const { error } = await updateRound(idOfRound, {
      participants: teams.filter(team => typeof team === 'object'),
      questions,
    });

    return error;
  };

  const handleRightAnswer = async (e, team, questionId) => {
    e.preventDefault();
    //Desktop/TV cant control state
    if (isDesktopOrBigger) {
      return;
    }

    const error = await handleAnswersActions(team, questionId, true);

    // console.log('handleRightAnwers', { error });

    socket.current.emit('subscribeToAnswersDesktop', {
      team,
      points: questions[questionIndex].question.points,
      action: 'answered',
    });

    //close modal and reset part of the state
    handleCancel();
  };

  const handleWrongAnswer = async (e, team, questionId) => {
    e.preventDefault();
    //Desktop/TV cant control state
    if (isDesktopOrBigger) {
      return;
    }

    const error = await handleAnswersActions(team, questionId, false);
    // console.log('handleWRONGAnswer', { error });

    socket.current.emit('subscribeToAnswersDesktop', {
      team,
      points: questions[questionIndex].question.points,
      action: 'failed',
    });
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
            <span>PIN: {roomId}</span>
          </div>
          <div className="game-content">
            {isDesktopOrBigger && (
              <TeamsLeaderboard
                teams={teams}
                firstPlace={FIRST_PLACE_IN_POINTS}
              />
            )}
            {isDesktopOrBigger ? (
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
                idOfRound={idOfRound}
              />
            )}

            {finished && (
              <EndGameModal
                firstPlace={FIRST_PLACE_IN_POINTS}
                socket={socket.current}
                teams={teams}
                title={state.game.title}
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
