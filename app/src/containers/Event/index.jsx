import React, { useState, useEffect } from 'react';
import { Breadcrumb, Card, Empty, Button, notification, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { getEvents, saveEvents } from '../../api/event';
import {
  setEvents,
  clearEventFields,
  viewOldEvents,
} from '../../state/actions';
import { useStateValue } from '../../state';
import EventModal from '../../components/EventModal';
import EventCardTitle from '../../components/EventCardTitle';
import LoadingCards from '../../components/LoadingCards';
import RoundList from '../../components/RoundList';

import './styles.css';

const { TabPane } = Tabs;

const Event = () => {
  const { state, dispatch } = useStateValue();
  const [loading, setLoading] = useState(true);

  const { saving, data } = state.events;

  useEffect(() => {
    const get = async () => {
      const { data } = await getEvents({ oldEvents: state.viewOldEvents });

      dispatch(setEvents({ data: data || [] }));
      setLoading(false);
    };

    if (!saving) get();
  }, [dispatch, saving, state.viewOldEvents]);

  const openModal = () => dispatch(setEvents({ openModal: true }));

  const onSubmit = async () => {
    const { name, dateOfEvent } = state.eventToAdd;

    if (!name || name.length < 3 || !dateOfEvent) {
      return notification['error']({
        message: 'Por favor ingrese un nombre para el evento y una fecha',
      });
    }

    dispatch(setEvents({ saving: true }));

    const { error } = await saveEvents(state.eventToAdd);

    if (error) {
      dispatch(setEvents({ saving: false }));
      return notification['error']({
        message:
          error.status === 409
            ? '¡Ya existe un evento con ese nombre!'
            : '¡Oh no! Ha ocurrido un error con el servidor. Favor comunicarse con su administrador.',
      });
    }

    setTimeout(() => {
      notification['success']({
        message: 'El evento ha sido creada con éxito',
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
      <span
        className="old-events"
        onClick={() => dispatch(viewOldEvents(!state.viewOldEvents))}>
        {state.viewOldEvents
          ? 'Ver eventos recientes'
          : 'Ver eventos anteriores'}
      </span>
      <h2 className="events-main-title">
        {state.viewOldEvents ? 'Eventos Anteriores' : 'Próximos Eventos'}
      </h2>
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
            {data.map(event => (
              <Card
                className="event-card"
                title={<EventCardTitle gameEvent={event} />}
                key={event._id}>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Rondas" key="1">
                    <RoundList gameEvent={event} />
                  </TabPane>
                  <TabPane tab="Rondas finalizadas" key="2">
                    <RoundList gameEvent={event} finished={1} />
                  </TabPane>
                </Tabs>
              </Card>
            ))}
          </>
        )}
        <EventModal onSubmit={onSubmit} />
      </div>
    </>
  );
};

export default Event;
