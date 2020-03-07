import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  state = {
    questions: []
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ questions: res.questions }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await axios("/api/questions");
    if (response.status !== 200) throw Error(response.message.error);

    return response.data;
  };
  render() {
    const { questions } = this.state;

    return (
      <div className="App">
        {questions.map(q => (
          <p key={q._id}>{q.name}</p>
        ))}
      </div>
    );
  }
}

export default App;
