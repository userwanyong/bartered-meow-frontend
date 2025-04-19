import React, { useState, useRef, useEffect } from 'react';
import { Modal, Input, Button, List, Avatar, Spin, message } from 'antd';
import { RobotOutlined, SendOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons';
import { service2 } from '@/services/user-center/aiUserController';
import { getCurrentUser } from '@/services/user-center/userController';
import styles from './index.less';

const { TextArea } = Input;

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageSent = useRef<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 当对话框打开且没有发送过初始消息时，自动发送"你好"
  useEffect(() => {
    if (visible && !initialMessageSent.current && messages.length === 0) {
      initialMessageSent.current = true;
      handleSendMessage("你好");
    }
  }, [visible]);

  // 当对话框关闭时，重置状态
  useEffect(() => {
    if (!visible) {
      initialMessageSent.current = false;
    }
  }, [visible]);

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
      bodyStyle={{ 
        height: 600, 
        display: 'flex', 
        flexDirection: 'column',
        padding: 0,
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      <div className={styles.chatHeader}>
        <RobotOutlined className={styles.headerIcon} />
        <span className={styles.headerTitle}>AI助手-小喵</span>
      </div>
      
      <div className={styles.chatContainer}>
        <div className={styles.messageList}>
          {messages.map((item, index) => (
            <div 
              key={index} 
              className={`${styles.messageItem} ${item.type === 'user' ? styles.userMessageItem : styles.aiMessageItem}`}
            >
              <div className={styles.messageAvatar}>
                {item.type === 'user' ? (
                  <Avatar icon={<UserOutlined />} className={styles.userAvatar} />
                ) : (
                  <Avatar icon={<RobotOutlined />} className={styles.aiAvatar} />
                )}
              </div>
              <div className={styles.messageContentWrapper}>
                <div className={styles.messageSender}>
                  {item.type === 'user' ? '我' : 'AI助手'}
                </div>
                <div className={styles.messageContent}>
                  {item.content}
                  {item.isStreaming && <span className={styles.cursor}>|</span>}
                </div>
                <div className={styles.messageTime}>{item.time}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className={styles.inputContainer}>
        <TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="请输入您的问题..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={loading}
          className={styles.chatInput}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={loading}
          className={styles.sendButton}
        >
          发送
        </Button>
      </div>
    </Modal>
  );
};

export default AIChat;