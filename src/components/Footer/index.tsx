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
          title: '交易喵制作组',
          href: '/team',
          blankTarget: true,
        },
        {
          key: '2025.jsjds',
          title: '2025中国大学生计算机设计大赛作品',
          href: 'https://2025.jsjds.com.cn',
          blankTarget: true,
        },
      ]}
      copyright="2025 交易喵制作组 版权所有"
    />
  );
};

export default Footer;
