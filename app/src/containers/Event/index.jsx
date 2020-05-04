import React, { Fragment, Component } from 'react';
import { Breadcrumb, Card, Empty, Button, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

import { URL_EVENTS } from '../../config/urls';
import AddEventModal from '../../components/AddEventModal';
import EventCardTitle from '../../components/EventCardTitle';
import RoundList from '../../components/RoundList';

import './styles.css';

class Event extends Component {
  state = {
    events: [],
    loading: true,
    visible: false,
    savingEvent: false,
    eventToAdd: {
      name: '',
      dateOfEvent: new Date(),
    },
  };

  componentDidMount() {
    this.getEvents();
  }

  componentDidUpdate(_, prevState) {
    // this is to not reload the entire page again and only
    // re-render the event that has a new round
    if (prevState.savingEvent !== this.state.savingEvent) {
      this.getEvents();
    }
  }

  getEvents() {
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

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({ eventToAdd: { ...this.state.eventToAdd, [name]: value } });
  };

  handleDateChange = date => {
    this.setState({
      eventToAdd: { ...this.state.eventToAdd, dateOfEvent: date },
    });
  };

  onSubmit = () => {
    this.setState({ savingEvent: true });

    axios
      .post(`${URL_EVENTS}/`, { ...this.state.eventToAdd })
      .then(({ data }) => {
        this.setState({
          visible: false,
          savingEvent: false,
          eventToAdd: { name: '', dateOfEvent: new Date() },
        });
        notification['success']({
          message: 'El evento ha sido creada con exito',
        });
      })
      .catch(({ response }) => {
        this.setState({ savingEvent: false });
        notification['error']({
          message: response.data,
        });
      });
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
                <Button
                  type="primary"
                  onClick={() => this.setState({ visible: true })}
                >
                  Crear Evento
                </Button>
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
