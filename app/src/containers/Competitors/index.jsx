import React, { Component } from 'react';
import axios from 'axios';
import { URL_COMPETITORS } from '../../config/urls';

class Competitors extends Component {
  state = {
    competitors: [],
  };

  componentDidMount() {
    this.getCompetitors();
  }
  getCompetitors = () => {
    axios
      .get(`${URL_COMPETITORS}/`)
      .then(({ data }) => {
        console.log(data);
        this.setState({ competitors: data.competitors });
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };
  render() {
    return <h1>Competitors</h1>;
  }
}

export default Competitors;
