import React, { useEffect, useState } from 'react';
import { Form, Input, Select, notification, Button } from 'antd';
import { Link } from 'react-router-dom';

import {
  addRound,
  clearRoundFields,
  setRoundAttributes,
} from '../../state/actions';
import { useStateValue } from '../../state';
import ROUND from '../../constants/round';
import MyModal from '../MyModal';
import { getCategories } from '../../api/categories';
import { getTeams } from '../../api/teams';
import { saveRound } from '../../api/round';

const { Option } = Select;

const SHARED_PROPS = {
  showArrow: true,
  mode: 'multiple',
  optionFilterProp: 'children',
  filterOption: (input, option) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
};

const RoundModal = ({ gameEvent, showInfo, ...props }) => {
  const {
    dispatch,
    state: { roundToAdd, round, viewOldEvents },
  } = useStateValue();
  const { errorName, errorCategories, errorTeams } = roundToAdd;
  const [allCategories, setAllCategories] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await getCategories();
      setAllCategories(data || []);
    };

    const loadTeams = async () => {
      const { data } = await getTeams();
      setAllTeams(data);
    };

    loadCategories();
    loadTeams();
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    dispatch(addRound({ [name]: value, errorName: value.length < 3 }));
  };

  const onSelectEvents = value => {
    form.setFieldsValue({ roundCategories: value });
    dispatch(
      addRound({ categories: value, errorCategories: value.length !== 4 })
    );
  };

  const onSelectTeams = value => {
    form.setFieldsValue({ roundTeams: value });
    const participants = value.map(v => ({ team: v }));
    dispatch(addRound({ participants, errorTeams: value.length !== 4 }));
  };

  const onSubmit = async () => {
    if (errorName || errorCategories || errorTeams) {
      return notification['error']({
        message: 'Por favor revise los datos de la ronda.',
      });
    }

    dispatch(setRoundAttributes({ saving: true }));

    const { error } = await saveRound({
      round: roundToAdd,
      event: gameEvent._id,
    });

    if (error) {
      dispatch(setRoundAttributes({ saving: false }));
      return notification['error']({
        message:
          '¡Oh no! Ha ocurrido un error con el servidor. Favor de comunicarse con su administrador.',
      });
    }

    notification['success']({
      message: 'El evento ha sido creada con exito',
    });

    dispatch(clearRoundFields());
    dispatch(setRoundAttributes({ saving: false }));
    //close modal after submitting
    props.onCancel();
  };

  return (
    <MyModal
      {...props}
      form={form}
      onSubmit={onSubmit}
      saving={round.saving}
      type="Ronda"
      title={`Agregar nueva ronda al evento: ${gameEvent.name}`}>
      {showInfo && (
        <Link to={viewOldEvents ? '#' : `/event/round/${round._id}`}>
          <Button type="primary">Empezar Ronda</Button>
        </Link>
      )}
      <Form form={form} labelCol={{ span: 12 }} layout="vertical" size="medium">
        {ROUND.map(({ label, id, ...attr }) => (
          <Form.Item label={label} key={id}>
            <Input {...attr} value={roundToAdd.name} onChange={handleChange} />
            {errorName && (
              <p className="red">Favor introducir más de 3 carácteres</p>
            )}
          </Form.Item>
        ))}
        <Form.Item label="Categorías">
          {errorCategories && (
            <p className="red">Favor de seleccionar 4 categorías</p>
          )}
          <Select
            {...SHARED_PROPS}
            onChange={onSelectEvents}
            placeholder="Categorías de esta ronda">
            {allCategories.map(({ name, _id }) => (
              <Option value={_id} key={_id}>
                {name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Equipos">
          {errorTeams && <p className="red">Favor de seleccionar 4 equipos</p>}
          <Select
            {...SHARED_PROPS}
            onChange={onSelectTeams}
            placeholder="Equipos que participaran en esta ronda">
            {allTeams.map(({ name, _id }) => (
              <Option value={_id} key={_id}>
                {name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </MyModal>
  );
};

export default RoundModal;
