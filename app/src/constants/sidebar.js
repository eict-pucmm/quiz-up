import {
  QuestionCircleOutlined,
  TeamOutlined,
  BookOutlined,
  UserAddOutlined,
  AppstoreAddOutlined,
  UserSwitchOutlined,
  ShopOutlined,
} from '@ant-design/icons';

export default [
  { title: 'Eventos', route: '/', Icon: BookOutlined },

  {
    title: 'Preguntas',
    Icon: QuestionCircleOutlined,
    route: '/questions',
  },
  {
    title: 'Categorias',
    Icon: AppstoreAddOutlined,
    route: '/categories',
  },
  {
    title: 'Equipos',
    Icon: TeamOutlined,
    route: '/teams',
  },
  {
    title: 'Residentes',
    Icon: UserSwitchOutlined,
    route: '/residents',
  },
  {
    title: 'Centros Médicos',
    Icon: ShopOutlined,
    route: '/medical-centers',
  },
  { title: 'Administradores', route: '/admins', Icon: UserAddOutlined },
];
