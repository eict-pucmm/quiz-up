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
      .then(({ data }) => {
        this.setState({ events: data.events, loading: false });
      })
      .catch(({ response }) => console.log(response));
  }

  render() {
    const { loading, events } = this.state;

    const innerTitle = {
      fontSize: 14,
      color: "black",
      marginBottom: 16,
      fontWeight: 500
    };
    return (
      <Fragment>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ background: "#fff", padding: 24, minHeight: 580 }}>
          {events.map(({ _id, name, dateOfEvent }) => {
            return (
              <Card
                title={`${name} ${dateOfEvent}`}
                loading={loading}
                key={_id}
              >
                <p style={innerTitle}>Rondas del evento</p>
                <RoundOfEventCard event={_id} />
              </Card>
            );
          })}
        </div>
      </Fragment>
    );
  }
}

export default Event;
