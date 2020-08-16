import React from 'react';
import formatDate from 'date-fns/format';
import { es } from 'date-fns/locale';

const EventCardTitle = ({ gameEvent: { name, dateOfEvent } }) => (
  <div className="row">
    {name}
    <span className="event-date-label">
      Fecha del evento:{' '}
      {formatDate(new Date(dateOfEvent), 'PPP', { locale: es })}
    </span>
  </div>
);

export default EventCardTitle;
