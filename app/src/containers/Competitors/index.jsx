import React, { Component } from 'react';
import { Breadcrumb, Button, notification, Input, Table } from 'antd';
import axios from 'axios';

import { URL_COMPETITORS } from '../../config/urls';
import CustomDropdown from '../../components/CustomDropdown';

class Competitors extends Component {
  state = {
    competitors: [],
    competitor: {
      fullName: '',
      residence: '',
    },
    saving: false,
    loading: true,
  };

  componentDidMount() {
    this.getCompetitors();
  }

  componentDidUpdate(_, prevState) {
    if (prevState.saving !== this.state.saving) {
      this.getCompetitors();
    }
  }

  getCompetitors = () => {
    axios
      .get(`${URL_COMPETITORS}/`)
      .then(({ data }) => {
        const competitors = data.competitors.map(el => ({
          ...el,
          key: el._id,
        }));
        setTimeout(() => this.setState({ competitors, loading: false }), 1000);
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({ competitor: { ...this.state.competitor, [name]: value } });
  };

  onSubmit = () => {
    this.setState({ saving: true, loading: true });
    axios
      .post(`${URL_COMPETITORS}/`, { ...this.state.competitor })
      .then(() => {
        this.setState({
          competitor: { fullName: '', residence: '' },
          saving: false,
          loading: false,
        });
        notification['success']({
          message: 'El competidor ha sido creada con exito',
        });
      })
      .catch(({ response }) => {
        this.setState({ saving: false });
        notification['error']({
          message: response.data,
        });
      });
  };

  render() {
    const columns = [
      {
        title: 'Competidores',
        dataIndex: 'fullName',
        key: 'competidor',
        width: 200,
        render: text => <p>{text}</p>,
      },
      {
        title: 'Residencia',
        dataIndex: 'residence',
        key: 'residencia',
        width: 100,
        render: text => <p>{text}</p>,
      },
    ];
    const { competitors, competitor, loading } = this.state;

    return (
      <>
        <Breadcrumb className="breadcrumb-title">
          <Breadcrumb.Item>Competidores</Breadcrumb.Item>
        </Breadcrumb>
        <span
          className="ant-form-item-label"
          style={{ fontWeight: 700, margin: 8, marginLeft: 0 }}
        >
          Nuevo competidor:
        </span>
        <div style={{ marginBottom: 8 }}>
          <span className="ant-form-item-label">Nombre completo: </span>
          <Input
            name="fullName"
            style={{ width: '60%' }}
            value={competitor.fullName}
            onChange={this.handleChange}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <span className="ant-form-item-label">Residencia: </span>
          {/* <Input
            name="residence"
            style={{ width: '40%' }}
            value={competitor.residence}
            onChange={this.handleChange}
          /> */}
          <CustomDropdown />

          <Button key="submit" onClick={this.onSubmit}>
            Agregar
          </Button>
        </div>

        <div className="outer-categories-card">
          <Table
            loading={loading}
            columns={columns}
            dataSource={competitors}
            pagination={{ pageSize: 6 }}
            scroll={{ y: 400 }}
          />
        </div>
      </>
    );
  }
}

export default Competitors;
