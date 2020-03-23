import React, { Component } from "react";

class Game extends Component {
  render() {
    console.log(this.props.match.params.idOfRound);
    return <h1>Let the games begin!</h1>;
  }
}

export default Game;
