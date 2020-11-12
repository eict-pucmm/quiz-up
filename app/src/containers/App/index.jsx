import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout } from 'antd';

import Routes from '../../components/Routes';
import Sidebar from '../../components/Sidebar';
import MyHeader from '../../components/MyHeader';
import { useStateValue } from '../../state';

import './styles.css';

const { Footer, Content } = Layout;

const App = () => {
  const {
    state: { currentUser },
  } = useStateValue();

  return (
    <Layout>
      <Router>
        {currentUser && <Sidebar />}
        <Layout>
          {currentUser && <MyHeader />}
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
