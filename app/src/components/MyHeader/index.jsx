import React from 'react';
import Title from 'antd/lib/typography/Title';
import { Layout, Avatar, Menu, Dropdown } from 'antd';
import { AntDesignOutlined, LogoutOutlined } from '@ant-design/icons';

import { auth } from '../../constants/firebase';
import { removeUser } from '../../api/user';

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
      <Menu.Item key="0">
        <span onClick={handleLogout}>
          <LogoutOutlined /> Cerrar sesion
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="app-header">
      {window.location.pathname.includes('/event/round/') ? (
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
