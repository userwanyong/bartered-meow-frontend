import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'Qit',
          title: 'Qit-软件工作室',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        
        {
          key: '萌萌哒温**',
          title: '萌萌哒温**',
          href: 'https://ant.design',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
