import React from 'react';
import { Modal, Button } from 'antd';
import Countdown from 'react-countdown';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

import './styles.css';

const AnswersModal = ({ questions, questionIndex, ...props }) => {
  const { published, openQuestion, handleCancel, visible, answers } = props;

  const MODAL_BTNS = [
    <Button
      key="submit"
      value={questions[questionIndex].name}
      onClick={openQuestion}>
      Abrir Pregunta
    </Button>,
  ];

  const RENDERER = ({ seconds, completed }) =>
    completed ? (
      <span className="question-countdown">
        No hay mas oportunidades para responder
      </span>
    ) : (
      <span className="question-countdown">{seconds}</span>
    );

  return (
    <Modal
      centered
      footer={!published && MODAL_BTNS}
      onCancel={handleCancel}
      visible={visible}>
      <div className="question-wrapper">
        <p className="question-content">{questions[questionIndex].name}</p>
        {published && (
          <Countdown date={Date.now() + 30000} renderer={RENDERER} />
        )}
        {answers.length > 1 &&
          answers.map(({ teamName, timeToAnswer }) => (
            <p key={teamName}>
              {teamName} {timeToAnswer} <CheckCircleTwoTone />{' '}
              <CloseCircleTwoTone />{' '}
            </p>
          ))}
      </div>
    </Modal>
  );
};

export default AnswersModal;
