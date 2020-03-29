import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "antd";
import Title from "antd/lib/typography/Title";

import Routes from "../../components/Routes";
import Sidebar from "../../components/Sidebar";

import "./styles.css";

const { Header, Footer, Content } = Layout;

const App = () => {
  return (
    <div>
      <Layout>
        <Header className="header">
          <Title className="title-quiz-up" level={3}>
            <a href="/">Quiz Up</a>
          </Title>
        </Header>
        <Layout>
          <Router>
            <Sidebar />
            <Layout>
              <Content className="container">
                <Routes />
              </Content>
              <Footer />
            </Layout>
          </Router>
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
