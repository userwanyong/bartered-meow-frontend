import UserInfo from '@/components/UserInfo';
import { listGoodsAdmin, listGoodsByTagIdAdmin, listTag } from '@/services/user-center/goodsController';
import { history, useModel } from '@umijs/max';
import { Card, Image, Input, List, Menu, message, Typography, Button, Drawer } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState, useEffect } from 'react';
import { RobotOutlined, MenuOutlined } from '@ant-design/icons'; // 添加菜单图标
import AIChat from '@/components/AIChat';
import LogoHeader  from '@/components/LogoHeader';

const { Search } = Input;
const { Text, Title } = Typography;

const useStyles = createStyles(({ token }) => {
  return {
    topBar: {
      width: '100%',
      height: '60px',
      background: '#fff',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between', // 改为两端对齐
      padding: '0 16px',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      '@media (min-width: 768px)': {
        padding: '0 50px',
      },
    },
    // 添加Logo和标题样式
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      marginRight: '20px',
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
    // 其他样式保持不变
    searchWrapper: {
      width: '100%',
      maxWidth: '100%', // 小屏幕下占满整个宽度
      // 小屏幕下显示搜索框
      display: 'block',
      position: 'absolute',
      bottom: '-50px', // 小屏幕下将搜索框放在导航栏下方
      left: '0',
      padding: '8px 16px',
      background: '#fff',
      borderBottom: '1px solid #f0f0f0',
      transform: 'none',
      '@media (min-width: 768px)': {
        position: 'absolute',
        bottom: 'auto',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '0',
        border: 'none',
        maxWidth: '500px', // 大屏幕下恢复最大宽度
      },
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end', // 小屏幕下靠右对齐
      flex: '1',
      '@media (min-width: 768px)': {
        flex: '0 0 auto',
        justifyContent: 'center', // 大屏幕下居中
      },
    },
    menuButton: {
      display: 'block',
      '@media (min-width: 768px)': {
        display: 'none',
      },
    },
    container: {
      marginTop: '120px', // 增加顶部边距，为搜索框留出空间
      padding: '10px',
      '@media (min-width: 768px)': {
        marginTop: '80px', // 大屏幕下恢复原来的边距
        padding: '20px 50px',
      },
    },
    sideNav: {
      display: 'none', // 小屏幕下默认隐藏
      '@media (min-width: 768px)': {
        display: 'block',
        width: '200px',
        background: '#fff',
        padding: '20px 0',
        position: 'fixed',
        left: 0,
        top: '60px',
        bottom: 0,
        borderRight: '1px solid #f0f0f0',
      },
    },
    mainContent: {
      marginLeft: '0', // 小屏幕下无边距
      '@media (min-width: 768px)': {
        marginLeft: '220px', // 大屏幕下有边距
      },
    },
    header: {
      position: 'absolute',
      top: 20,
      right: 20,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    username: {
      color: token.colorTextSecondary,
      cursor: 'pointer',
      '&:hover': {
        color: token.colorPrimary,
      },
    },
    card: {
      width: '100%',
      height: '100%',
      '&:hover': {
        boxShadow: token.boxShadowSecondary,
        transform: 'translateY(-3px)',
        transition: 'all 0.3s',
      },
    },
    cardContainer: {
      height: '380px', // 固定卡片容器高度
      display: 'flex',
      flexDirection: 'column',
    },
    cardImageContainer: {
      height: '200px', // 固定图片容器高度
      overflow: 'hidden',
    },
    cardContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '12px',
    },
    price: {
      color: token.colorError,
      fontSize: '20px',
      fontWeight: 'bold',
    },
    aiFloatingButton: {
      position: 'relative',
      '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      },
      '&:hover .aiTooltip': {
        opacity: 1,
        visibility: 'visible',
        transform: 'translateY(0)',
      }
    },
    
    aiFloatingIcon: {
      fontSize: '24px',
      transition: 'all 0.3s',
      '&:hover': {
        fontSize: '30px',
      },
    },
    
    aiTooltip: {
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(10px)',
      backgroundColor: 'white',
      color: '#333',
      padding: '8px 12px',
      borderRadius: '6px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      whiteSpace: 'nowrap',
      fontSize: '14px',
      marginBottom: '10px',
      opacity: 0,
      visibility: 'hidden',
      transition: 'all 0.3s ease',
      '&:after': {
        content: '""',
        position: 'absolute',
        top: '10%', // 箭头位于气泡底部
        left: '50%',
        transform: 'translateX(-50%)',
        border: '6px solid transparent',
        borderTopColor: 'white', // 箭头朝下，所以是顶部边框有颜色
      }
    },
  };
});

