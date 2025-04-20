import UserInfo from '@/components/UserInfo';
import { listGoodsAdmin, listGoodsByTagIdAdmin, listTag } from '@/services/user-center/goodsController';
import { history, useModel } from '@umijs/max';
import { Card, Image, Input, List, Menu, message, Typography } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { RobotOutlined } from '@ant-design/icons'; // 添加机器人图标
import AIChat from '@/components/AIChat'; // 导入AI聊天组件

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
      justifyContent: 'center', // 添加居中对齐
      padding: '0 50px',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
    },
    searchWrapper: {
      width: '500px', // 固定搜索框宽度
      position: 'absolute', // 使用绝对定位
      left: '50%', // 左边距离50%
      transform: 'translateX(-50%)', // X轴向左平移自身宽度的50%
    },
    userInfo: {
      position: 'absolute', // 使用绝对定位
      right: '50px', // 固定在右侧
    },
    container: {
      marginTop: '80px',
      padding: '20px 50px',
    },
    sideNav: {
      width: '200px',
      background: '#fff',
      padding: '20px 0',
      position: 'fixed',
      left: 0,
      top: '60px',
      bottom: 0,
      borderRight: '1px solid #f0f0f0',
    },
    mainContent: {
      marginLeft: '220px',
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
      '&:hover': {
        boxShadow: token.boxShadowSecondary,
        transform: 'translateY(-3px)',
        transition: 'all 0.3s',
      },
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
  // 将AI聊天状态移到组件内部
  const [aiChatVisible, setAiChatVisible] = useState<boolean>(false);

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
  };
  // 在 GoodsPage 组件的 return 中修改布局：
  return (
    <div>
      <div className={styles.topBar}>
        <div className={styles.searchWrapper}>
          <Search
            placeholder="搜索商品"
            allowClear
            enterButton="搜索"
            size="large"
            onSearch={onSearch}
          />
        </div>
        <UserInfo />
      </div>

      <div className={styles.container}>
        <div className={styles.sideNav}>
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
      
      {/* 添加悬浮AI按钮 */}
      <div 
        style={{
          position: 'fixed',
          left: '20px',
          bottom: '100px',
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
