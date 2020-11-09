import React from 'react';
import { Form, Select } from 'antd';

import { SHARED_PROPS } from '../';

const { Option } = Select;

const QuestionBank = () => {
  return (
    <Form.Item label="Ultima Pregunta - Bono">
      <Select {...SHARED_PROPS} mode="single" placeholder="Pregunta - Bono">
        {/*TODO: make request with all question of X category and populate dropdown with that*/}
        {[{ name: 'preg 1', _id: 1 }].map(({ name, _id }) => (
          <Option value={_id} key={_id}>
            {name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default QuestionBank;
