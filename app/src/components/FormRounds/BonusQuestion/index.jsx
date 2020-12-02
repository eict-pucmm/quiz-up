import React, { useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { getBonusQuestions } from '../../../api/questions';
import { SHARED_PROPS } from '../';
import { addRound } from '../../../state/actions';
import { useStateValue } from '../../../state';

const { Option } = Select;

const QuestionBank = () => {
  const {
    dispatch,
    state: { roundToAdd },
  } = useStateValue();
  const { bonusQuestion } = roundToAdd;
  console.log(bonusQuestion);
  const [gettingQuestions, setGettingQuestions] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {}, [dispatch]);

  const onFocus = async () => {
    setGettingQuestions(true);
    const { data } = await getBonusQuestions();
    setQuestions(data || []);
    setGettingQuestions(false);
  };

  const onSelect = value => {
    dispatch(addRound({ bonusQuestion: value }));
  };

  const onBlur = () => {
    setQuestions([]);
  };

  return (
    <Form.Item label="Ultima Pregunta - Bono">
      <Select
        {...SHARED_PROPS}
        mode="single"
        onFocus={() => onFocus()}
        onSelect={v => onSelect(v)}
        onBlur={onBlur}
        loading={gettingQuestions}
        value={
          bonusQuestion && bonusQuestion.name && bonusQuestion.name !== ''
            ? bonusQuestion.name
            : undefined
        }
        placeholder="Pregunta - Bono">
        {/*TODO: make request with all question of X category and populate dropdown with that*/}
        {questions.map(({ name, _id }) => (
          <Option value={_id} key={_id}>
            {name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default QuestionBank;
