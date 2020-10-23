import React, { Fragment, Component } from 'react';
import { Breadcrumb, Button, notification, Input, Table, Card } from 'antd';
import axios from 'axios';

import { URL_CATEGORIES } from '../../config/urls';
import ActionButtons from '../../components/ActionButtons';

class Categories extends Component {
  state = {
    categories: [],
    categoryName: '',
    savingCategory: false,
    loading: true,
    editing: false,
    id: '',
  };

  componentDidMount() {
    this.getCategories();
  }

  componentDidUpdate(_, prevState) {
    if (prevState.savingCategory !== this.state.savingCategory) {
      this.getCategories();
    }
  }

  getCategories = () => {
    axios
      .get(URL_CATEGORIES)
      .then(({ data }) => {
        const categories = data.categories.map(el => ({ ...el, key: el._id }));
        setTimeout(() => this.setState({ categories, loading: false }), 1000);
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };

  onRemove = key => {
    this.setState({ savingCategory: true, loading: true });
    axios
      .delete(`${URL_CATEGORIES}/${key}`, { id: key })
      .then(() => {
        this.setState({
          savingCategory: false,
          loading: false,
        });
        notification['success']({
          message: 'La categoria ha sido borrada con exito',
        });
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };

  onUpdate = key => {
    this.setState({ loading: true, editing: true, id: key });
    axios
      .get(`${URL_CATEGORIES}/${key}`)
      .then(({ data }) => {
        this.setState({ categoryName: data.category.name, loading: false });
      })
      .catch(({ response }) => console.log(response));
  };

  handleChange = event => {
    this.setState({ categoryName: event.target.value });
  };

  cancelUpdate = e => {
    e.preventDefault();
    this.setState({ editing: false, categoryName: '' });
  };

  onSubmit = () => {
    this.setState({ savingCategory: true, loading: true });

    const success = () => {
      this.setState({
        categoryName: '',
        savingCategory: false,
        loading: false,
        editing: false,
      });
      notification['success']({
        message: `La categoria ha sido ${
          this.state.editing ? 'actualizada' : 'creada'
        } con exito`,
      });
    };

    if (this.state.editing) {
      axios
        .put(`${URL_CATEGORIES}/${this.state.id}`, {
          name: this.state.categoryName,
        })
        .then(() => success())
        .catch(() => {
          notification['error']({
            message: 'Error del servidor',
          });
        });
      return;
    }
    axios
      .post(`${URL_CATEGORIES}/`, { name: this.state.categoryName })
      .then(() => success())
      .catch(() => {
        notification['error']({
          message: 'Error del servidor',
        });
      });
  };

  render() {
    const { categories, categoryName, loading, editing } = this.state;

    const columns = [
      {
        title: 'Categorías',
        dataIndex: 'name',
        key: 'categoria',
        render: text => <p>{text}</p>,
      },
      {
        title: 'Acción',
        key: 'action',
        render: record => (
          <ActionButtons
            onUpdate={() => this.onUpdate(record.key)}
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
          <Breadcrumb.Item>Categorias</Breadcrumb.Item>
        </Breadcrumb>

        <Card style={{ marginBottom: 8 }}>
          <span
            className="ant-form-item-label"
            style={{ fontWeight: 700, marginRight: 4 }}>
            Nueva Categoria :
          </span>
          <Input
            style={{ width: '40%' }}
            value={categoryName}
            onChange={this.handleChange}
          />
          <Button key="submit" type="primary" onClick={this.onSubmit}>
            {editing ? 'Actualizar' : 'Agregar'}
          </Button>
          {editing && (
            <Button type="danger" onClick={this.cancelUpdate}>
              Cancelar
            </Button>
          )}
        </Card>

        <Table loading={loading} columns={columns} dataSource={categories} />
      </Fragment>
    );
  }
}

export default Categories;
