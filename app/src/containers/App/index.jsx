import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "antd";

import Title from "antd/lib/typography/Title";
import Sidebar from "../../components/Sidebar";
import Routes from "../../components/Routes";

import "./styles.css";

const { Header, Footer, Content } = Layout;

const App = () => {
  return (
    <div>
      <Layout>
        <Header>
          <Title className="white" level={3}>
            Quiz Up
          </Title>
        </Header>
        <Layout>
          <Router>
            <Sidebar />
            <Layout>
              <Content style={{ padding: "0 50px" }}>
                <Routes />
              </Content>
              <Footer style={{ textAlign: "center" }}></Footer>
            </Layout>
          </Router>
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
