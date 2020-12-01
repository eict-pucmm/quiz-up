import React, { useContext } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { Card as AntCard, Button } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

import { useStateValue } from '../../state';
import { setGame } from '../../state/actions';

import './styles.css';

const CARD_STYLES = { color: 'dodgerblue' };
const CARD_STYLES_DISABLED = { color: 'grey', cursor: 'none' };

const RoundController = ({ questions, showModal, headers }) => {
  const { dispatch } = useStateValue();

  const handleFinishRound = () => {
    // console.log(state.game.finished)
    dispatch(setGame({ finished: true }));
    //TODO update round, show modal with winner and redirect home
  };
  return (
    <>
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
      <Button
        type="primary"
        shape="round"
        className="end-round-fab"
        onClick={handleFinishRound}>
        Terminar Ronda
      </Button>
    </>
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
