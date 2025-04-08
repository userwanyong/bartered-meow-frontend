import { PageContainer } from '@ant-design/pro-components';
import { Card, List, Image, Typography, Space, Input, Dropdown, Avatar, Menu } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { createStyles } from 'antd-style';
import { history, useModel } from '@umijs/max';
import { listGoods, listTag ,listGoodsByTagId } from '@/services/user-center/goodsController';
import { MenuProps } from 'antd';  // 添加这个导入
import { message } from 'antd';

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
            width: '500px',  // 固定搜索框宽度
            position: 'absolute',  // 使用绝对定位
            left: '50%',     // 左边距离50%
            transform: 'translateX(-50%)',  // X轴向左平移自身宽度的50%
        },
        userInfo: {
            position: 'absolute',  // 使用绝对定位
            right: '50px',        // 固定在右侧
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

    // 获取商品列表
    const fetchGoodsList = async (searchKey?: string) => {
        setLoading(true);
        try {
            const res = await listGoods({
                goodsQueryRequestDTO: {
                    goodName: searchKey,
                    goodDescription: searchKey,
                } as API.GoodsQueryRequestDTO
            });
            if (res.data) {
                setGoodsList(res.data);
            }
        } catch (error: any) {
            // 需要先导入 message 组件
            message.error('获取商品列表失败：' + error.message);
        }
        setLoading(false);
    };

    // 根据标签ID获取商品列表
    const fetchGoodsByTagId = async (tagId: string) => {
        setLoading(true);
        try {
            const res = await listGoodsByTagId({
                tagId: tagId
            });
            if (res.data) {
                setGoodsList(res.data);
            }
        } catch (error: any) {
            message.error('获取分类商品失败：' + error.message);
        }
        setLoading(false);
    };

    // 获取标签列表
    const fetchTagList = async () => {
        try {
            const res = await listTag();
            if (res.data) {
                setTagList(res.data);
            }
        } catch (error: any) {
            // 需要先导入 message 组件
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

    const handleMenuClick = ({ key }: { key: string }) => {
        switch (key) {
            case 'profile':
                history.push('/user/profile');
                break;
            case 'buy':
                history.push('/user/buy');
                break;
            case 'sell':
                history.push('/user/sell');
                break;
            case 'cart':
                history.push('/user/cart');
            break;
            case 'orders':
                history.push('/user/orders');
            break;
            case 'manage':
                history.push('/admin');
                break;
            case 'logout':
                // 这里添加登出逻辑
                localStorage.removeItem('token');
                history.push('/user/login');
                break;
            default:
                break;
        }
    };

    const menuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: '个人中心',
        },
        {
            key: 'buy',
            icon: <UserOutlined />,
            label: '我要买',
        },
        {
            key: 'sell',
            icon: <UserOutlined />,
            label: '我要卖',
        },
        {
            key: 'cart',
            icon: <UserOutlined />,
            label: '我的购物车',
        },
        {
            key: 'orders',
            icon: <UserOutlined />,
            label: '我的订单',
        },
        // 只有管理员（role === 0）才显示后台管理选项
        ...(currentUser?.role === 0 ? [{
            key: 'manage',
            icon: <SettingOutlined />,
            label: '后台管理',
        }] : []),
        {
            type: 'divider' as const,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
        },
    ];

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
                <div className={styles.userInfo}>
                    {currentUser ? (
                        <Dropdown
                            menu={{
                                items: menuItems,
                                onClick: handleMenuClick,
                            }}
                            placement="bottomRight"
                        >
                            <Space>
                                <Avatar
                                    size="large"
                                    src={currentUser.avatar_url}
                                    icon={!currentUser.avatar_url && <UserOutlined />}
                                />
                                <Text className={styles.username}>
                                    {currentUser.nickname}
                                </Text>
                            </Space>
                        </Dropdown>
                    ) : (
                        <Space onClick={() => history.push('/user/login')} style={{ cursor: 'pointer' }}>
                            <Avatar size="large" icon={<UserOutlined />} />
                            <Text className={styles.username}>登录</Text>
                        </Space>
                    )}
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.sideNav}>
                    {/* 添加分类导航 */}
                    <Menu
                        mode="vertical"
                        selectedKeys={[selectedTagId]}
                        onClick={({ key }) => handleTagClick(key)}
                        items={[
                            { key: '', label: '全部商品' },
                            ...tagList.map(tag => ({
                                key: tag.id as string,
                                label: tag.tag_name,
                            }))
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
                                    onClick={() => history.push(`/user/goods/detail/${item.id}`, { 
                                        goodsDetail: item 
                                    })}
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
                                                    <Text className={styles.price}>¥ {item.good_price}</Text>
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
        </div>
    );
};

export default GoodsPage;