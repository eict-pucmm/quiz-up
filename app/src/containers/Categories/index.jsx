import React, { Fragment, Component } from "react";
import {
  Breadcrumb,
  Card,
  Empty,
  Button,
  notification,
  Input,
  Table
} from "antd";
import axios from "axios";

import { URL_CATEGORIES } from "../../config/urls";

const { Column, ColumnGroup } = Table;

class Categories extends Component {
  state = {
    categories: [],
    categoryName: "",
    savingCategory: false,
    loading: true
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
    // console.log("Key> >> >", key);
    // console.log("e> >> >", e);
    this.setState({ savingCategory: true, loading: true });
    axios
      .delete(`${URL_CATEGORIES}/${key}`, { id: key })
      .then(() => {
        this.setState({
          savingCategory: false,
          loading: false
        });
        notification["success"]({
          message: "La categoria ha sido borrada con exito"
        });
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };

  handleChange = event => {
    this.setState({ categoryName: event.target.value });
  };

  onSubmit = () => {
    this.setState({ savingCategory: true, loading: true });
    axios
      .post(`${URL_CATEGORIES}/`, { name: this.state.categoryName })
      .then(({ data }) => {
        this.setState({
          categoryName: "",
          savingCategory: false,
          loading: false
        });
        notification["success"]({
          message: "La categoria ha sido creada con exito"
        });
      })
      .catch(({ response }) => {
        notification["error"]({
          message: response.data
        });
      });
  };

  render() {
    const { categories, categoryName, loading } = this.state;

    const columns = [
      {
        title: "Categorias",
        dataIndex: "name",
        key: "categoria",
        render: text => <p>{text}</p>
      },
      {
        title: "Preguntas",
        key: "preguntas",
        render: () => (
          <span>
            <p>Preguntas</p>
          </span>
        )
      },
      {
        title: "Action",
        key: "action",
        render: record => (
          <span
            style={{
              cursor: "pointer",
              color: "blue",
              textDecoration: "underline"
            }}
          >
            <span onClick={() => this.onRemove(record.key)}>Borrar</span>
          </span>
        )
      }
    ];

    return (
      <Fragment>
        <Breadcrumb className="breadcrumb-title">
          <Breadcrumb.Item>Categorias</Breadcrumb.Item>
        </Breadcrumb>

        <div style={{ marginBottom: 8 }}>
          <span
            className="ant-form-item-label"
            style={{ fontWeight: 700, marginRight: 4 }}
          >
            Nueva Categoria :
          </span>
          <Input
            style={{ width: "60%" }}
            value={categoryName}
            onChange={this.handleChange}
          />
          <Button key="submit" onClick={this.onSubmit}>
            Agregar
          </Button>
        </div>

        <div className="outer-categories-card">
          <Table loading={loading} columns={columns} dataSource={categories} />
        </div>
      </Fragment>
    );
  }
}

export default Categories;

//findByIdandRem
