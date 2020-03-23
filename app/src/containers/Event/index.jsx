import React, { Fragment } from "react";
import { Breadcrumb } from "antd";

import "./styles.css";

const Event = () => {
  return (
    <Fragment>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ background: "#fff", padding: 24, minHeight: 580 }}>
        Content
      </div>
    </Fragment>
  );
};

export default Event;
