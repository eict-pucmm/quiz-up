import React, { useContext } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { Card as AntCard, Button } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

import './styles.css';

const CARD_STYLES = { color: 'dodgerblue' };
const CARD_STYLES_DISABLED = { color: 'grey', cursor: 'none' };

const RoundController = ({ questions, showModal, headers }) => {
  return (
    <Accordion className="accordion-container">
      {headers.map(category => (
        <Card key={category}>
          <Card.Header>
            <ContextAwareToggle eventKey={category}>
              {category}
            </ContextAwareToggle>
          </Card.Header>
          <Accordion.Collapse eventKey={category}>
            <Card.Body>
              {questions.map(
                (q, i) =>
                  q.categorySelected === category && (
                    <AntCard
                      key={q._id}
                      className="question-card"
                      onClick={() => !q.disabled && showModal(i)}
                      style={q.disabled ? CARD_STYLES_DISABLED : CARD_STYLES}>
                      {q.question.points}
                    </AntCard>
                  )
              )}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      ))}
    </Accordion>
  );
};

const ContextAwareToggle = ({ children, eventKey, callback }) => {
  const currentEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <Button type="link" onClick={decoratedOnClick} className="category-title">
      {children} {isCurrentEventKey ? <UpOutlined /> : <DownOutlined />}
    </Button>
  );
};

export default RoundController;
