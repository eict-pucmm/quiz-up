import React, { Fragment, Component } from 'react';
import {
  Breadcrumb,
  Card,
  Empty,
  Button,
  notification,
  Input,
  Table,
  Select,
  InputNumber,
} from 'antd';

const { Option } = Select;

class Questions extends Component {
  state = {
    questions: [],
    questionName: '',
    questionCategories: [
      { label: 'Apple', value: 'Apple' },
      { label: 'Pear', value: 'Pear' },
      { label: 'Orange', value: 'Orange', disabled: false },
    ],
    savingQuestion: false,
    loading: true,
  };

  handleNameChange = event => {
    this.setState({ questionName: event.target.value });
  };

  handleValueChange = event => {
    this.setState({ questionValue: event.target.value });
  };

  render() {
    const { questions, questionName, questionCategories, loading } = this.state;

    const columns = [
      {
        title: 'Pregunta',
        dataIndex: 'name',
        key: 'categoria',
        render: text => <p>{text}</p>,
      },
      {
        title: 'Categorias',
        key: 'preguntas',
        render: () => (
          <span>
            <p>Preguntas</p>
          </span>
        ),
      },
      {
        title: 'Action',
        key: 'action',
        render: record => (
          <span
            style={{
              cursor: 'pointer',
              color: 'blue',
              textDecoration: 'underline',
            }}
          >
            <span onClick={() => this.onRemove(record.key)}>Borrar</span>
          </span>
        ),
      },
    ];

    return (
      <Fragment>
        <Breadcrumb className="breadcrumb-title">
          <Breadcrumb.Item>Questions</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ marginBottom: 8 }}>
          <div style={{ marginBottom: 8 }}>
            <span
              className="ant-form-item-label"
              style={{ fontWeight: 700, marginRight: 4 }}
            >
              Nueva Pregunta :
            </span>
            <Input
              style={{ width: '60%' }}
              value={questionName}
              onChange={this.handleNameChange}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <span
              className="ant-form-item-label"
              style={{ fontWeight: 700, marginRight: 4 }}
            >
              Categorias de la Pregunta :
            </span>

            <Select
              style={{ width: '50%' }}
              mode="multiple"
              placeholder="Please select favourite colors"
            >
              {questionCategories.map(({ label, value }) => (
                <Option value={label} key={value}>
                  {label}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <span
              className="ant-form-item-label"
              style={{ fontWeight: 700, marginRight: 4 }}
            >
              Valor de la Pregunta :
            </span>

            <InputNumber
              min={1}
              max={500}
              defaultValue={1}
              // onChange={this.handleValueChange}
            />
          </div>

          <Button key="submit">Agregar</Button>
        </div>

        <div className="outer-categories-card">
          <Table loading={loading} columns={columns} dataSource={questions} />
        </div>
      </Fragment>
    );
  }
}

export default Questions;
