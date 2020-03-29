import React, { Component, Fragment } from "react";
import { Card, Modal, Row, Col, Empty, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";

import { URL_ROUNDS } from "../../config/urls";
import AddRoundModal from "../AddRoundModal";
import RoundCard from "../RoundCard";

import "./styles.css";

class RoundList extends Component {
  state = {
    rounds: [],
    selectedRound: 0,
    loading: true,
    visible: false,
    addRound: false,
    savingRound: false,
    roundToAdd: {
      name: ""
    }
  };

  componentDidMount() {
    axios
      .get(`${URL_ROUNDS}/event/${this.props.gameEvent._id}`)
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
    this.setState({ visible: false, addRound: false });
  };

  onSubmit = () => {
    this.setState({ savingRound: true });
    const { name } = this.state.roundToAdd;
    axios
      .post(`${URL_ROUNDS}/`, { name, event: this.props.gameEvent._id })
      .then(({ data }) => {
        this.setState({ visible: false, addRound: false, savingRound: false });
        window.location.reload(false);
      })
      .catch(({ response }) => console.log(response));
  };

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({ roundToAdd: { [name]: value } });
  };

  render() {
    const {
      rounds,
      loading,
      selectedRound,
      addRound,
      roundToAdd,
      savingRound
    } = this.state;

    return loading ? (
      <Card loading={loading} />
    ) : (
      <Fragment>
        {rounds.length === 0 ? (
          <Fragment>
            <Empty description="Este evento NO tiene rondas">
              <Button onClick={() => this.setState({ addRound: true })}>
                Agregar Ronda
              </Button>
            </Empty>
          </Fragment>
        ) : (
          <Fragment>
            <Row gutter={[40, 16]}>
              <Col className="gutter-row" span={8}>
                <Card
                  hoverable
                  className="add-round-card"
                  onClick={() => this.setState({ addRound: true })}
                >
                  <PlusOutlined />
                  Agregar Ronda
                </Card>
              </Col>
              {rounds.map((round, index) => {
                return (
                  <RoundCard
                    index={index}
                    key={round._id}
                    loading={loading}
                    round={round}
                    showModal={this.showModal}
                  />
                );
              })}
            </Row>
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

        <AddRoundModal
          {...this.props}
          handleChange={this.handleChange}
          onCancel={this.handleCancel}
          onSubmit={this.onSubmit}
          roundToAdd={roundToAdd}
          saving={savingRound}
          visible={addRound}
        />
      </Fragment>
    );
  }
}

export default RoundList;
