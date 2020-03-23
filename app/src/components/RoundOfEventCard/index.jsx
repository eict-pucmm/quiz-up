import React, { Component, Fragment } from "react";
import { Card } from "antd";
import axios from "axios";
import { URL_ROUNDS } from "../../config/urls";

import "./styles.css";

class RoundOfEventCard extends Component {
  state = {
    rounds: []
  };

  componentDidMount() {
    axios
      .get(`${URL_ROUNDS}/event/${this.props.event}`)
      .then(({ data }) => this.setState({ rounds: data.rounds }))
      .catch(({ response }) => console.log(response));
  }

  render() {
    const { rounds } = this.state;

    return rounds.length === 0 ? (
      <Card.Grid hoverable={false}>Este Evento NO tiene rondas</Card.Grid>
    ) : (
      <Fragment>
        {rounds.map(round => {
          return (
            <Card
              type="inner"
              title={round.name}
              extra={
                <span
                  onClick={() => console.log("klk")}
                  style={{ color: "blue" }}
                >
                  Mas Informacion
                </span>
              }
              key={round._id}
            >
              Round Data
            </Card>
          );
        })}
      </Fragment>
    );
  }
}

export default RoundOfEventCard;
