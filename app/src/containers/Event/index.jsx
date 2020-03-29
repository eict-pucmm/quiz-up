import React, { Fragment, Component } from "react";
import { Breadcrumb, Card, Empty, Button } from "antd";
import axios from "axios";

import { URL_EVENTS } from "../../config/urls";
import formatDate from "../../helpers/date";
import RoundList from "../../components/RoundList";

import "./styles.css";

class Event extends Component {
  state = {
    events: [],
    loading: true
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

  render() {
    const { loading, events } = this.state;

    return (
      <Fragment>
        <Breadcrumb className="breadcrumb-title">
          <Breadcrumb.Item>Eventos</Breadcrumb.Item>
        </Breadcrumb>
        {loading ? (
          <div className="loading-card-placeholder">
            <Card loading={loading}></Card>
            <Card loading={loading}></Card>
            <Card loading={loading}></Card>
          </div>
        ) : (
          <div className="outer-event-card">
            {events.length === 0 ? (
              <Empty description={<span>No hay eventos creados!</span>}>
                <Button type="primary">Crear Evento</Button>
              </Empty>
            ) : (
              events.map(({ _id, name, dateOfEvent }) => {
                return (
                  <Card
                    title={
                      <div className="row">
                        {name}
                        <span className="event-date-label">
                          Fecha del evento: {formatDate(dateOfEvent)}
                        </span>
                      </div>
                    }
                    key={_id}
                  >
                    <p className="event-rounds-label">Rondas del evento</p>
                    <RoundList gameEvent={{ _id, name }} />
                  </Card>
                );
              })
            )}
          </div>
        )}
      </Fragment>
    );
  }
}

export default Event;
