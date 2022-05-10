import React from 'react';
import { Modal, Button, Spin } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { useStateValue } from '../../state';

import './styles.css';

const AnswersModal = props => {
  const { state } = useStateValue();
  const { published, questions, questionIndex, timer } = state.game;
  const { openQuestion, handleCancel, visible, waiting } = props;
  const isDesktopOrBigger = useMediaQuery({ minWidth: 1024 });
  const ANSWERS = questions[questionIndex].answers;

  const MODAL_BTNS = [
    !published && ANSWERS.length === 0 && (
      <Button
        key="submit"
        onClick={openQuestion}
        size={isDesktopOrBigger ? 'middle' : 'large'}
        type="primary"
        value={questions[questionIndex].question.name}>
        Abrir Pregunta
      </Button>
    ),
    <Button
      danger
      key="cancel"
      onClick={handleCancel}
      size={isDesktopOrBigger ? 'middle' : 'large'}>
      Cerrar
    </Button>,
  ];

  const RENDERER = () => {
    questions[questionIndex].timer = timer !== 15 ? timer : undefined;

    if (questions[questionIndex].timer <= 0) {
      return (
        <span
          className="question-countdown"
          style={{ fontSize: !isDesktopOrBigger ? '24px' : '65px' }}>
          ¡Se acabó el tiempo!
        </span>
      );
    }

    return <span className="question-countdown">{timer}</span>;
  };

  const questionName = questions[questionIndex].question.name;
  const questionImageSrc = questions[questionIndex].question.image ?? null;
  return (
    <Modal
      centered
      bodyStyle={{ minHeight: 460 }}
      footer={!isDesktopOrBigger && MODAL_BTNS}
      maskClosable={!timer}
      closable={!isDesktopOrBigger}
      onCancel={handleCancel}
      width={'90%'}
      visible={visible}>
      <div className="question-wrapper">
        {(published || isDesktopOrBigger) && RENDERER()}
        <p className="question-content">{questionName}</p>
        {/* TODO: make image responsive and 
        confirm if we want this to render on mobile */}
        {ANSWERS.length === 0 && questionImageSrc ? (
          <div>
            <img src={questionImageSrc} alt={questionName} />
          </div>
        ) : null}
        <div className="answers-table">
          {ANSWERS.length > 0 && (
            <div className="answers-header">
              <div className="answers-cell">Equipos</div>
              <div className="answers-cell">Tiempo</div>
              {!isDesktopOrBigger && (
                <div className="answers-cell">Acciones</div>
              )}
            </div>
          )}
          {ANSWERS.length > 0 &&
            ANSWERS.map(({ team, timeToAnswer, pressed }) => (
              <div key={team} className="answers-body">
                <div className="answers-cell">{team}</div>
                <div className="answers-cell">{timeToAnswer}</div>
                {!isDesktopOrBigger && (
                  <div className="answers-cell--actions">
                    {waiting ? (
                      <Spin />
                    ) : (
                      !pressed && (
                        <>
                          <CheckCircleTwoTone
                            onClick={e =>
                              props.handleRightAnswer(
                                e,
                                team,
                                questions[questionIndex].question._id
                              )
                            }
                            twoToneColor="#52c41a"
                          />
                          <CloseCircleTwoTone
                            onClick={e =>
                              props.handleWrongAnswer(
                                e,
                                team,
                                questions[questionIndex].question._id
                              )
                            }
                            twoToneColor="#F51D23"
                          />
                        </>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};

export default AnswersModal;
