import React from "react";
import { Result, Button } from "antd";

const NotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Lo sentimos, la pagina que esta buscando no existe :("
      extra={
        <Button type="primary" href="/">
          Volver al Inicio
        </Button>
      }
    />
  );
};

export default NotFound;
