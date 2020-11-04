import React from 'react';
import Title from 'antd/lib/typography/Title';
import { Layout, Avatar, Menu, Dropdown } from 'antd';
import {
  AntDesignOutlined,
  LogoutOutlined,
  MailOutlined,
} from '@ant-design/icons';

import { auth } from '../../constants/firebase';
import { getUserInfo, removeUser } from '../../api/user';

import './styles.css';

const { Header } = Layout;

const MyHeader = () => {
  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        removeUser();
        window.location.replace('/login');
      })
      .catch(error => {
        console.error(error);
      });
  };

  const MENU = (
    <Menu>
      {getUserInfo().email && (
        <Menu.Item icon={<MailOutlined />}>
          <span>{getUserInfo().email}</span>
        </Menu.Item>
      )}
      <Menu.Item key="0" icon={<LogoutOutlined />}>
        <span onClick={handleLogout}>Cerrar sesion</span>
      </Menu.Item>
    </Menu>
  );

  const atGameWindow = window.location.pathname.includes('/event/round/');

  return (
    <Header
      className="app-header"
      style={{
        display: 'flex',
        flexDirection: atGameWindow ? 'row' : 'row-reverse',
      }}>
      {atGameWindow ? (
        <Title className="title-quiz-up" level={3}>
          <a href="/">Quiz Up</a>
        </Title>
      ) : (
        <Dropdown overlay={MENU}>
          <Avatar
            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            icon={<AntDesignOutlined />}
          />
        </Dropdown>
      )}
    </Header>
  );
};

export default MyHeader;
