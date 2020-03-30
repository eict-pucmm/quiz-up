import React, { Fragment, Component } from "react";
import { Breadcrumb, Card, Empty, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

import { URL_EVENTS } from "../../config/urls";
import RoundList from "../../components/RoundList";
import EventCardTitle from "../../components/EventCardTitle";
import AddEventModal from "../../components/AddEventModal";

import "./styles.css";

class Event extends Component {
  state = {
    events: [],
    loading: true,
    visible: false,
    savingEvent: false,
    eventToAdd: {
      name: "",
      dateOfEvent: new Date()
    }
  };

  componentDidMount() {
    axios
      .get(URL_EVENTS)
      .then(({ data }) => {
        setTimeout(
          () => this.setState({ events: data.events, loading: false }),
          1000
        );
      })
      .catch(({ response }) => console.log(response));
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  handleOk = () => {
    this.setState({ visible: false });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({ eventToAdd: { ...this.state.eventToAdd, [name]: value } });
  };

  handleDateChange = date => {
    this.setState({
      eventToAdd: { ...this.state.eventToAdd, dateOfEvent: date }
    });
  };

  onSubmit = () => {
    this.setState({ savingEvent: true });

    axios
      .post(`${URL_EVENTS}/`, { ...this.state.eventToAdd })
      .then(({ data }) => {
        this.setState({ visible: false, savingEvent: false });
        window.location.reload(false);
      })
      .catch(({ response }) => console.log(response));
  };

  render() {
    const { loading, events, visible, eventToAdd, savingEvent } = this.state;

    return (
      <Fragment>
        <Breadcrumb className="breadcrumb-title">
          <Breadcrumb.Item>Eventos</Breadcrumb.Item>
        </Breadcrumb>
        {loading ? (
          <div className="loading-card-placeholder">
            {[1, 2, 3].map(i => (
              <Card key={i} loading={loading}></Card>
            ))}
          </div>
        ) : (
          <div className="outer-event-card">
            {events.length === 0 ? (
              <Empty description={<span>No hay eventos creados!</span>}>
                <Button type="primary">Crear Evento</Button>
              </Empty>
            ) : (
              <Fragment>
                <Button
                  className="add-event-btn"
                  type="dashed"
                  size="large"
                  onClick={() => this.setState({ visible: true })}
                >
                  <PlusOutlined />
                  Agregar Evento
                </Button>
                {events.map(event => {
                  return (
                    <Card
                      className="event-card"
                      title={<EventCardTitle gameEvent={event} />}
                      key={event._id}
                    >
                      <p className="event-rounds-label">Rondas del evento</p>
                      <RoundList gameEvent={event} />
                    </Card>
                  );
                })}
              </Fragment>
            )}
            <AddEventModal
              handleChange={this.handleChange}
              handleDateChange={this.handleDateChange}
              onCancel={this.handleCancel}
              onSubmit={this.onSubmit}
              eventToAdd={eventToAdd}
              saving={savingEvent}
              visible={visible}
            />
          </div>
        )}
      </Fragment>
    );
  }
}

export default Event;
