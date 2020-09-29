import React, { Component, Fragment } from 'react';
import { Card, Modal, Button } from 'antd';
import axios from 'axios';
import Countdown from 'react-countdown';
import openSocket from 'socket.io-client';

import { URL_ROUNDS } from '../../config/urls';

import './styles.css';
class Game extends Component {
  state = {
    questions: [],
    question: 0,
    loading: true,
    visible: false,
    published: false,
  };

  componentDidMount() {
    axios
      .get(`${URL_ROUNDS}/${this.props.match.params.idOfRound}`)
      .then(({ data }) =>
        this.setState({ questions: data.round.questions, loading: false })
      )
      .catch(({ response }) => console.log(response));

    openSocket('/');
  }

  showModal = selectedQuestion => {
    this.setState({ visible: true, question: selectedQuestion });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({ visible: false, published: false });
  };

  handlePublished = () => {
    this.setState({ published: false });
  };

  renderer = ({ seconds }) => <span>{seconds}</span>;

  render() {
    const { loading, questions, visible, question, published } = this.state;

    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ height: '100vh', width: '15%' }}>hello</div>
        {loading ? (
          <Card loading={true}></Card>
        ) : (
          <>
            <Card loading={loading}>
              {questions.map((question, index) => (
                <Card.Grid
                  className="question-card"
                  key={question._id}
                  onClick={() => this.showModal(index)}>
                  {question.points}
                </Card.Grid>
              ))}
            </Card>
            {questions.length === 0 ? (
              <Fragment />
            ) : (
              <Modal
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                centered
                footer={[
                  <Button
                    key="submit"
                    value={questions[question].name}
                    onClick={this.publishQuestion}>
                    Abrir Pregunta
                  </Button>,
                ]}>
                {questions[question].name}
                <br />
                {published ? (
                  <Countdown
                    date={Date.now() + 15000}
                    renderer={this.renderer}
                  />
                ) : (
                  <Fragment />
                )}
              </Modal>
            )}
          </>
        )}
      </div>
    );
  }
}

export default Game;
