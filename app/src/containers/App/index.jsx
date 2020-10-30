import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from 'antd';

import Routes from '../../components/Routes';
import Sidebar from '../../components/Sidebar';
import MyHeader from '../../components/MyHeader';

import './styles.css';

const { Footer, Content } = Layout;

const App = () => {
  return (
    <Layout>
      <Router>
        <Sidebar />
        <Layout>
          <MyHeader />
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
