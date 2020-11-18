import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, notification, Input, Table, Card } from 'antd';

import { COLUMNS } from './columns';
import {
  getMedicalCenterById,
  getMedicalCenters,
  removeMedicalCenter,
  saveMedicalCenter,
  updateMedicalCenter,
} from '../../api/medialCenters';

const MedicalCenters = () => {
  const [centers, setCenters] = useState([]);
  const [centerName, setCenterName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState('');

  useEffect(() => {
    const get = async () => {
      const { data } = await getMedicalCenters();
      const centers = data.map(el => ({ ...el, key: el._id }));
      setCenters(centers || []);
      setLoading(false);
    };

    if (!saving) get();
  }, [saving]);

  const onRemove = async key => {
    setLoading(true);
    setSaving(true);
    const { error } = await removeMedicalCenter(key);
    if (!error) {
      notification['success']({
        message: 'El centro ha sido removido con éxito',
      });
    }
    setSaving(false);
    setLoading(false);
  };

  const clearAndReturn = error => {
    setCenterName('');
    setSaving(false);
    setLoading(false);
    setEditing(false);

    return error
      ? notification['error']({
          message:
            '¡Oh no! Ha ocurrido un error con el servidor. Favor comunicarse con su administrador.',
        })
      : notification['success']({
          message: `El centro ha sido ${
            editing ? 'actualizado' : 'creado'
          } con éxito`,
        });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSaving(true);

    if (editing) {
      const { error } = await updateMedicalCenter(id, { name: centerName });

      return clearAndReturn(error);
    }

    const { error } = await saveMedicalCenter({
      name: centerName,
    });

    return clearAndReturn(error);
  };

  const onUpdate = async key => {
    setLoading(true);
    setEditing(true);
    setId(key);

    const { data } = await getMedicalCenterById(key);
    setCenterName(data.name);
    setLoading(false);
  };

  const cancelUpdate = e => {
    e.preventDefault();
    setEditing(false);
    setCenterName('');
  };

  return (
    <>
      <Breadcrumb className="breadcrumb-title">
        <Breadcrumb.Item>Centros Médicos</Breadcrumb.Item>
      </Breadcrumb>
      <Card style={{ marginBottom: 8 }}>
        <span
          className="ant-form-item-label"
          style={{ fontWeight: 700, marginRight: 4 }}>
          Nuevo Centro:
        </span>
        <Input
          style={{ width: '40%' }}
          value={centerName}
          onChange={e => setCenterName(e.target.value)}
        />
        <Button key="submit" type="primary" onClick={onSubmit}>
          {editing ? 'Actualizar' : 'Agregar'}
        </Button>
        {editing && (
          <Button type="danger" onClick={cancelUpdate}>
            Cancelar
          </Button>
        )}
      </Card>

      <Table
        loading={loading}
        columns={COLUMNS({ onUpdate, onRemove })}
        dataSource={centers}
      />
    </>
  );
};

export default MedicalCenters;
