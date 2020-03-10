import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  state = {
    questions: [],
    question: ""
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

  onClick = async event => {
    const { name, value } = event.target;
    await this.setState({ [name]: value });

    await axios
      .post("/api/questions/publish/", { question: this.state.question })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };
  render() {
    const { questions } = this.state;

    return (
      <div className="App">
        {questions.map(q => (
          <button
            key={q._id}
            id="question"
            value={q.name}
            name="question"
            onClick={this.onClick}
          >
            {q.name}
          </button>
        ))}
      </div>
    );
  }
}

export default App;
