import React, { useEffect, useState } from 'react';
import { useModel, useParams } from '@umijs/max';
import { Avatar, Card, List, Rate, Typography, Spin, Empty, Divider, App, message, Button, Modal, Form, Radio, Input } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { listCommentById, deleteComment, updateComment } from '@/services/user-center/commentController';
import { getUserById } from '@/services/user-center/userController';
import { createStyles } from 'antd-style';
import LogoHeader from '@/components/LogoHeader';
import UserInfo from '@/components/UserInfo';

const { Title, Text } = Typography;
const { TextArea } = Input;

const useStyles = createStyles(({ token }) => ({
  container: {
    maxWidth: '800px',
    margin: '24px auto',
    padding: '0 16px',
  },
  header: {
    marginBottom: '24px',
    textAlign: 'center',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  avatar: {
    marginRight: '12px',
  },
  commentList: {
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    padding: '16px',
  },
  emptyContainer: {
    padding: '40px 0',
    textAlign: 'center',
  },
  commentItem: {
    padding: '16px 0',
  },
  commentContent: {
    margin: '8px 0',
  },
  commentMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    color: token.colorTextSecondary,
    fontSize: '12px',
  },
  // 添加顶部栏相关样式
  topBar: {
    width: '100%',
    height: '60px',
    background: '#fff',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 50px',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  contentContainer: {
    marginTop: '80px', // 为固定顶部栏留出空间
  },
}));

// 添加用户信息组件
const CommentUserInfo: React.FC<{ commenterId?: string }> = ({ commenterId }) => {
  const [userData, setUserData] = useState<API.UserResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!commenterId || commenterId.trim() === '') {
      return;
    }

    setLoading(true);
    getUserById({ id: commenterId })
      .then(response => {
        if (response && response.data) {
          setUserData(response.data);
        }
      })
      .catch(error => {
        console.error('获取用户信息失败:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [commenterId]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {loading ? (
        <Spin size="small" />
      ) : (
        <>
          <Avatar icon={<UserOutlined />} src={userData?.avatar_url} />
          <Text strong style={{ marginLeft: '8px' }}>
            {userData?.nickname || '未知用户'}
          </Text>
        </>
      )}
    </div>
  );
};

