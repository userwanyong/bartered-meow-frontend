import React, { useState, useRef, useEffect } from 'react';
import { Modal, Input, Button, List, Avatar, Spin, message } from 'antd';
import { RobotOutlined, SendOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons';
import { service2 } from '@/services/user-center/aiUserController';
import { getChatHistory } from '@/services/user-center/aiUserController'; // 导入获取历史记录的函数
import { getCurrentUser } from '@/services/user-center/userController';
import { history, useModel } from '@umijs/max';
import styles from './index.less';

const { TextArea } = Input;

// 消息类型定义
interface Message {
  content: string;
  type: 'user' | 'ai';
  time: string;
  isStreaming?: boolean;
}

const AIChat: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false); // 添加历史记录加载状态
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageSent = useRef<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 检查用户是否已登录
  useEffect(() => {
    if (visible) {
      checkUserLoginStatus();
    }
  }, [visible, currentUser]);

  // 检查用户登录状态
  const checkUserLoginStatus = async () => {
    try {
      if (currentUser) {
        setIsUserLoggedIn(true);
        // 如果用户已登录，加载历史聊天记录
        loadChatHistory();
      } else {
        setIsUserLoggedIn(false);
        // 如果未登录，添加提示消息
        setMessages([
          {
            content: '您需要先登录才能使用AI助手功能。',
            type: 'ai',
            time: new Date().toLocaleTimeString(),
          }
        ]);
      }
    } catch (error) {
      console.error('检查用户登录状态失败:', error);
      setIsUserLoggedIn(false);
    }
  };

  // 加载历史聊天记录
  const loadChatHistory = async () => {
    if (!currentUser?.id) return;
    
    setHistoryLoading(true);
    try {
      const response = await getChatHistory({
        chatId: currentUser.id.toString(),
      });
      
      if (response && response.length > 0) {
        // 将API返回的历史记录转换为消息格式
        const historyMessages = response.map(item => ({
          content: item.content || '',
          type: item.role === 'user' ? 'user' : 'ai',
          time: new Date().toLocaleTimeString(),
        })) as Message[];
        
        setMessages(historyMessages);
        initialMessageSent.current = true; // 已有历史记录，不需要发送初始消息
      } else if (messages.length === 0) {
        // 如果没有历史记录且消息列表为空，可以添加一条欢迎消息
        initialMessageSent.current = true;
        handleSendMessage("你好");
      }
    } catch (error) {
      console.error('加载历史聊天记录失败:', error);
      message.error('加载历史聊天记录失败');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (visible && !initialMessageSent.current && messages.length === 0 && isUserLoggedIn) {
      initialMessageSent.current = true;
    }
  }, [visible, isUserLoggedIn]);

  // 当对话框关闭时，重置状态
  useEffect(() => {
    if (!visible) {
      initialMessageSent.current = false;
      if (!isUserLoggedIn) {
        setMessages([]);
      }
    }
  }, [visible]);

  // 处理登录按钮点击
  const handleLoginClick = () => {
    onClose();
    history.push('/user/login');
  };

  // 新增一个函数，专门处理发送消息的逻辑
  const handleSendMessage = async (content: string) => {

    const userMessage: Message = {
      content: content,
      type: 'user',
      time: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // 添加一个空的AI消息，用于流式显示
    const aiMessage: Message = {
      content: '',
      type: 'ai',
      time: new Date().toLocaleTimeString(),
      isStreaming: true,
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setLoading(true);

    try {
      // 使用getCurrentUser获取当前用户信息
      const userResponse = await getCurrentUser();
      const userId = userResponse.data?.id || '0';
      
      // 调用AI服务
      const response = await service2({ prompt: content, chatId: userId });
      
      // 更全面地处理各种可能的响应格式
      let aiResponseText = '';
      
      if (response) {
        if (Array.isArray(response) && response.length > 0) {
          aiResponseText = response[0];
        } else if (typeof response === 'string') {
          aiResponseText = response;
        }
      }
      
      // 逐字符显示文本，模拟流式输出
      let displayedText = '';
      for (let i = 0; i < aiResponseText.length; i++) {
        displayedText += aiResponseText[i];
        
        // 更新消息内容
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.type === 'ai' && lastMessage.isStreaming) {
            lastMessage.content = displayedText;
          }
          return newMessages;
        });
        
        // 等待一小段时间，模拟打字效果
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      // 完成流式输出
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.type === 'ai' && lastMessage.isStreaming) {
          lastMessage.isStreaming = false;
        }
        return newMessages;
      });
      
    } catch (error) {
      message.error('服务异常，请稍后再试');
      // 移除空的AI消息
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  // 原来的handleSend函数现在调用handleSendMessage
  const handleSend = () => {
    if (!inputValue.trim()) {
      return;
    }
    
    const content = inputValue;
    setInputValue('');
    handleSendMessage(content);
  };

  // 其余部分保持不变
  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className={styles.deepseekModal}
      closeIcon={<CloseOutlined className={styles.closeIcon} />}
      styles={{
        body: { 
          height: 600, 
          display: 'flex', 
          flexDirection: 'column',
          padding: 0,
          borderRadius: '12px',
          overflow: 'hidden'
        }
      }}
    >
      <div className={styles.chatHeader}>
        <RobotOutlined className={styles.headerIcon} />
        <span className={styles.headerTitle}>AI助手-小喵</span>
      </div>
      
      <div className={styles.chatContainer}>
        {historyLoading ? (
          <div className={styles.loadingContainer}>
            <Spin>
              <div style={{ padding: '50px', textAlign: 'center' }}>
                加载历史消息中...
              </div>
            </Spin>
          </div>
        ) : (
          <div className={styles.messageList}>
            {/* 消息列表 */}
            {messages.map((item, index) => (
              <div 
                key={index} 
                className={`${styles.messageItem} ${item.type === 'user' ? styles.userMessageItem : styles.aiMessageItem}`}
              >
                <div className={styles.messageAvatar}>
                  {item.type === 'user' ? (
                    currentUser?.avatar_url ? (
                      <Avatar src={currentUser.avatar_url} className={styles.userAvatar} />
                    ) : (
                      <Avatar icon={<UserOutlined />} className={styles.userAvatar} />
                    )
                  ) : (
                    <Avatar icon={<RobotOutlined />} className={styles.aiAvatar} />
                  )}
                </div>
                <div className={styles.messageContentWrapper}>
                  <div className={styles.messageSender}>
                    {item.type === 'user' ? (currentUser?.nickname || '我') : 'AI助手'}
                  </div>
                  <div className={styles.messageContent}>
                    {item.content}
                    {item.isStreaming && <span className={styles.cursor}>|</span>}
                  </div>
                  <div className={styles.messageTime}>{item.time}</div>
                </div>
              </div>
            ))}
            {!isUserLoggedIn && (
              <div className={styles.loginPrompt}>
                <Button type="primary" onClick={handleLoginClick}>
                  去登录
                </Button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* 输入区域 */}
      <div className={styles.inputContainer}>
        <TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isUserLoggedIn ? "请输入您的问题..." : "请先登录后再使用AI助手功能"}
          autoSize={{ minRows: 1, maxRows: 4 }}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={loading || !isUserLoggedIn}
          className={styles.chatInput}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={loading}
          disabled={!isUserLoggedIn}
          className={styles.sendButton}
        >
          发送
        </Button>
      </div>
    </Modal>
  );
};

export default AIChat;