import React, { useState, useEffect } from 'react';
import { Breadcrumb, notification, Table, Form } from 'antd';

import ResidentsForm from '../../components/FormResidents';
import CollapsableFormWrapper from '../../components/CollapsableFormWrapper';
import { COLUMNS } from './columns';
import {
  getResidentById,
  getResidents,
  saveResident,
  updateResident,
} from '../../api/resident';

const Residents = () => {
  const [residents, setResidents] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [grade, setGrade] = useState('2do Año');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    const get = async () => {
      const { data } = await getResidents();

      setResidents(data || []);
      setLoading(false);
    };

    if (!saving) get();
  }, [saving]);

  const onUpdate = async key => {
    setLoading(true);
    setEditing(true);
    setId(key);

    const { data } = await getResidentById(key);
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setGrade(data.grade);
    form.setFieldsValue({ grade: data.grade });
    setLoading(false);
  };

  const onSubmit = async () => {
    if (!firstName || !lastName) {
      return notification['error']({
        message: 'Favor completar todos los campos',
      });
    }
    setSaving(true);
    setLoading(true);

    const RESIDENT = {
      firstName,
      lastName,
      grade,
    };

    if (editing) {
      const { error } = await updateResident(id, RESIDENT);
      return clearAndReturn(error);
    }

    const { error } = await saveResident(RESIDENT);

    return clearAndReturn(error);
  };

  const clearAndReturn = error => {
    setSaving(false);
    setLoading(false);

    if (error) {
      return notification['error']({
        message:
          '¡Oh no! Ha ocurrido un error con el servidor. Favor comunicarse con su administrador.',
      });
    }

    form.resetFields();
    if (editing) setEditing(false);
    setFirstName('');
    setLastName('');
    setGrade('2do Año');

    return notification['success']({
      message: `El residente ha sido ${
        editing ? 'actualizado' : 'creado'
      } con exito`,
    });
  };

  const cancelUpdate = () => {
    form.resetFields();
    setEditing(false);
    setSaving(false);
    setFirstName('');
    setLastName('');
    setGrade('2do Año');
  };

  return (
    <>
      <Breadcrumb className="breadcrumb-title">
        <Breadcrumb.Item>Residentes</Breadcrumb.Item>
      </Breadcrumb>
      <CollapsableFormWrapper header={'Agregar residente'}>
        <ResidentsForm
          cancelUpdate={cancelUpdate}
          editing={editing}
          firstName={firstName}
          form={form}
          lastName={lastName}
          onSubmit={onSubmit}
          setFirstName={setFirstName}
          setGrade={setGrade}
          setLastName={setLastName}
        />
      </CollapsableFormWrapper>
      <Table
        loading={loading}
        columns={COLUMNS({ onUpdate })}
        dataSource={residents}
        pagination={{ pageSize: 6 }}
        scroll={{ y: 400 }}
      />
    </>
  );
};

export default Residents;