const SellerComments: React.FC = () => {
  const { styles } = useStyles();
  const { userId } = useParams<{ userId: string }>();
  const [commentsData, setCommentsData] = useState<API.CommentResponseDTO[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sellerInfo, setSellerInfo] = useState<API.UserResponseDTO | null>(null);
  const { initialState } = useModel('@@initialState'); 
  const currentUser = initialState?.currentUser;  
  // 添加编辑相关状态
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentComment, setCurrentComment] = useState<API.CommentResponseDTO | null>(null);
  const [editForm] = Form.useForm();
  
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        message.error('用户ID不存在');
        return;
      }

      setLoading(true);
      try {
        // 获取卖家信息
        const userResponse = await getUserById({ id: userId });
        if (userResponse && userResponse.data) {
          setSellerInfo(userResponse.data);
        }

        // 获取评论列表
        const commentsResponse = await listCommentById({ userId });
        
        if (commentsResponse && commentsResponse.data) {
          // 安全地处理数据
          const responseData = commentsResponse.data || {};
          const commentsList = Array.isArray(responseData.commentResponseDTO) 
            ? responseData.commentResponseDTO 
            : [];
          
          setCommentsData(commentsList);
          setAverageRating(responseData.start || 0);
          setTotal(commentsList.length || 0);
        }
      } catch (error) {
        message.error('获取数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);
  
  // 处理删除评论
  const handleDeleteComment = (commentId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条评价吗？删除后将无法恢复。',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await deleteComment({ id: commentId });
          if (response && response.status === 200) {
            message.success('评价已删除');
            // 重新获取评论列表
            const commentsResponse = await listCommentById({ userId: userId as string });
            if (commentsResponse && commentsResponse.data) {
              const responseData = commentsResponse.data || {};
              const commentsList = Array.isArray(responseData.commentResponseDTO) 
                ? responseData.commentResponseDTO 
                : [];
              
              setCommentsData(commentsList);
              setAverageRating(responseData.start || 0);
              setTotal(commentsList.length || 0);
            }
          } else {
            message.error(response?.message || '删除评价失败');
          }
        } catch (error) {
          console.error('删除评价失败:', error);
          message.error('删除评价失败，请稍后重试');
        }
      }
    });
  };
  
  // 打开编辑评论模态框
  const handleEditComment = (comment: API.CommentResponseDTO) => {
    setCurrentComment(comment);
    editForm.setFieldsValue({
      type: comment.type,
      content: comment.content
    });
    setEditModalVisible(true);
  };
  
  // 提交编辑评论
  const handleSubmitEdit = async () => {
    if (!currentComment) return;
    
    try {
      const values = await editForm.validateFields();
      const response = await updateComment({
        id: currentComment.id,
        userId: userId,
        content: values.content,
        type: values.type,
        commenterId: currentUser?.id,
      });
      
      if (response && response.status === 200) {
        message.success('评价已更新');
        setEditModalVisible(false);
        
        // 重新获取评论列表
        const commentsResponse = await listCommentById({ userId: userId as string });
        if (commentsResponse && commentsResponse.data) {
          const responseData = commentsResponse.data || {};
          const commentsList = Array.isArray(responseData.commentResponseDTO) 
            ? responseData.commentResponseDTO 
            : [];
          
          setCommentsData(commentsList);
          setAverageRating(responseData.start || 0);
          setTotal(commentsList.length || 0);
        }
      } else {
        message.error(response?.message || '更新评价失败');
      }
    } catch (error) {
      console.error('更新评价失败:', error);
      message.error('更新评价失败，请稍后重试');
    }
  };

  return (
    <div>
      {/* 添加顶部栏 */}
      <div className={styles.topBar}>
        <LogoHeader />
        <UserInfo />
      </div>
      
      <div className={styles.contentContainer}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Title level={2}>卖家信誉</Title>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
            </div>
          ) : (
            <>
              <Card>
                <div className={styles.userInfo}>
                  <Avatar 
                    size={64} 
                    icon={<UserOutlined />} 
                    src={sellerInfo?.avatar_url} 
                    className={styles.avatar} 
                  />
                  <div>
                    <Title level={4}>{sellerInfo?.nickname || '未知用户'}</Title>
                    <div>
                      <Rate disabled allowHalf value={averageRating} />
                      <Text style={{ marginLeft: '8px' }}>
                        {averageRating.toFixed(1)} 分 ({total} 条评价)
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>

              <Divider />

              <div className={styles.commentList}>
                <Title level={4}>全部评价 ({total})</Title>
                
                {commentsData.length === 0 ? (
                  <div className={styles.emptyContainer}>
                    <Empty description="暂无评价" />
                  </div>
                ) : (
                  <List
                    dataSource={commentsData}
                    itemLayout="horizontal"
                    renderItem={(item) => (
                      <List.Item className={styles.commentItem}>
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <CommentUserInfo commenterId={item?.commenter_id} />
                            <div>
                              <Text type={(item?.type === 0) ? 'success' : 'danger'}>
                                {(item?.type === 0) ? '好评' : '差评'}
                              </Text>
                            </div>
                          </div>
                          
                          <div className={styles.commentContent}>
                            {item?.content || '该用户未留下评论内容'}
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                            <Text type="secondary">{item?.created_time || ''}</Text>
                            
                            {/* 如果是当前用户的评论，显示编辑和删除按钮 */}
                            {currentUser?.id && item?.commenter_id === currentUser?.id && (
                              <div>
                                <Button 
                                  type="text" 
                                  icon={<EditOutlined />} 
                                  size="small"
                                  onClick={() => handleEditComment(item)}
                                >
                                  编辑
                                </Button>
                                <Button 
                                  type="text" 
                                  danger 
                                  icon={<DeleteOutlined />} 
                                  size="small"
                                  onClick={() => handleDeleteComment(item.id as string)}
                                >
                                  删除
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* 添加编辑评论模态框 */}
      <Modal
        title="编辑评价"
        open={editModalVisible}
        onOk={handleSubmitEdit}
        onCancel={() => setEditModalVisible(false)}
        okText="提交"
        cancelText="取消"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="type"
            label="评价类型"
            rules={[{ required: true, message: '请选择评价类型' }]}
          >
            <Radio.Group>
              <Radio value={0}>好评</Radio>
              <Radio value={1}>差评</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="content"
            label="评价内容"
            rules={[{ required: true, message: '请输入评价内容' }]}
          >
            <TextArea rows={4} placeholder="请输入您对卖家的评价..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SellerComments;