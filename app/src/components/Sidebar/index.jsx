import React from "react";
import { Menu, Layout } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const { SubMenu } = Menu;
const { Sider } = Layout;

const Sidebar = () => {
  return (
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
  );
};

export default Sidebar;