const GoodsPage: React.FC = () => {
  const { styles } = useStyles();
  const [searchValue, setSearchValue] = useState<string>('');
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [goodsList, setGoodsList] = useState<API.GoodsResponseDTO[]>([]);
  const [tagList, setTagList] = useState<API.TagResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTagId, setSelectedTagId] = useState<string>('');
  const [aiChatVisible, setAiChatVisible] = useState<boolean>(false);
  // 添加侧边栏抽屉状态
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  // 添加窗口宽度状态
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 获取商品列表
  const fetchGoodsList = async (searchKey?: string) => {
    setLoading(true);
    try {
      const res = await listGoodsAdmin({
        goodsQueryRequestDTO: {
          goodName: searchKey,
          goodDescription: searchKey,
        } as API.GoodsQueryRequestDTO,
      });
      if (res.data) {
        const availableGoods = res.data.filter(
          (item) => (item.current_count || 0) > 0 && item.state === 0
        );
        setGoodsList(availableGoods);
      }
    } catch (error: any) {
      message.error('获取商品列表失败：' + error.message);
    }
    setLoading(false);
  };

  const fetchGoodsByTagId = async (tagId: string) => {
    setLoading(true);
    try {
      const res = await listGoodsByTagIdAdmin({
        tagId: tagId,
      });
      if (res.data) {
        // 过滤掉库存为0和已下架的商品
        const availableGoods = res.data.filter(
          (item) => (item.current_count || 0) > 0 && item.state === 0
        );
        setGoodsList(availableGoods);
      }
    } catch (error: any) {
      message.error('获取分类商品失败：' + error.message);
    }
    setLoading(false);
  };

  // 获取标签列表
  const fetchTagList = async () => {
    try {
      const res = await listTag({
        tagQueryRequestDTO: {}
      });
      if (res.data) {
        setTagList(res.data);
      }
    } catch (error: any) {
      message.error('获取标签列表失败：' + error.message);
    }
  };

  // 页面加载时获取数据
  React.useEffect(() => {
    fetchGoodsList();
    fetchTagList();
  }, []);

  const onSearch = (value: string) => {
    setSearchValue(value);
    fetchGoodsList(value);
    // 重置选中的标签
    setSelectedTagId('');
  };

  // 处理标签点击事件
  const handleTagClick = (tagId: string) => {
    setSelectedTagId(tagId);
    fetchGoodsByTagId(tagId);
    // 在移动端点击标签后关闭抽屉
    if (windowWidth < 768) {
      setDrawerVisible(false);
    }
  };

  // 渲染菜单内容
  const renderMenu = () => (
    <Menu
      mode="vertical"
      selectedKeys={[selectedTagId]}
      onClick={({ key }) => handleTagClick(key)}
      items={[
        { key: '', label: '全部商品' },
        ...tagList.map((tag) => ({
          key: tag.id as string,
          label: tag.tag_name,
        })),
      ]}
    />
  );

  return (
    <div>
      <div className={styles.topBar}>
        {/* 添加菜单按钮 */}
        <Button 
          type="text" 
          icon={<MenuOutlined />} 
          onClick={() => setDrawerVisible(true)}
          className={styles.menuButton}
        />
        
        {/* 添加Logo和标题 */}
        <LogoHeader />
        
        <div className={styles.searchWrapper}>
          <Search
            placeholder="搜索商品"
            allowClear
            enterButton="搜索"
            size="large"
            onSearch={onSearch}
          />
        </div>
        
        <div className={styles.userInfo}>
          <UserInfo />
        </div>
      </div>

      {/* 移动端侧边栏抽屉 */}
      <Drawer
        title="商品分类"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={250}
      >
        {renderMenu()}
      </Drawer>

      <div className={styles.container}>
        <div className={styles.sideNav}>
          {renderMenu()}
        </div>

        <div className={styles.mainContent}>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 4,
              xxl: 6,
            }}
            loading={loading}
            dataSource={goodsList}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  className={styles.card}
                  onClick={() =>
                    history.push(`/user/goods/detail/${item.id}`, {
                      goodsDetail: item,
                    })
                  }
                  cover={
                    <Image
                      alt={item.good_name}
                      src={item.good_pic}
                      style={{ height: 200, objectFit: 'cover' }}
                      preview={false} // 禁用图片预览，避免与卡片点击冲突
                    />
                  }
                >
                  <Card.Meta
                    title={<Title level={5}>{item.good_name}</Title>}
                    description={
                      <>
                        <Text type="secondary" ellipsis>
                          {item.good_description}
                        </Text>
                        <div style={{ marginTop: 8 }}>
                          <Text className={styles.price}>
                            ¥ {item.good_price?.toFixed(2)}
                          </Text>
                        </div>
                      </>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>
      </div>
      
      {/* 恢复AI浮动按钮位置到左下角 */}
      <div 
        style={{
          position: 'fixed',
          left: '20px', // 恢复到左下角
          bottom: '100px', // 恢复原来的底部距离
          backgroundColor: '#1890ff',
          color: 'white',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000,
          transition: 'all 0.3s',
        }}
        onClick={() => setAiChatVisible(true)}
        className={styles.aiFloatingButton}
      >
        <div className={`${styles.aiTooltip} aiTooltip`}>我是你的智能ai助手</div>
        <RobotOutlined className={styles.aiFloatingIcon} />
      </div>
      
      {/* 添加AI聊天组件 */}
      <AIChat 
        visible={aiChatVisible}
        onClose={() => setAiChatVisible(false)}
      />
    </div>
  );
};

export default GoodsPage;
