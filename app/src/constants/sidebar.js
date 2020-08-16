import { QuestionCircleOutlined } from '@ant-design/icons';

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
];
