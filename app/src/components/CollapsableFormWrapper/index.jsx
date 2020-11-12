import React from 'react';
import { Collapse } from 'antd';

import './styles.css';

const { Panel } = Collapse;

const CollapsableFormWrapper = props => {
  return (
    <Collapse defaultActiveKey={['1']} className="form-collapse-container">
      <Panel header={props.header} key="1">
        {props.children}
      </Panel>
    </Collapse>
  );
};

export default CollapsableFormWrapper;
