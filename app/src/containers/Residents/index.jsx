import React, { useState, useEffect } from 'react';
import { Breadcrumb, notification, Table } from 'antd';

import { getResidents, saveResident } from '../../api/resident';
import ResidentsForm from '../../components/FormResidents';
import CollapsableFormWrapper from '../../components/CollapsableFormWrapper';

const Residents = () => {
  const [residents, setResidents] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [grade, setGrade] = useState('2do Año');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      title: 'Nombres',
      dataIndex: 'firstName',
      key: 'firstName',
      width: 200,
      render: text => <p>{text}</p>,
    },
    {
      title: 'Apellidos',
      dataIndex: 'lastName',
      key: 'lastName',
      width: 200,
      render: text => <p>{text}</p>,
    },
    {
      title: 'Grado',
      dataIndex: 'grade',
      key: 'grade',
      width: 100,
      render: text => <p>{text}</p>,
    },
  ];

  useEffect(() => {
    const get = async () => {
      const { data } = await getResidents();

      setResidents(data || []);
      setLoading(false);
    };

    if (!saving) get();
  }, [saving]);

  const onSubmit = async () => {
    if (!firstName || !lastName) {
      return notification['error']({
        message: 'Favor completar todos los campos',
      });
    }
    setSaving(true);
    setLoading(true);

    const { error } = await saveResident({ firstName, lastName, grade });

    if (error) {
      setSaving(false);
      return notification['error']({
        message: error.data.message || error.data,
      });
    }

    setTimeout(() => {
      notification['success']({
        message: 'El residente ha sido agregado con exito',
      });

      setFirstName('');
      setLastName('');
      setGrade('2do Año');
      setSaving(false);
    }, 600);
  };

  return (
    <>
      <Breadcrumb className="breadcrumb-title">
        <Breadcrumb.Item>Residentes</Breadcrumb.Item>
      </Breadcrumb>
      <CollapsableFormWrapper header={'Agregar residente'}>
        <ResidentsForm
          onSubmit={onSubmit}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setGrade={setGrade}
          firstName={firstName}
          lastName={lastName}
        />
      </CollapsableFormWrapper>
      <Table
        loading={loading}
        columns={columns}
        dataSource={residents}
        pagination={{ pageSize: 6 }}
        scroll={{ y: 400 }}
      />
    </>
  );
};

export default Residents;
