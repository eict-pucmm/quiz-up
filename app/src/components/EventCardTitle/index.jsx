import React from "react";
import formatDate from "../../helpers/date";

const EventCardTitle = ({ gameEvent }) => {
  const { name, dateOfEvent } = gameEvent;
  return (
    <div className="row">
      {name}
      <span className="event-date-label">
        Fecha del evento: {formatDate(dateOfEvent)}
      </span>
    </div>
  );
};

export default EventCardTitle;
