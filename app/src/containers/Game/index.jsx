import React, { Component, Fragment } from "react";
import axios from "axios";
import { Card, Modal, Button } from "antd";
import Countdown from "react-countdown-now";
import { URL_ROUNDS, URL_QUESTIONS } from "../../config/urls";

class Game extends Component {
  state = {
    questions: [],
    question: 0,
    loading: true,
    visible: false,
    published: false
  };

  componentDidMount() {
    axios
      .get(`${URL_ROUNDS}/${this.props.match.params.idOfRound}`)
      .then(({ data }) =>
        this.setState({ questions: data.round.questions, loading: false })
      )
      .catch(({ response }) => console.log(response));

    this.subscribe();
  }

  showModal = selectedQuestion => {
    this.setState({ visible: true, question: selectedQuestion });
  };

  handleOk = () => {
    this.setState({
      visible: false
    });
  };

  handleCancel = () => {
    this.setState({ visible: false, published: false });
  };

  publishQuestion = event => {
    axios
      .post(`${URL_QUESTIONS}/publish/`, { question: event.target.value })
      .then(res => {
        console.log(res);

        if (res.status === 200) {
          this.setState({ published: true });
        }
      })
      .catch(err => console.log(err));
  };

  handlePublished = () => {
    this.setState({ published: false });
  };

  subscribe = () => {
    axios
      .get(`${URL_QUESTIONS}/mq/subscribe/`)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  renderer = ({ seconds }) => <span>{seconds}</span>;

  render() {
    const gridStyle = {
      width: "25%",
      textAlign: "center"
    };

    const { loading, questions, visible, question, published } = this.state;

    return (
      <div>
        {loading ? (
          <Card loading={true}></Card>
        ) : (
          <Fragment>
            <Card loading={loading}>
              {questions.map((question, index) => {
                return (
                  <Card.Grid
                    style={gridStyle}
                    key={question._id}
                    onClick={() => this.showModal(index)}
                  >
                    {question.points}
                  </Card.Grid>
                );
              })}
            </Card>
            <Modal
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              centered
              footer={[
                <Button
                  key="submit"
                  value={questions[question].name}
                  onClick={this.publishQuestion}
                >
                  Abrir Pregunta
                </Button>
              ]}
            >
              {questions[question].name}
              <br />
              {published ? (
                <Countdown date={Date.now() + 15000} renderer={this.renderer} />
              ) : (
                <Fragment />
              )}
            </Modal>
          </Fragment>
        )}
      </div>
    );
  }
}

export default Game;
