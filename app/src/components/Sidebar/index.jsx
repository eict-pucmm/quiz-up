import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Layout } from 'antd';
import useReactRouter from 'use-react-router';

import sidebarItems from '../../constants/sidebar';
import Title from 'antd/lib/typography/Title';

const { SubMenu } = Menu;
const { Sider } = Layout;

const Sidebar = () => {
  const { location } = useReactRouter();

  return location.pathname.includes('/event/round/') ? (
    <Fragment />
  ) : (
    <Sider>
      <div>
        <Title className="title-quiz-up" level={3}>
          <a href="/">Quiz Up</a>
        </Title>
      </div>
      <Menu
        className="sidebar-menu"
        defaultSelectedKeys={['Eventos']}
        mode="inline"
        style={{ height: '100vh' }}
        theme="dark">
        {sidebarItems.map(({ title, route, subMenu, Icon }) => {
          return !subMenu ? (
            <Menu.Item key={title}>
              <Link to={route}>{title}</Link>
            </Menu.Item>
          ) : (
            <SubMenu
              key={title}
              title={
                <span>
                  <Icon />
                  {title}
                </span>
              }>
              <Menu.ItemGroup key={title}>
                {subMenu.map(({ title, route }) => (
                  <Menu.Item key={title}>
                    <Link to={route}>{title}</Link>
                  </Menu.Item>
                ))}
              </Menu.ItemGroup>
            </SubMenu>
          );
        })}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
