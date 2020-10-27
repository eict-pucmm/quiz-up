import React, { useEffect, useState } from 'react';
import { Breadcrumb, notification, Table, Tag, Form } from 'antd';

import QuestionsForm from '../../components/FormQuestions';
import CollapsableFormWrapper from '../../components/CollapsableFormWrapper';
import ActionButtons from '../../components/ActionButtons';
import { getCategories } from '../../api/categories';
import {
  getQuestions,
  removeQuestion,
  saveQuestion,
} from '../../api/questions';

const Questions = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionName, setQuestionName] = useState('');
  const [questionCategories, setQuestionCategories] = useState([]);
  const [questionValue, setQuestionValue] = useState(100);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
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
        message: 'La pregunta ha sido borrada con exito',
      });
      setSaving(false);
      setLoading(true);
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSaving(true);

    const { error } = await saveQuestion({
      name: questionName,
      categories: questionCategories,
      points: questionValue,
    });

    setLoading(false);
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
    notification['success']({
      message: 'La pregunta ha sido creada con exito',
    });
  };

  const columns = [
    {
      title: 'Pregunta',
      dataIndex: 'name',
      key: 'pregunta',
    },
    {
      title: 'Categorías',
      dataIndex: 'categories',
      key: 'categories',
      render: text => (
        <>
          {text.map(category => (
            <Tag color="blue" key={category}>
              {category}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Valor',
      dataIndex: 'points',
      key: 'points',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.points - b.points,
    },
    {
      title: 'Acción',
      key: 'action',
      render: record => (
        <ActionButtons
          onUpdate={() => {
            /*TODO: add function to update */
          }}
          onRemove={() => onRemove(record.key)}
          update
          remove
        />
      ),
    },
  ];

  const handleSelect = value => {
    form.setFieldsValue({
      categories: value,
    });

    setQuestionCategories(value);
  };

  return (
    <>
      <Breadcrumb className="breadcrumb-title">
        <Breadcrumb.Item>Preguntas</Breadcrumb.Item>
      </Breadcrumb>
      <CollapsableFormWrapper header={'Agregar una pregunta'}>
        <QuestionsForm
          form={form}
          questionName={questionName}
          allCategories={allCategories}
          handleNameChange={e => setQuestionName(e.target.value)}
          handleValueChange={value => setQuestionValue(value)}
          onSelectChange={handleSelect}
          onSubmit={onSubmit}
        />
      </CollapsableFormWrapper>
      <Table loading={loading} columns={columns} dataSource={questions} />
    </>
  );
};

export default Questions;
