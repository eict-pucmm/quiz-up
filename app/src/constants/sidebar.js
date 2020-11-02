import {
  QuestionCircleOutlined,
  TeamOutlined,
  BookOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

export default [
  { title: 'Eventos', route: '/', Icon: BookOutlined },
  {
    title: 'Preguntas',
    Icon: QuestionCircleOutlined,
    subMenu: [
      { title: 'Preguntas', route: '/questions' },
      { title: 'Categorias', route: '/categories' },
    ],
  },
  {
    title: 'Participantes',
    Icon: TeamOutlined,
    subMenu: [
      { title: 'Equipos', route: '/teams' },
      { title: 'Residentes', route: '/residents' },
    ],
  },
  { title: 'Administradores', route: '/admins', Icon: UserAddOutlined },
];
