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
          key: 'Cat_shop',
          title: '交易喵制作组',
          href: '',
          blankTarget: true,
        },

        {
          key: 'Cat_shop',
          title: '交易喵制作组',
          href: '',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
