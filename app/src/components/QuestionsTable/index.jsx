import React from 'react';
import { Card, Row, Col } from 'antd';

import './styles.css';

const CARD_STYLES = { color: 'dodgerblue' };
const CARD_STYLES_DISABLED = { color: 'grey', cursor: 'none' };

const QuestionsTable = ({ questions, showModal, headers }) => {
  return (
    <div className="entire-gameboard-container">
      <Row>
        {headers.map(category => (
          <Col className="category-col" key={category}>
            <Card className="category-title">{category}</Card>
          </Col>
        ))}
      </Row>
      <Row className="all-questions-container">
        {questions.map((q, index) => (
          <Col className="question-col" key={q.question._id}>
            <Card
              className="question-card"
              onClick={() => !q.disabled && showModal(index)}
              style={q.disabled ? CARD_STYLES_DISABLED : CARD_STYLES}>
              {q.question.points}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default QuestionsTable;
