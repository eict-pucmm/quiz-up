import React, { useEffect, useState } from 'react';
import { Breadcrumb, notification, Table, Form, Radio } from 'antd';

import QuestionsForm from '../../components/FormQuestions';
import BonusQuestionsForm from '../../components/FormBonusQuestion';
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
  getBonusQuestions,
} from '../../api/questions';
import {
  addQuestion,
  clearQuestionForm,
  setQuestionsAttributes,
} from '../../state/actions';

const Questions = () => {
  const { state, dispatch } = useStateValue();
  const [loading, setLoading] = useState(true);
  const [isBonus, SetIsBonus] = useState(false);
  const [isBonusTable, SetIsBonusTable] = useState(false);
  const [id, setId] = useState('');
  const [form] = Form.useForm();
  const questionOptions = [
    { label: 'Pregunta', value: false },
    { label: 'Bono', value: true },
  ];
  const tablesOptions = [
    { label: 'Ver preguntas con categorias', value: false },
    { label: 'Ver preguntas para rondas de bonos', value: true },
  ];

  const { saving, data, editing, nameChanged } = state.questions;

  const onChangeRB = e => {
    SetIsBonus(e.target.value);
  };

  const onChangeRBTable = e => {
    SetIsBonusTable(e.target.value);
  };

  useEffect(() => {
    const get = async () => {
      setLoading(true);
      const { data } = isBonusTable
        ? await getBonusQuestions()
        : await getQuestions();
      const questions = (data || []).map(el => ({ ...el, key: el._id }));
      const { data: d } = await getCategories();
      const categories = (d || []).map(el => ({ ...el, key: el._id }));

      dispatch(
        setQuestionsAttributes({
          data: questions || [],
          allCategories: categories || [],
        })
      );
      setLoading(false);
    };

    if (!saving) get();
  }, [saving, dispatch, isBonusTable]);

  const onRemove = async key => {
    dispatch(setQuestionsAttributes({ saving: true }));
    const { error } = await removeQuestion(key);
    if (!error) {
      notification['success']({
        message: 'La pregunta ha sido removida con éxito',
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

    if (isBonus) {
      console.log('ADWQNO><><><><');
      dispatch(
        addQuestion({
          points: 100,
          errorCategories: false,
        })
      );
    }

    if (errorName || errorPoints || (categories.length === 0 && !isBonus)) {
      dispatch(addQuestion({ errorCategories: categories.length === 0 }));
      return notification['error']({
        message: 'Por favor revise los datos del formulario.',
      });
    }

    setLoading(true);
    dispatch(setQuestionsAttributes({ saving: true }));

    const QUESTION = { ...state.questionToAdd, isBonus };

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
      } con éxito`,
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
        <Radio.Group
          options={questionOptions}
          onChange={onChangeRB}
          value={isBonus}
          optionType="button"
          buttonStyle="solid"
        />

        {isBonus ? (
          <BonusQuestionsForm
            form={form}
            cancelUpdate={cancelUpdate}
            onSubmit={onSubmit}
          />
        ) : (
          <QuestionsForm
            form={form}
            cancelUpdate={cancelUpdate}
            onSubmit={onSubmit}
          />
        )}
      </CollapsableFormWrapper>

      <Radio.Group
        options={tablesOptions}
        onChange={onChangeRBTable}
        value={isBonusTable}
        optionType="button"
        buttonStyle="solid"
      />
      <Table
        loading={loading}
        columns={COLUMNS({ onRemove, onUpdate })}
        dataSource={data}
      />
    </>
  );
};

export default Questions;
