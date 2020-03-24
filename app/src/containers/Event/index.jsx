import React, { Fragment, Component } from "react";
import { Breadcrumb, Card } from "antd";
import axios from "axios";

import { URL_EVENTS } from "../../config/urls";
import RoundOfEventCard from "../../components/RoundOfEventCard";

import "./styles.css";

class Event extends Component {
  state = {
    events: [],
    loading: true
  };

  componentDidMount() {
    axios
      .get(URL_EVENTS)
      .then(({ data }) =>
        this.setState({ events: data.events, loading: false })
      )
      .catch(({ response }) => console.log(response));
  }

  render() {
    const { loading, events } = this.state;

    return (
      <Fragment>
        <Breadcrumb className="breadcrumb-title">
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
        <div className="outer-event-card">
          {events.length === 0 ? (
            <Card loading={loading}></Card>
          ) : (
            events.map(({ _id, name, dateOfEvent }) => {
              return (
                <Card title={`${name} ${dateOfEvent}`} key={_id}>
                  <p className="event-rounds-label">Rondas del evento</p>
                  <RoundOfEventCard event={_id} />
                </Card>
              );
            })
          )}
        </div>
      </Fragment>
    );
  }
}

export default Event;
