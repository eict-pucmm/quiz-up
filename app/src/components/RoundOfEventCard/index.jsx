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
                  onClick={() => this.showModal(index)}
                  key={round._id}
                  type="inner"
                  loading={loading}
                  title={round.name}
                  extra={
                    <span
                      onClick={() => this.showModal(index)}
                      style={{ color: "blue", cursor: "pointer" }}
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
              title={rounds[selectedRound].name}
              centered
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              cancelText="Cancelar"
            >
              <p>Some contents...</p>
              <Link
                to={`/event/round/${rounds[selectedRound]._id}`}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  padding: 10
                }}
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
