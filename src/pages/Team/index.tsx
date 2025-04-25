import React from 'react';
import { Card, Avatar, Row, Col, Typography, Divider, Space, Tag } from 'antd';
import { createStyles } from 'antd-style';
import { GithubOutlined, MailOutlined, LinkedinOutlined } from '@ant-design/icons';
import LogoHeader from '@/components/LogoHeader';
import Footer from '@/components/Footer';

const { Title, Paragraph, Text } = Typography;

const useStyles = createStyles(({ token }) => ({
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 20px 40px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  teamTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: token.colorPrimary,
  },
  teamSubtitle: {
    fontSize: '18px',
    color: token.colorTextSecondary,
    maxWidth: '700px',
    margin: '0 auto',
  },
  memberCard: {
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    height: '100%',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
    },
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '24px 0 12px',
  },
  avatar: {
    width: '120px',
    height: '120px',
    border: `4px solid ${token.colorPrimary}`,
  },
  memberInfo: {
    textAlign: 'center',
    padding: '0 16px 24px',
  },
  memberName: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '12px 0 4px',
  },
  memberRole: {
    color: token.colorPrimary,
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '12px',
  },
  memberBio: {
    color: token.colorTextSecondary,
    marginBottom: '16px',
  },
  socialLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '16px',
  },
  skillTag: {
    margin: '4px',
  },
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
  sectionTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '40px',
    textAlign: 'center',
    color: token.colorTextHeading,
  },
  projectInfo: {
    background: token.colorBgContainer,
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    marginBottom: '60px',
  },
}));

// 团队成员数据
const teamMembers = [
  {
    name: '张三',
    role: '前端开发',
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&seed=1',
    bio: '负责项目的前端架构设计与实现，拥有丰富的React开发经验。',
    skills: ['React', 'TypeScript', 'Ant Design', 'UmiJS'],
    github: 'https://github.com',
    email: 'zhangsan@example.com',
  },
  {
    name: '李四',
    role: '后端开发',
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&seed=2',
    bio: '负责项目的后端API设计与实现，专注于高性能服务开发。',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
    github: 'https://github.com',
    email: 'lisi@example.com',
  },
  {
    name: '王五',
    role: 'UI/UX设计师',
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&seed=3',
    bio: '负责项目的用户界面设计，专注于创造简洁易用的用户体验。',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'UI设计'],
    github: 'https://github.com',
    email: 'wangwu@example.com',
  },
];

const TeamPage: React.FC = () => {
  const { styles } = useStyles();

  return (
    <div>
      <div className={styles.topBar}>
        <LogoHeader />
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <Title className={styles.teamTitle}>交易喵团队</Title>
          <Paragraph className={styles.teamSubtitle}>
            我们是一支充满激情的团队，致力于打造最优质的AI交易平台，为用户提供便捷、安全的交易体验。
          </Paragraph>
        </div>

        <div className={styles.projectInfo}>
          <Title level={3} style={{ marginBottom: '16px' }}>项目简介</Title>
          <Paragraph>
            交易喵是一个基于人工智能技术的交易平台，旨在为用户提供智能化的交易体验。
            平台集成了智能推荐、AI助手、自动化交易等功能，让交易变得更加简单高效。
            本项目是2025中国大学生计算机设计大赛的参赛作品，由交易喵团队精心打造。
          </Paragraph>
          <Divider />
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12}>
              <Title level={4}>技术栈</Title>
              <Space wrap>
                <Tag color="blue">React</Tag>
                <Tag color="green">TypeScript</Tag>
                <Tag color="purple">Ant Design</Tag>
                <Tag color="orange">UmiJS</Tag>
                <Tag color="red">Spring Boot</Tag>
                <Tag color="cyan">MySQL</Tag>
                <Tag color="magenta">Redis</Tag>
              </Space>
            </Col>
            <Col xs={24} sm={12}>
              <Title level={4}>项目特点</Title>
              <ul>
                <li>智能AI助手，提供实时交易建议</li>
                <li>安全可靠的交易系统</li>
                <li>个性化推荐算法</li>
                <li>简洁直观的用户界面</li>
                <li>完善的用户服务体系</li>
              </ul>
            </Col>
          </Row>
        </div>

        <Title className={styles.sectionTitle}>团队成员</Title>
        <Row gutter={[24, 24]}>
          {teamMembers.map((member, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card className={styles.memberCard} bordered={false}>
                <div className={styles.avatarContainer}>
                  <Avatar src={member.avatar} className={styles.avatar} />
                </div>
                <div className={styles.memberInfo}>
                  <Title level={4} className={styles.memberName}>{member.name}</Title>
                  <Text className={styles.memberRole}>{member.role}</Text>
                  <Paragraph className={styles.memberBio}>{member.bio}</Paragraph>
                  <div>
                    <Space wrap size={[0, 8]}>
                      {member.skills.map((skill, idx) => (
                        <Tag color="blue" key={idx} className={styles.skillTag}>{skill}</Tag>
                      ))}
                    </Space>
                  </div>
                  <div className={styles.socialLinks}>
                    <a href={member.github} target="_blank" rel="noopener noreferrer">
                      <GithubOutlined style={{ fontSize: '20px' }} />
                    </a>
                    <a href={`mailto:${member.email}`}>
                      <MailOutlined style={{ fontSize: '20px' }} />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <LinkedinOutlined style={{ fontSize: '20px' }} />
                    </a>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      
      <Footer />
    </div>
  );
};

export default TeamPage;