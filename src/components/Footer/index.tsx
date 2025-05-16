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
          key: '点击查看详情',
          title: '智喵集市制作组',
          href: '/team',
          blankTarget: true,
        },
        {
          key: '2025.jsjds',
          title: '2025jsp课程大作业',
          href: '/',
          blankTarget: true,
        },
      ]}
      copyright="2025 智喵集市制作组 版权所有"
    />
  );
};

export default Footer;
