import React from 'react';
import { Form, Select, Collapse, Button } from 'antd';

import { SHARED_PROPS } from '../';
import { useStateValue } from '../../../state';

const { Panel } = Collapse;
const { Option } = Select;

const QuestionBank = () => {
  const {
    state: { roundToAdd },
  } = useStateValue();
  const { categories } = roundToAdd;

  return (
    <>
      <Button
        loading={false}
        className="mb-15"
        onClick={() => {
          /*TODO: add API call to the question bank generator */
        }}>
        Generar banco de preguntas
      </Button>
      <Collapse className="form-collapse-container">
        {categories.map(category => (
          <Panel header={category} key={category}>
            {[100, 200, 300, 400, 500].map(points => (
              <Form.Item key={points} label={`Pregunta de ${points} puntos`}>
                <Select
                  {...SHARED_PROPS}
                  mode="single"
                  placeholder={`Pregunta de ${points} puntos`}>
                  {/*TODO: make request with all question of X category and populate dropdown with that*/}
                  {[{ name: 'preg 1', _id: 1 }].map(({ name, _id }) => (
                    <Option value={_id} key={_id}>
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
