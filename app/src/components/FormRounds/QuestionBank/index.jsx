import React, { useState, useEffect } from 'react';
import { Form, Select, Collapse, Button, message } from 'antd';
import { BankOutlined } from '@ant-design/icons';

import { SHARED_PROPS } from '../';
import { useStateValue } from '../../../state';
import {
  generateQuestionBank,
  getQuestionByCatAndPoints,
} from '../../../api/questions';
import { addRound } from '../../../state/actions';

const { Panel } = Collapse;
const { Option } = Select;

const QuestionBank = () => {
  const {
    dispatch,
    state: { roundToAdd },
  } = useStateValue();
  const { categories, questionBank, finished } = roundToAdd;
  const [loading, setLoading] = useState(false);
  const [gettingQuestions, setGettingQuestions] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (Object.keys(questionBank).length === 0) {
      dispatch(
        addRound({
          questionBank: {
            [categories[0]]: [],
            [categories[1]]: [],
            [categories[2]]: [],
            [categories[3]]: [],
          },
        })
      );
    }
  }, [questionBank, categories, dispatch]);

  useEffect(() => {
    if (
      roundToAdd.questions &&
      roundToAdd.questions.length > 0 &&
      questionBank &&
      Object.keys(questionBank).length === 4
    ) {
      roundToAdd.questions.forEach(el => {
        if (questionBank[el.categorySelected].length === 5) {
          return;
        }
        questionBank[el.categorySelected].push({
          name: el.question.name,
          category: el.question.categories,
          points: el.question.points,
          categorySelected: el.categorySelected,
          _id: el.question._id,
        });
        dispatch(addRound({ questionBank }));
      });
    }
  }, [dispatch, roundToAdd.questions, questionBank]);

  const callQuestionBank = async () => {
    setLoading(true);
    const { data } = await generateQuestionBank(categories);
    dispatch(addRound({ questionBank: data || [] }));
    setLoading(false);
    message.success('Banco de preguntas agregado con éxito');
  };

  const onFocus = async (category, points) => {
    setGettingQuestions(true);
    const { data } = await getQuestionByCatAndPoints(category, points);
    setQuestions(data || []);
    setGettingQuestions(false);
  };

  const onSelect = (value, category, position) => {
    setQuestions([]);

    if (
      questionBank[category][position].name &&
      questionBank[category][position]._id
    ) {
      questionBank[category][position].name = value[0];
      questionBank[category][position]._id = value[1];
    }

    dispatch(addRound({ questionBank: { ...questionBank } }));
  };

  const onBlur = () => {
    setQuestions([]);
  };

  return (
    <>
      <Button
        loading={loading}
        className="mb-15"
        onClick={callQuestionBank}
        disabled={finished}>
        <BankOutlined />
        Generar banco de preguntas
      </Button>
      <Collapse className="form-collapse-container" accordion>
        {categories.map(category => (
          <Panel header={category} key={category}>
            {[100, 200, 300, 400, 500].map((points, i) => (
              <Form.Item key={points} label={`Pregunta de ${points} puntos`}>
                <Select
                  {...SHARED_PROPS}
                  disabled={finished}
                  loading={gettingQuestions}
                  mode="single"
                  onFocus={() => onFocus(category, points)}
                  onSelect={v => onSelect(v, category, i)}
                  onBlur={onBlur}
                  placeholder={`Pregunta de ${points} puntos`}
                  value={
                    Object.keys(questionBank).length > 0
                      ? questionBank[category][i]?.name || undefined
                      : undefined
                  }>
                  {questions.map(({ name, _id }) => (
                    <Option value={[name, _id]} key={_id}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ))}
          </Panel>
        ))}
      </Collapse>
    </>
  );
};

export default QuestionBank;
