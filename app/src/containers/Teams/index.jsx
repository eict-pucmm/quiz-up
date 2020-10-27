import React, { Fragment, Component } from 'react';
import { Breadcrumb, notification, Table, Tag } from 'antd';
import axios from 'axios';

import { URL_TEAMS, URL_RESIDENTS } from '../../config/urls';
import { getMedicalCenters } from '../../api/medialCenters';
import CollapsableFormWrapper from '../../components/CollapsableFormWrapper';
import FormTeams from '../../components/FormTeams';
import ActionButtons from '../../components/ActionButtons';

import './styles.css';

class Teams extends Component {
  state = {
    teams: [],
    allResidents: [],
    teamName: '',
    teamResidents: [],
    teamMedicalCenter: '',
    allMedicalCenters: [],
    savingTeam: false,
    loading: false,
  };

  componentDidMount() {
    this.getTeams();
    this.getCenters();
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

  getCenters = async () => {
    const { data } = await getMedicalCenters();

    this.setState({ allMedicalCenters: data || [] });
  };

  handleNameChange = event => {
    this.setState({ teamName: event.target.value });
  };

  onSelectChange = value => {
    this.setState({ teamResidents: value });
  };

  handleMedChange = value => this.setState({ teamMedicalCenter: value });

  onSubmit = () => {
    const { teamName, teamResidents, teamMedicalCenter } = this.state;
    this.setState({ savingTeam: true, loading: true });
    axios
      .post(`${URL_TEAMS}/`, {
        name: teamName,
        residents: teamResidents,
        medicalCenter: teamMedicalCenter,
      })
      .then(({ data }) => {
        this.setState({
          teamName: '',
          teamResidents: [],
          teamMedicalCenter: '',
          savingTeam: false,
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
      loading,
      allMedicalCenters,
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
      {
        title: 'Acción',
        key: 'action',
        render: record => (
          <ActionButtons
            onUpdate={() => {
              /*TODO: add function to update */
            }}
            update
          />
        ),
      },
    ];
    return (
      <Fragment>
        <Breadcrumb className="breadcrumb-title">
          <Breadcrumb.Item>Equipos</Breadcrumb.Item>
        </Breadcrumb>
        <CollapsableFormWrapper header="Agregar un equipo">
          <FormTeams
            teamName={teamName}
            allResidents={allResidents}
            allMedicalCenters={allMedicalCenters}
            onSelectChange={this.onSelectChange}
            handleMedChange={this.handleMedChange}
            handleNameChange={this.handleNameChange}
            onSubmit={this.onSubmit}
          />
        </CollapsableFormWrapper>
        <Table loading={loading} columns={columns} dataSource={teams} />
      </Fragment>
    );
  }
}

export default Teams;
