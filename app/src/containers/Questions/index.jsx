import React, { Fragment, Component } from 'react';
import { Breadcrumb, notification, Table, Tag } from 'antd';
import axios from 'axios';

import { URL_QUESTIONS, URL_CATEGORIES } from '../../config/urls';
import QuestionsForm from '../../components/FormQuestions';
import CollapsableFormWrapper from '../../components/CollapsableFormWrapper';
import ActionButtons from '../../components/ActionButtons';

class Questions extends Component {
  state = {
    allCategories: [],
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
      .catch(() => {
        notification['error']({
          message:
            '¡Oh no! Ha ocurrido un error con el servidor. Favor comunicarse con su administrador.',
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

    //TODO: add points column
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
            {text.map(category => (
              <Tag color="blue" key={category}>
                {category}
              </Tag>
            ))}
          </>
        ),
      },
      {
        title: 'Acción',
        key: 'action',
        render: record => (
          <ActionButtons
            onUpdate={() => {
              /*TODO: add function to update */
            }}
            onRemove={() => this.onRemove(record.key)}
            update
            remove
          />
        ),
      },
    ];

    return (
      <Fragment>
        <Breadcrumb className="breadcrumb-title">
          <Breadcrumb.Item>Preguntas</Breadcrumb.Item>
        </Breadcrumb>
        <CollapsableFormWrapper header={'Agregar una pregunta'}>
          <QuestionsForm
            questionName={questionName}
            allCategories={allCategories}
            handleNameChange={this.handleNameChange}
            handleValueChange={this.handleValueChange}
            onSelectChange={this.onSelectChange}
            onSubmit={this.onSubmit}
          />
        </CollapsableFormWrapper>
        <Table loading={loading} columns={columns} dataSource={questions} />
      </Fragment>
    );
  }
}

export default Questions;
