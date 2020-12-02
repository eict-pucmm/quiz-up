import React, { Fragment, useState, useEffect } from 'react';
import { Breadcrumb, notification, Table, Form } from 'antd';

import { getMedicalCenters } from '../../api/medialCenters';
import { getTeamById, getTeams, saveTeam, updateTeam } from '../../api/teams';
import { getResidents } from '../../api/resident';
import { COLUMNS } from './columns';
import { useStateValue } from '../../state';
import { addTeam, clearTeamForm, setTeams } from '../../state/actions';
import CollapsableFormWrapper from '../../components/CollapsableFormWrapper';
import FormTeams from '../../components/FormTeams';

import './styles.css';
import { initialState } from '../../state/initialState';

const Teams = () => {
  const { state, dispatch } = useStateValue();
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState('');
  const [form] = Form.useForm();

  const { saving, data, editing, nameChanged } = state.teams;

  useEffect(() => {
    const get = async () => {
      const { data } = await getTeams();
      const teams = data.map(el => ({ ...el, key: el._id }));
      const { data: residents } = await getResidents();
      const { data: centers } = await getMedicalCenters();

      dispatch(
        setTeams({
          data: teams || [],
          allResidents: residents || [],
          allMedicalCenters: centers || [],
        })
      );

      setLoading(false);
    };

    if (!saving) get();
  }, [saving, dispatch]);

  const onUpdate = async key => {
    setId(key);
    setLoading(true);
    dispatch(setTeams({ editing: true }));

    const {
      data: { name, residents, medicalCenter },
    } = await getTeamById(key);
    dispatch(
      addTeam({
        ...initialState.teamToAdd,
        name,
        residents,
        medicalCenter,
      })
    );
    form.setFieldsValue({ name, residents, medicalCenter });
    setLoading(false);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const { errorName, residents, errorMedicalCenter } = state.teamToAdd;
    if (errorName || errorMedicalCenter || residents.length === 0) {
      dispatch(addTeam({ errorResidents: residents.length === 0 }));
      return notification['error']({
        message: 'Por favor revise los datos del formulario.',
      });
    }

    setLoading(true);
    dispatch(setTeams({ saving: true }));

    const TEAM = { ...state.teamToAdd };

    if (editing) {
      if (!nameChanged) delete TEAM.name;
      const { error } = await updateTeam(id, { ...TEAM });
      return clearAndReturn(error);
    }

    const { error } = await saveTeam({ ...TEAM });

    return clearAndReturn(error);
  };

  const clearAndReturn = error => {
    if (error) {
      return notification['error']({
        message:
          error.status === 409
            ? '¡Ya existe un equipo con ese nombre!'
            : '¡Oh no! Ha ocurrido un error con el servidor. Favor comunicarse con su administrador.',
      });
    }

    //clear form and reset state
    clearAll();

    return notification['success']({
      message: `El equipo ha sido ${
        editing ? 'actualizado' : 'creado'
      } con éxito`,
    });
  };

  const clearAll = () => {
    form.resetFields();
    dispatch(clearTeamForm());
    dispatch(setTeams({ editing: false, saving: false, nameChanged: false }));
  };

  return (
    <Fragment>
      <Breadcrumb className="breadcrumb-title">
        <Breadcrumb.Item>Equipos</Breadcrumb.Item>
      </Breadcrumb>
      <CollapsableFormWrapper header="Agregar un equipo">
        <FormTeams form={form} cancelUpdate={clearAll} onSubmit={onSubmit} />
      </CollapsableFormWrapper>
      <Table
        loading={loading}
        columns={COLUMNS({ onUpdate })}
        dataSource={data}
      />
    </Fragment>
  );
};

export default Teams;
