import React, { Component, Fragment } from "react";
import { Card } from "antd";
import axios from "axios";
import { URL_ROUNDS } from "../../config/urls";

import "./styles.css";

class RoundOfEventCard extends Component {
  state = {
    rounds: [],
    loading: true
  };

  componentDidMount() {
    axios
      .get(`${URL_ROUNDS}/event/${this.props.event}`)
      .then(({ data }) =>
        this.setState({ rounds: data.rounds, loading: false })
      )
      .catch(({ response }) => console.log(response));
  }

  render() {
    const { rounds, loading } = this.state;

    return loading ? (
      <Card loading={loading} />
    ) : (
      <Fragment>
        {rounds.length === 0 ? (
          <Card.Grid hoverable={false}>Este evento NO tiene rondas</Card.Grid>
        ) : (
          rounds.map(round => {
            return (
              <Card
                type="inner"
                loading={loading}
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
          })
        )}
      </Fragment>
    );
  }
}

export default RoundOfEventCard;
