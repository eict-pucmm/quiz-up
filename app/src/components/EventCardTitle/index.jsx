import React from 'react';
import formatDate from 'date-fns/format';
import { es } from 'date-fns/locale';
import { useMediaQuery } from 'react-responsive';

import './styles.css';

const EventCardTitle = ({ gameEvent: { name, dateOfEvent } }) => {
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  return (
    <div className="row">
      <p className="event-title">{name}</p>
      <span className="event-date-label">
        {isDesktop ? 'Fecha del evento: ' : 'Fecha: '}
        {formatDate(new Date(dateOfEvent), isDesktop ? 'PPP' : 'P', {
          locale: es,
        })}
      </span>
    </div>
  );
};

export default EventCardTitle;
