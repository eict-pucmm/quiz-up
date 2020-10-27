import React from 'react';
import { Collapse } from 'antd';
import { UpOutlined } from '@ant-design/icons';

import './styles.css';

const { Panel } = Collapse;

const CollapsableFormWrapper = props => {
  return (
    <Collapse
      defaultActiveKey={['1']}
      className="form-collapse-container"
      expandIcon={({ isActive }) => (
        <UpOutlined
          rotate={isActive ? 180 : 0}
          className="form-collapse-arrow-icon"
        />
      )}>
      <Panel header={props.header} key="1">
        {props.children}
      </Panel>
    </Collapse>
  );
};

export default CollapsableFormWrapper;
