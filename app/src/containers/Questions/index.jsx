import React, { useEffect, useState } from 'react';
import { Breadcrumb, notification, Table, Form } from 'antd';

import QuestionsForm from '../../components/FormQuestions';
import CollapsableFormWrapper from '../../components/CollapsableFormWrapper';
import { COLUMNS } from './Columns';
import { getCategories } from '../../api/categories';
import { useStateValue } from '../../state';
import {
  getQuestionById,
  getQuestions,
  removeQuestion,
  saveQuestion,
  updateQuestion,
} from '../../api/questions';
import {
  addQuestion,
  clearQuestionForm,
  setQuestionsAttributes,
} from '../../state/actions';

const Questions = () => {
  const { state, dispatch } = useStateValue();
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState('');
  const [form] = Form.useForm();

  const { saving, data, editing, nameChanged } = state.questions;

  useEffect(() => {
    const get = async () => {
      const { data } = await getQuestions();
      const questions = data.map(el => ({ ...el, key: el._id }));
      const { data: d } = await getCategories();
      const categories = d.map(el => ({ ...el, key: el._id }));

      dispatch(
        setQuestionsAttributes({
          data: questions || [],
          allCategories: categories || [],
        })
      );
      setLoading(false);
    };

    if (!saving) get();
  }, [saving, dispatch]);

  const onRemove = async key => {
    dispatch(setQuestionsAttributes({ saving: true }));
    const { error } = await removeQuestion(key);
    if (!error) {
      notification['success']({
        message: 'La pregunta ha sido removida con exito',
      });
    }
    dispatch(setQuestionsAttributes({ saving: false }));
  };

  const onUpdate = async key => {
    setId(key);
    setLoading(true);
    dispatch(setQuestionsAttributes({ editing: true }));

    const { data } = await getQuestionById(key);
    dispatch(
      addQuestion({
        name: data.name,
        points: data.points,
        categories: data.categories,
      })
    );
    form.setFieldsValue({ categories: data.categories, points: data.points });
    setLoading(false);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const { errorName, errorPoints, categories } = state.questionToAdd;
    if (errorName || errorPoints || categories.length === 0) {
      dispatch(addQuestion({ errorCategories: categories.length === 0 }));
      return notification['error']({
        message: 'Por favor revise los datos del formulario.',
      });
    }

    setLoading(true);
    dispatch(setQuestionsAttributes({ saving: true }));

    const QUESTION = { ...state.questionToAdd };

    if (editing) {
      if (!nameChanged) delete QUESTION.name;
      const { error } = await updateQuestion(id, { ...QUESTION });
      return clearAndReturn(error);
    }

    const { error } = await saveQuestion({ ...QUESTION });

    return clearAndReturn(error);
  };

  const clearAndReturn = error => {
    if (error) {
      return notification['error']({
        message:
          '¡Oh no! Ha ocurrido un error con el servidor. Favor comunicarse con su administrador.',
      });
    }

    form.resetFields();
    dispatch(
      setQuestionsAttributes({
        editing: false,
        saving: false,
        nameChanged: false,
      })
    );
    dispatch(clearQuestionForm());

    return notification['success']({
      message: `La pregunta ha sido ${
        editing ? 'actualizada' : 'creada'
      } con exito`,
    });
  };

  const cancelUpdate = e => {
    e.preventDefault();
    form.resetFields();
    dispatch(clearQuestionForm());
    dispatch(setQuestionsAttributes({ editing: false, nameChanged: false }));
  };

  return (
    <>
      <Breadcrumb className="breadcrumb-title">
        <Breadcrumb.Item>Preguntas</Breadcrumb.Item>
      </Breadcrumb>
      <CollapsableFormWrapper header={'Agregar una pregunta'}>
        <QuestionsForm
          form={form}
          cancelUpdate={cancelUpdate}
          onSubmit={onSubmit}
        />
      </CollapsableFormWrapper>
      <Table
        loading={loading}
        columns={COLUMNS({ onRemove, onUpdate })}
        dataSource={data}
      />
    </>
  );
};

export default Questions;
