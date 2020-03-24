import React, { Component, Fragment } from "react";
import { Card, Modal, Button } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

import { URL_ROUNDS } from "../../config/urls";

import "./styles.css";

class RoundOfEventCard extends Component {
  state = {
    rounds: [],
    selectedRound: 0,
    loading: true,
    visible: false
  };

  componentDidMount() {
    axios
      .get(`${URL_ROUNDS}/event/${this.props.event}`)
      .then(({ data }) =>
        this.setState({ rounds: data.rounds, loading: false })
      )
      .catch(({ response }) => console.log(response));
  }

  showModal = roundIndex => {
    this.setState({ visible: true, selectedRound: roundIndex });
  };

  handleOk = () => {
    this.setState({
      visible: false
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { rounds, loading, selectedRound } = this.state;

    return loading ? (
      <Card loading={loading} />
    ) : (
      <Fragment>
        {rounds.length === 0 ? (
          <Fragment>
            <Card.Grid hoverable={false}>Este evento NO tiene rondas</Card.Grid>
            <Button>Agregar Ronda</Button>
          </Fragment>
        ) : (
          <Fragment>
            {rounds.map((round, index) => {
              return (
                <Card
                  className="cursor-pointer"
                  key={round._id}
                  loading={loading}
                  onClick={() => this.showModal(index)}
                  title={round.name}
                  type="inner"
                  extra={
                    <span
                      onClick={() => this.showModal(index)}
                      className="more-info-label cursor-pointer"
                    >
                      Mas Informacion
                    </span>
                  }
                >
                  Round Data
                </Card>
              );
            })}
            <Modal
              cancelText="Cancelar"
              centered
              onCancel={this.handleCancel}
              onOk={this.handleOk}
              title={rounds[selectedRound].name}
              visible={this.state.visible}
            >
              <p>Some contents...</p>
              <Link
                className="start-round-btn"
                to={`/event/round/${rounds[selectedRound]._id}`}
              >
                Empezar Ronda
              </Link>
            </Modal>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default RoundOfEventCard;
