import React, { useEffect, useState } from 'react';
import { Breadcrumb, notification, Table, Form } from 'antd';

import { COLUMNS } from './Columns';
import QuestionsForm from '../../components/FormQuestions';
import CollapsableFormWrapper from '../../components/CollapsableFormWrapper';
import { getCategories } from '../../api/categories';
import {
  getQuestionById,
  getQuestions,
  removeQuestion,
  saveQuestion,
  updateQuestion,
} from '../../api/questions';

const Questions = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionName, setQuestionName] = useState('');
  const [questionCategories, setQuestionCategories] = useState([]);
  const [questionValue, setQuestionValue] = useState(100);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nameChanged, setNameChanged] = useState(false);
  const [id, setId] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    const get = async () => {
      const { data } = await getQuestions();
      const questions = data.map(el => ({ ...el, key: el._id }));
      const { data: d } = await getCategories();
      const categories = d.map(el => ({ ...el, key: el._id }));

      setQuestions(questions);
      setAllCategories(categories);
      setLoading(false);
    };

    if (!saving) get();
  }, [saving]);

  const onRemove = async key => {
    setLoading(true);
    setSaving(true);
    const { error } = await removeQuestion(key);
    if (!error) {
      notification['success']({
        message: 'La pregunta ha sido removida con exito',
      });
      setSaving(false);
      setLoading(false);
    }
  };

  const onUpdate = async key => {
    setLoading(true);
    setEditing(true);
    setId(key);

    const { data } = await getQuestionById(key);
    setQuestionName(data.name);
    // setQuestionValue(data.points);
    handleValueChange(data.points);
    //fill categories dropdown
    handleSelect(data.categories);
    setLoading(false);
  };

  const clearAndReturn = error => {
    setEditing(false);
    setSaving(false);
    if (error) {
      return notification['error']({
        message:
          '¡Oh no! Ha ocurrido un error con el servidor. Favor comunicarse con su administrador.',
      });
    }

    form.resetFields();
    setQuestionName('');
    setQuestionCategories([]);
    setQuestionValue(100);
    setNameChanged(false);

    return notification['success']({
      message: `La pregunta ha sido ${
        editing ? 'actualizada' : 'creada'
      } con exito`,
    });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSaving(true);

    const QUESTION = {
      name: questionName,
      categories: questionCategories,
      points: questionValue,
    };

    if (editing) {
      if (!nameChanged) delete QUESTION.name;
      const { error } = await updateQuestion(id, { ...QUESTION });
      return clearAndReturn(error);
    }

    const { error } = await saveQuestion({ ...QUESTION });

    return clearAndReturn(error);
  };

  const cancelUpdate = e => {
    e.preventDefault();
    setEditing(false);

    form.resetFields();
    setQuestionName('');
    setNameChanged(false);
    setQuestionCategories([]);
    setQuestionValue(100);
  };

  const handleSelect = value => {
    form.setFieldsValue({ categories: value });
    setQuestionCategories(value);
  };

  const handleNameChange = e => {
    if (editing) setNameChanged(true);
    setQuestionName(e.target.value);
  };

  const handleValueChange = value => {
    form.setFieldsValue({ points: value });
    setQuestionValue(value);
  };

  return (
    <>
      <Breadcrumb className="breadcrumb-title">
        <Breadcrumb.Item>Preguntas</Breadcrumb.Item>
      </Breadcrumb>
      <CollapsableFormWrapper header={'Agregar una pregunta'}>
        <QuestionsForm
          form={form}
          editing={editing}
          cancelUpdate={cancelUpdate}
          questionName={questionName}
          allCategories={allCategories}
          handleNameChange={handleNameChange}
          handleValueChange={handleValueChange}
          onSelectChange={handleSelect}
          onSubmit={onSubmit}
        />
      </CollapsableFormWrapper>
      <Table
        loading={loading}
        columns={COLUMNS({ onRemove, onUpdate })}
        dataSource={questions}
      />
    </>
  );
};

export default Questions;
