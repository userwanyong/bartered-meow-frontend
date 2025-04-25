import React from 'react';
import { history } from '@umijs/max';
import { createStyles } from 'antd-style';

const useStyles = createStyles(() => {
  return {
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      marginRight: '20px',
      cursor: 'pointer',
    },
    logo: {
      width: '40px',
      height: '40px',
      marginRight: '10px',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
      margin: 0,
      '@media (max-width: 576px)': {
        fontSize: '16px',
      },
    },
  };
});

const LogoHeader: React.FC = () => {
  const { styles } = useStyles();
  
  return (
    <div 
      className={styles.logoContainer} 
      onClick={() => history.push('/goods')}
    >
      <img 
        src="https://bartered-meow.oss-cn-beijing.aliyuncs.com/6c8e28c3-5d0a-4b5b-8176-4d847bea06f6.png" 
        alt="交易喵" 
        className={styles.logo}
      />
      <h1 className={styles.title}>交易喵-AI交易平台</h1>
    </div>
  );
};

export default LogoHeader;