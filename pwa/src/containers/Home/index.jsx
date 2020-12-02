import React, { useEffect, useState } from 'react';
import { Button, Input, Alert, Select } from 'antd';

import { useStateValue } from '../../state/';
import { setUserInfo } from '../../state/actions';
import {
  getTeamsByMedicalCenter,
  findTeamBelongsToRound,
} from '../../api/teams';
import { getMedicalCenters } from '../../api/medicalCenter';

import './styles.css';

const { Option } = Select;

const Home = () => {
  const [error, setError] = useState(false);
  const { state, dispatch } = useStateValue();
  const { roomId, teamName } = state.userInfo;
  const [medicalCenters, setMedicalCenters] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const getCenters = async () => {
      const { data } = await getMedicalCenters();
      setMedicalCenters(data || []);
    };

    getCenters();
  }, []);

  const handleCenterChange = async v => {
    const { data } = await getTeamsByMedicalCenter(v);
    setTeams(data);
  };

  const handleSubmit = async () => {
    const { data } = await findTeamBelongsToRound(teamName, roomId);
    console.log({ teamName });
    setError(!data);
    if (data) {
      localStorage.setItem('TEAM', teamName);
      window.location.replace(`/${roomId}`);
    }
  };

  const handleChange = e => {
    dispatch(setUserInfo({ roomId: e.target.value.replace(/\D/, '') }));
    setError(false);
  };

  return (
    <div className="container">
      {error && (
        <Alert
          message="Debe ingresar un equipo y número válido"
          type="error"
          showIcon
        />
      )}
      <Select
        showSearch
        className="input-join"
        onChange={handleCenterChange}
        placeholder="Centro al que representa"
        size="large">
        {medicalCenters.map(({ name }) => (
          <Option value={name} key={name}>
            {name}
          </Option>
        ))}
      </Select>
      <Select
        showSearch
        className="input-join"
        disabled={teams.length === 0}
        onChange={v => dispatch(setUserInfo({ teamName: v }))}
        placeholder="Equipo al que representa"
        size="large">
        {teams.map(({ name }) => (
          <Option value={name} key={name}>
            {name}
          </Option>
        ))}
      </Select>
      <Input
        className="input-join"
        onChange={handleChange}
        name="roomId"
        placeholder="Número del Evento"
        size="large"
        value={roomId}
      />
      <Button
        className={'btn-join'}
        type="primary"
        size="large"
        onClick={handleSubmit}>
        Unirse al evento
      </Button>
    </div>
  );
};

export default Home;
