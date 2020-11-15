import React from 'react';
import { Modal, Button } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

import './styles.css';

const AnswersModal = ({ questions, questionIndex, timer, ...props }) => {
  const { published, openQuestion, handleCancel, visible, answers } = props;
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1024 });

  const MODAL_BTNS = [
    <Button
      key="submit"
      onClick={openQuestion}
      size={isDesktopOrLaptop ? 'middle' : 'large'}
      type="primary"
      value={questions[questionIndex].name}>
      Abrir Pregunta
    </Button>,
    <Button
      danger
      key="cancel"
      onClick={handleCancel}
      size={isDesktopOrLaptop ? 'middle' : 'large'}>
      Cerrar
    </Button>,
  ];

  const RENDERER = timer =>
    timer <= 0 ? (
      <span
        className="question-countdown"
        style={{ fontSize: !isDesktopOrLaptop ? '24px' : '65px' }}>
        ¡Se acabó el tiempo!
      </span>
    ) : (
      <span className="question-countdown">{timer}</span>
    );

  return (
    <Modal
      centered
      bodyStyle={{ height: 460 }}
      footer={!published && MODAL_BTNS}
      maskClosable={!timer}
      onCancel={handleCancel}
      width={'90%'}
      visible={visible}>
      <div className="question-wrapper">
        {(published || isDesktopOrLaptop) && RENDERER(timer)}
        <p className="question-content">{questions[questionIndex].name}</p>
        <div className="answers-table">
          {answers.length > 0 && (
            <div className="answers-header">
              <div className="answers-cell">Equipos</div>
              <div className="answers-cell">Tiempo</div>
              <div className="answers-cell">Acciones</div>
            </div>
          )}
          {answers.length > 0 &&
            answers.map(({ teamName, timeToAnswer }) => (
              <div key={teamName} className="answers-body">
                <div className="answers-cell">{teamName}</div>
                <div className="answers-cell">{timeToAnswer}</div>
                <div className="answers-cell--actions">
                  <CheckCircleTwoTone
                    onClick={e => props.handleRightAnswer(e, teamName)}
                    twoToneColor="#52c41a"
                  />
                  <CloseCircleTwoTone
                    onClick={e => props.handleWrongAnswer(e, teamName)}
                    twoToneColor="#F51D23"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};

export default AnswersModal;
