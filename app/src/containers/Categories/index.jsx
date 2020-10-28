import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, notification, Input, Table, Card } from 'antd';

import ActionButtons from '../../components/ActionButtons';
import {
  getCategories,
  getCategoryById,
  removeCategory,
  saveCategory,
  updateCategory,
} from '../../api/categories';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState('');

  useEffect(() => {
    const get = async () => {
      const { data } = await getCategories();
      const categories = data.map(el => ({ ...el, key: el._id }));
      setCategories(categories || []);
      setLoading(false);
    };

    if (!saving) get();
  }, [saving]);

  const onRemove = async key => {
    setLoading(true);
    setSaving(true);
    const { error } = await removeCategory(key);
    if (!error) {
      notification['success']({
        message: 'La categoria ha sido removida con exito',
      });
    }
    setSaving(false);
    setLoading(true);
  };

  const clearAndReturn = error => {
    setCategoryName('');
    setSaving(false);
    setLoading(false);
    setEditing(false);

    return error
      ? notification['error']({
          message:
            '¡Oh no! Ha ocurrido un error con el servidor. Favor comunicarse con su administrador.',
        })
      : notification['success']({
          message: `La categoria ha sido ${
            editing ? 'actualizada' : 'creada'
          } con exito`,
        });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSaving(true);

    if (editing) {
      const { error } = await updateCategory(id, { name: categoryName });

      return clearAndReturn(error);
    }

    const { error } = await saveCategory({
      name: categoryName,
    });

    return clearAndReturn(error);
  };

  const onUpdate = async key => {
    setLoading(true);
    setEditing(true);
    setId(key);

    const { data } = await getCategoryById(key);
    setCategoryName(data.name);
    setLoading(false);
  };

  const cancelUpdate = e => {
    e.preventDefault();
    setEditing(false);
    setCategoryName('');
  };

  const columns = [
    {
      title: 'Categorías',
      dataIndex: 'name',
      key: 'categoria',
    },
    {
      title: 'Acción',
      key: 'action',
      render: record => (
        <ActionButtons
          onUpdate={() => onUpdate(record.key)}
          onRemove={() => onRemove(record.key)}
          update
          remove
        />
      ),
    },
  ];

  return (
    <>
      <Breadcrumb className="breadcrumb-title">
        <Breadcrumb.Item>Categorias</Breadcrumb.Item>
      </Breadcrumb>
      <Card style={{ marginBottom: 8 }}>
        <span
          className="ant-form-item-label"
          style={{ fontWeight: 700, marginRight: 4 }}>
          Nueva Categoria :
        </span>
        <Input
          style={{ width: '40%' }}
          value={categoryName}
          onChange={e => setCategoryName(e.target.value)}
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

      <Table loading={loading} columns={columns} dataSource={categories} />
    </>
  );
};

export default Categories;
