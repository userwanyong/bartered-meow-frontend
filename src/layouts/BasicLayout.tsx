import React, { useState } from 'react';
import { Layout } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import AIChat from '@/components/AIChat';
import styles from './BasicLayout.less';

// ... 其他导入和代码 ...

const BasicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aiChatVisible, setAiChatVisible] = useState(false);

  return (
    <Layout>
      {/* ... 其他布局代码 ... */}
      
      <div className={styles.aiButton} onClick={() => setAiChatVisible(true)}>
        <RobotOutlined />
        <span>AI助手</span>
      </div>
      
      <AIChat visible={aiChatVisible} onClose={() => setAiChatVisible(false)} />
      
      {children}
    </Layout>
  );
};

export default BasicLayout;