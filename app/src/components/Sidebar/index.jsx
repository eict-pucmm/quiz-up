import React from "react";
import { Link } from "react-router-dom";
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
        <Menu.Item key="Dashboard">
          <Link to="/">Dashboard</Link>
        </Menu.Item>
        <SubMenu
          title={
            <span>
              <QuestionCircleOutlined />
              Preguntas
            </span>
          }
        >
          <Menu.ItemGroup key="Preguntas">
            <Menu.Item key="Preguntas">
              <Link to="/questions">Preguntas</Link>
            </Menu.Item>
            <Menu.Item key="Categorias">
              <Link to="/categories">Categorias</Link>
            </Menu.Item>
          </Menu.ItemGroup>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
