import React, { Fragment, Component } from 'react';
import {
  Breadcrumb,
  Button,
  notification,
  Input,
  Table,
  Select,
  Tag,
  Form,
} from 'antd';
import axios from 'axios';
import { URL_TEAMS, URL_RESIDENTS } from '../../config/urls';
import './styles.css';

const { Option } = Select;

class Teams extends Component {
  state = {
    teams: [],
    allResidents: [],
    teamName: '',
    teamResidents: [],
    teamMedicalCenter: '',
    savingTeam: false,
    loading: false,
  };

  componentDidMount() {
    this.getTeams();
  }

  componentDidUpdate(_, prevState) {
    if (prevState.savingTeam !== this.state.savingTeam) {
      this.getTeams();
    }
  }

  getTeams = () => {
    axios
      .get(`${URL_TEAMS}/`)
      .then(({ data }) => {
        const teams = data.teams.map(el => ({ ...el, key: el._id }));
        setTimeout(() => this.setState({ teams, loading: false }), 1000);
        axios
          .get(`${URL_RESIDENTS}/`)
          .then(({ data }) => {
            const residents = data.residents.map(el => ({
              ...el,
              key: el._id,
            }));
            setTimeout(() => this.setState({ allResidents: residents }));
          })
          .catch(({ response }) => console.log(response));
      })
      .catch(({ response }) => console.log(response));
  };

  handleNameChange = event => {
    this.setState({ teamName: event.target.value });
  };

  onSelectChange = value => {
    this.setState({ teamResidents: value });
  };

  handleMedChange = event => {
    this.setState({ teamMedicalCenter: event.target.value });
  };

  onRemove = key => {
    this.setState({ savingTeam: true, loading: true });
    axios
      .delete(`${URL_TEAMS}/${key}`, { id: key })
      .then(() => {
        this.setState({
          savingTeam: false,
          loading: false,
        });
        notification['success']({
          message: 'El equipo ha sido borrado con exito',
        });
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };

  onSubmit = () => {
    this.setState({ savingQuestion: true, loading: true });
    axios
      .post(`${URL_TEAMS}/`, {
        name: this.state.teamName,
        residents: this.state.teamResidents,
        medicalCenter: this.state.teamMedicalCenter,
      })
      .then(({ data }) => {
        this.setState({
          teamName: '',
          teamResidents: [],
          teamMedicalCenter: '',
          savingQuestion: false,
          loading: false,
        });
        notification['success']({
          message: 'El equipo ha sido creado con exito',
        });
      })
      .catch(({ response }) => {
        notification['error']({
          message: response.data,
        });
      });
  };

  render() {
    const {
      allResidents,
      teams,
      teamName,
      teamMedicalCenter,
      loading,
    } = this.state;

    const columns = [
      {
        title: 'Equipo',
        dataIndex: 'name',
        key: 'team',
        render: text => <p>{text}</p>,
      },
      {
        title: 'Residentes',
        dataIndex: 'residents',
        key: 'residents',
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
        title: 'Centro Medico',
        dataIndex: 'medicalCenter',
        key: 'medicalCenter',
        render: text => <p>{text}</p>,
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
          wrapperCol={{ span: 8 }}
        >
          <Form.Item label="Agregar un equipo" />
          <Form.Item label="Nuevo Equipo: ">
            <Input value={teamName} onChange={this.handleNameChange} />
          </Form.Item>
          <Form.Item label="Residentes">
            <Select
              mode="multiple"
              onChange={this.onSelectChange}
              placeholder="Selecionar residente"
            >
              {allResidents.map(({ firstName, lastName, key }) => (
                <Option value={firstName + ' ' + lastName} key={key}>
                  {firstName + ' ' + lastName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Nombre del Centro Medico: ">
            <Input value={teamMedicalCenter} onChange={this.handleMedChange} />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
            <Button key="submit" type="primary" onClick={this.onSubmit}>
              Agregar
            </Button>
          </Form.Item>
        </Form>

        <div className="outer-team-card">
          <Table loading={loading} columns={columns} dataSource={teams} />
        </div>
      </Fragment>
    );
  }
}

export default Teams;
