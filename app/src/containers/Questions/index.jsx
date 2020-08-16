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
import { URL_QUESTIONS, URL_CATEGORIES } from '../../config/urls';
import axios from 'axios';

const { Option } = Select;

class Questions extends Component {
  categories = [
    { label: 'Sirugias', value: 'Sirugias' },
    { label: 'Farmacologia', value: 'Farmacologia' },
    { label: 'Oftalmologia', value: 'Oftalmologia' },
  ];

  state = {
    questions: [],
    questionName: '',
    questionCategories: [],
    questionValue: '',
    savingQuestion: false,
    loading: true,
  };

  componentDidMount() {
    this.getQuestions();
  }

  componentDidUpdate(_, prevState) {
    if (prevState.savingQuestion !== this.state.savingQuestion) {
      this.getQuestions();
    }
  }

  getQuestions = () => {
    axios
      .get(URL_QUESTIONS)
      .then(({ data }) => {
        const questions = data.questions.map(el => ({ ...el, key: el._id }));
        setTimeout(() => this.setState({ questions, loading: false }), 1000);
        axios
          .get(URL_CATEGORIES)
          .then(({ data }) => {
            console.log('categories: ', data);
            const categories = data.categories.map(el => ({
              ...el,
              key: el._id,
            }));
            setTimeout(() => (this.categories = categories), 1000);
          })
          .catch(({ response }) => {
            console.log(response);
          });
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };

  onRemove = key => {
    this.setState({ savingQuestion: true, loading: true });
    axios
      .delete(`${URL_QUESTIONS}/${key}`, { id: key })
      .then(() => {
        this.setState({
          savingQuestion: false,
          loading: false,
        });
        notification['success']({
          message: 'La pregunta ha sido borrada con exito',
        });
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };

  onSubmit = () => {
    this.setState({ savingQuestion: true, loading: true });
    axios
      .post(`${URL_QUESTIONS}/`, { ...this.state })
      .then(({ data }) => {
        console.log(data);
        this.setState({
          questionName: '',
          questionCategories: [],
          savingQuestion: false,
          loading: false,
        });
        notification['success']({
          message: 'La pregunta ha sido creada con exito',
        });
      })
      .catch(({ response }) => {
        notification['error']({
          message: response.data,
        });
      });
  };

  onSelectChange = event => {
    this.setState({ questionCategories: event });
  };

  handleNameChange = event => {
    this.setState({ questionName: event.target.value });
  };

  handleValueChange = event => {
    this.setState({ questionValue: event });
  };

  render() {
    const { questions, questionName, questionCategories, loading } = this.state;

    const columns = [
      {
        title: 'Pregunta',
        dataIndex: 'name',
        key: 'pregunta',
        render: text => <p>{text}</p>,
      },
      {
        title: 'Categorias',
        key: 'categoria',
        render: () => (
          <span>
            <p>Categorias</p>
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
              onChange={this.onSelectChange}
            >
              {this.categories.map(({ label, value }) => (
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
              onChange={this.handleValueChange}
            />
          </div>

          <Button key="submit" onClick={this.onSubmit}>
            Agregar
          </Button>
        </div>

        <div className="outer-categories-card">
          <Table loading={loading} columns={columns} dataSource={questions} />
        </div>
      </Fragment>
    );
  }
}

export default Questions;
