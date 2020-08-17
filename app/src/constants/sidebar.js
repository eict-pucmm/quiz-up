import { QuestionCircleOutlined, TeamOutlined } from '@ant-design/icons';

export default [
  { title: 'Eventos', route: '/' },
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
];
