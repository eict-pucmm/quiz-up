import React, { Component } from "react";
import { Menu, Layout, Breadcrumb } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import "./styles.css";

const { SubMenu } = Menu;
const { Header, Footer, Sider, Content } = Layout;
class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          <Header>
            <Title className="white" level={3}>
              Quiz Up
            </Title>
          </Header>
          <Layout>
            <Sider>
              <Menu defaultSelectedKeys={["Dashboard"]} mode="inline">
                <Menu.Item key="Dashboard">Dashboard</Menu.Item>
                <SubMenu
                  title={
                    <span>
                      <QuestionCircleOutlined />
                      Preguntas
                    </span>
                  }
                >
                  <Menu.ItemGroup key="Preguntas">
                    <Menu.Item key="Preguntas">Preguntas</Menu.Item>
                    <Menu.Item key="Categorias">Categorias</Menu.Item>
                  </Menu.ItemGroup>
                </SubMenu>
              </Menu>
            </Sider>
            <Layout>
              <Content style={{ padding: "0 50px" }}>
                <Breadcrumb style={{ margin: "16px 0" }}>
                  <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                </Breadcrumb>
                <div
                  style={{ background: "#fff", padding: 24, minHeight: 580 }}
                >
                  Content
                </div>
              </Content>
              <Footer style={{ textAlign: "center" }}></Footer>
            </Layout>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
