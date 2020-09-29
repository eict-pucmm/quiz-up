import React, { useState, useEffect } from 'react';
import { Breadcrumb, Card, Empty, Button, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { getEvents, saveEvents } from '../../api/event';
import { setEvents, clearEventFields } from '../../state/actions';
import { useStateValue } from '../../state';
import EventModal from '../../components/EventModal';
import EventCardTitle from '../../components/EventCardTitle';
import LoadingCards from '../../components/LoadingCards';
import RoundList from '../../components/RoundList';

import './styles.css';

const Event = () => {
  const { state, dispatch } = useStateValue();
  const [loading, setLoading] = useState(true);
  const [viewOldies, setViewOldies] = useState(false);

  const { saving, data } = state.events;

  useEffect(() => {
    const get = async () => {
      const { data } = await getEvents({ oldEvents: viewOldies });

      dispatch(setEvents({ data: data || [] }));
      setLoading(false);
    };

    if (!saving) get();
  }, [dispatch, saving, viewOldies]);

  const openModal = () => dispatch(setEvents({ openModal: true }));

  const onSubmit = async () => {
    dispatch(setEvents({ saving: true }));

    const { error } = await saveEvents(state.eventToAdd);

    if (error) {
      dispatch(setEvents({ saving: false }));
      return notification['error']({
        message: error.data.message || error.data,
      });
    }

    setTimeout(() => {
      notification['success']({
        message: 'El evento ha sido creada con exito',
      });

      dispatch(clearEventFields());
      dispatch(setEvents({ openModal: false, saving: false }));
    }, 600);
  };

  if (loading) return <LoadingCards loading={loading} />;

  return (
    <>
      <Breadcrumb className="breadcrumb-title">
        <Breadcrumb.Item>Eventos</Breadcrumb.Item>
      </Breadcrumb>
      <span className="old-events" onClick={() => setViewOldies(!viewOldies)}>
        Ver eventos anteriores
      </span>
      <div className="outer-event-card">
        {data.length === 0 ? (
          <Empty description={'No hay eventos creados!'}>
            <Button type="primary" onClick={openModal}>
              Crear Evento
            </Button>
          </Empty>
        ) : (
          <>
            <Button
              className="add-event-btn"
              type="dashed"
              size="large"
              onClick={openModal}>
              <PlusOutlined />
              Agregar Evento
            </Button>
            {data.map(event => {
              return (
                <Card
                  className="event-card"
                  title={<EventCardTitle gameEvent={event} />}
                  key={event._id}>
                  <p className="event-rounds-label">Rondas del evento</p>
                  <RoundList gameEvent={event} />
                </Card>
              );
            })}
          </>
        )}
        <EventModal onSubmit={onSubmit} />
      </div>
    </>
  );
};

export default Event;
