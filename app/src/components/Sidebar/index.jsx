import React from "react";
import { Menu, Layout } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import useReactRouter from "use-react-router";

const { SubMenu } = Menu;
const { Sider } = Layout;

const Sidebar = () => {
  const { location } = useReactRouter();

  return location.pathname.includes("/event/round/") ? (
    <div></div>
  ) : (
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
