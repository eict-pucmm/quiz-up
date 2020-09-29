import React, { Fragment, Component } from 'react';
import {
  Breadcrumb,
  Button,
  notification,
  Input,
  Table,
  Select,
  InputNumber,
  Tag,
  Form,
} from 'antd';
import { URL_QUESTIONS, URL_CATEGORIES } from '../../config/urls';
import axios from 'axios';

const { Option } = Select;

class Questions extends Component {
  state = {
    allCategories: [
      { name: 'Sirugias' },
      { name: 'Farmacologia' },
      { name: 'Oftalmologia' },
    ],
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
            const categories = data.categories.map(el => ({
              ...el,
              key: el._id,
            }));
            setTimeout(
              () => this.setState({ allCategories: categories }),
              1000
            );
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
      .post(`${URL_QUESTIONS}/`, {
        name: this.state.questionName,
        categories: this.state.questionCategories,
        points: this.state.questionValue,
      })
      .then(({ data }) => {
        this.setState({
          questionName: '',
          questionCategories: [],
          savingQuestion: false,
          loading: false,
          questionValues: 100,
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

  onSelectChange = value => {
    this.setState({ questionCategories: value });
  };

  handleNameChange = event => {
    this.setState({ questionName: event.target.value });
  };

  handleValueChange = value => {
    this.setState({ questionValue: value });
  };

  render() {
    const { allCategories, questions, questionName, loading } = this.state;

    const columns = [
      {
        title: 'Pregunta',
        dataIndex: 'name',
        key: 'pregunta',
        render: text => <p>{text}</p>,
      },
      {
        title: 'Categorías',
        dataIndex: 'categories',
        key: 'categories',
        render: text => (
          <>
            {text.map(cualquiera => (
              <Tag color="blue" key={cualquiera}>
                {cualquiera}
              </Tag>
            ))}
          </>
        ),
      },
      {
        title: 'Acción',
        key: 'action',
        render: record => (
          <Button danger type="text" onClick={() => this.onRemove(record.key)}>
            Remover
          </Button>
        ),
      },
    ];

    return (
      <Fragment>
        <Breadcrumb className="breadcrumb-title">
          <Breadcrumb.Item>Questions</Breadcrumb.Item>
        </Breadcrumb>
        <Form
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}>
          <Form.Item label="Agregar una pregunta" />
          <Form.Item label="Nueva Pregunta:">
            <Input value={questionName} onChange={this.handleNameChange} />
          </Form.Item>
          <Form.Item label="Categorias">
            <Select mode="multiple" onChange={this.onSelectChange}>
              {allCategories.map(({ name }) => (
                <Option value={name} key={name}>
                  {name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Valor en puntos: ">
            <InputNumber
              min={100}
              max={500}
              step={100}
              defaultValue={100}
              onChange={this.handleValueChange}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
            <Button key="submit" type="primary" onClick={this.onSubmit}>
              Agregar
            </Button>
          </Form.Item>
        </Form>

        <div className="outer-categories-card">
          <Table loading={loading} columns={columns} dataSource={questions} />
        </div>
      </Fragment>
    );
  }
}

export default Questions;
