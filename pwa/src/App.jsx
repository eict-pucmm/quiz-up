import React, { useEffect, useState, Fragment } from 'react';
import Title from 'antd/lib/typography/Title';
import { Layout, Dropdown, Avatar, Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Home from './containers/Home';
import GameRoom from './containers/GameRoom';
import Login from './containers/Login';

import { removeUser } from './api/user';
import { auth } from './helpers/firebase';
import { useStateValue } from './state';
import { setCurrentUser } from './state/actions';

import './App.css';

const { Header, Content } = Layout;

function App() {
  const { dispatch } = useStateValue();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
      dispatch(setCurrentUser({ user }));
    });
  }, [dispatch]);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        removeUser();
        dispatch(setCurrentUser({ user: null }));
        window.location.replace('/login');
      })
      .catch(error => {
        console.error(error);
      });
  };

  const MENU = (
    <Menu>
      <Menu.Item key="0">
        <span onClick={handleLogout}>Cerrar sesion</span>
      </Menu.Item>
    </Menu>
  );

  if (loading) {
    return <Fragment />;
  }

  return (
    <div className="App">
      <Layout>
        <Header className="App-header">
          <Title level={3} className="home-header-title">
            <a href="/">Quiz Up</a>
          </Title>
          <Dropdown overlay={MENU}>
            <Avatar
              size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
              icon={<LogoutOutlined />}
            />
          </Dropdown>
        </Header>
        <Content>
          <Router>
            <Switch>
              <Route exact path="/login" component={Login} />
              {!user && <Redirect to="/login" />}
              <Route exact path="/" component={Home} />
              <Route exact path="/:roomId" component={GameRoom} />
            </Switch>
          </Router>
        </Content>
      </Layout>
    </div>
  );
}

export default App;
