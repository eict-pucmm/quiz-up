import { QuestionCircleOutlined } from "@ant-design/icons";

export default [
  { title: "Events", route: "/" },
  {
    title: "Preguntas",
    Icon: QuestionCircleOutlined,
    subMenu: [
      { title: "Preguntas", route: "/questions" },
      { title: "Categorias", route: "/categories" }
    ]
  }
];
