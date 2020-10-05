import React from 'react';
import Title from 'antd/lib/typography/Title';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from 'antd';

import Routes from '../../components/Routes';
import Sidebar from '../../components/Sidebar';

import './styles.css';

const { Header, Footer, Content } = Layout;

const App = () => {
  const HEADER = window.location.pathname.includes('/event/round/') ? (
    <Header className="app-header">
      <Title className="title-quiz-up" level={3}>
        <a href="/">Quiz Up</a>
      </Title>
    </Header>
  ) : (
    <Header className="app-header" />
  );

  return (
    <Layout>
      <Router>
        <Sidebar />
        <Layout>
          {HEADER}
          <Content className="container">
            <Routes />
          </Content>
          <Footer />
        </Layout>
      </Router>
    </Layout>
  );
};

export default App;
