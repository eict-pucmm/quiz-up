import React, { useEffect, useState } from 'react';
import { Breadcrumb, notification, Table, Form } from 'antd';

import FormAdmins from '../../components/FormAdmins';
import CollapsableFormWrapper from '../../components/CollapsableFormWrapper';
import { COLUMNS } from './columns';
import { useStateValue } from '../../state';
import { clearAdminForm, setAdmins } from '../../state/actions';
import { getAdmins, removeAdmin, saveAdmin } from '../../api/admins';
import { auth } from '../../constants/firebase';

const Admins = () => {
  const { state, dispatch } = useStateValue();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  const { saving, data } = state.admins;

  useEffect(() => {
    const get = async () => {
      const { data } = await getAdmins();
      const admins = data.map(el => ({ ...el, key: el._id }));

      dispatch(setAdmins({ data: admins || [] }));
      setLoading(false);
    };

    if (!saving) get();
  }, [saving, dispatch]);

  const onRemove = async key => {
    dispatch(setAdmins({ saving: true }));
    const { error } = await removeAdmin(key);

    if (!error) {
      notification['success']({
        message: 'La pregunta ha sido removida con éxito',
      });
    }

    dispatch(setAdmins({ saving: false }));
  };

  const fieldWithError = () => {
    const { firstName, lastName, confirmPassword } = state.adminToAdd;
    return (
      Object.entries(state.adminToAdd).find(
        ([key, value]) => key.includes('error') && value
      ) ||
      !firstName ||
      !lastName ||
      !confirmPassword ||
      false
    );
  };

  const onSubmit = async e => {
    e.preventDefault();

    if (fieldWithError()) {
      return notification['error']({
        message: 'Por favor revise los datos del formulario.',
      });
    }

    setLoading(true);
    dispatch(setAdmins({ saving: true }));

    const { email, password, ...info } = state.adminToAdd;
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const { error } = await saveAdmin({ ...info, firebaseUID: user.uid });

      if (error) {
        return notification['error']({
          message:
            '¡Oh no! Ha ocurrido un error con el servidor. Favor comunicarse con su administrador.',
        });
      }

      form.resetFields();
      dispatch(clearAdminForm());

      return notification['success']({
        message: 'El administrador ha sido creado con éxito',
      });
    } catch (error) {
      const message =
        '¡Oh no! Ha ocurrido un error con el servidor. Favor comunicarse con su administrador.';
      const messages = {
        'auth/email-already-in-use':
          'Favor introducir un correo que este disponible',
        'auth/invalid-email': 'Favor introducir un correo valido',
        'auth/weak-password': 'Favor introducir una clave más segura',
      };
      return notification['error']({
        message: messages[error.code] || message,
      });
    } finally {
      dispatch(setAdmins({ saving: false }));
    }
  };

  return (
    <>
      <Breadcrumb className="breadcrumb-title">
        <Breadcrumb.Item>Administradores</Breadcrumb.Item>
      </Breadcrumb>
      <CollapsableFormWrapper header={'Agregar un administrador'}>
        <FormAdmins form={form} onSubmit={onSubmit} />
      </CollapsableFormWrapper>
      <Table
        loading={loading}
        columns={COLUMNS({ onRemove })}
        dataSource={data}
      />
    </>
  );
};

export default Admins;
