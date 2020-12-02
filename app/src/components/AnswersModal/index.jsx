import React from 'react';
import { Modal, Button } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { useStateValue } from '../../state';

import './styles.css';

const AnswersModal = props => {
  const { state } = useStateValue();
  const { published, questions, questionIndex, timer } = state.game;
  const { openQuestion, handleCancel, visible } = props;
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1024 });
  const ANSWERS = questions[questionIndex].answers;

  const MODAL_BTNS = [
    !published && ANSWERS.length === 0 && (
      <Button
        key="submit"
        onClick={openQuestion}
        size={isDesktopOrLaptop ? 'middle' : 'large'}
        type="primary"
        value={questions[questionIndex].question.name}>
        Abrir Pregunta
      </Button>
    ),
    <Button
      danger
      key="cancel"
      onClick={handleCancel}
      size={isDesktopOrLaptop ? 'middle' : 'large'}>
      Cerrar
    </Button>,
  ];

  const RENDERER = () => {
    questions[questionIndex].timer = timer !== 15 ? timer : undefined;

    if (questions[questionIndex].timer <= 0) {
      return (
        <span
          className="question-countdown"
          style={{ fontSize: !isDesktopOrLaptop ? '24px' : '65px' }}>
          ¡Se acabó el tiempo!
        </span>
      );
    }

    return <span className="question-countdown">{timer}</span>;
  };

  return (
    <Modal
      centered
      bodyStyle={{ minHeight: 460 }}
      footer={!isDesktopOrLaptop && MODAL_BTNS}
      maskClosable={!timer}
      onCancel={handleCancel}
      width={'90%'}
      visible={visible}>
      <div className="question-wrapper">
        {(published || isDesktopOrLaptop) && RENDERER()}
        <p className="question-content">
          {questions[questionIndex].question.name}
        </p>
        <div className="answers-table">
          {ANSWERS.length > 0 && (
            <div className="answers-header">
              <div className="answers-cell">Equipos</div>
              <div className="answers-cell">Tiempo</div>
              <div className="answers-cell">Acciones</div>
            </div>
          )}
          {ANSWERS.length > 0 &&
            ANSWERS.map(({ team, timeToAnswer, pressed }) => (
              <div key={team} className="answers-body">
                <div className="answers-cell">{team}</div>
                <div className="answers-cell">{timeToAnswer}</div>
                <div className="answers-cell--actions">
                  {!pressed && (
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
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};

export default AnswersModal;
