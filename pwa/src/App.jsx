import React from 'react';
import Title from 'antd/lib/typography/Title';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';

import InstallButton from './components/InstallButton';
import Home from './containers/Home';
import GameRoom from './containers/GameRoom';

import './App.css';

const { Header, Content } = Layout;

function App() {
  return (
    <div className="App">
      <Layout>
        <Header className="App-header">
          <Title level={3}>
            <a href="/">Quiz Up</a>
          </Title>
        </Header>
        <Content>
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/:roomId" component={GameRoom} />
            </Switch>
          </Router>
        </Content>
      </Layout>
      <InstallButton />
    </div>
  );
}

export default App;
