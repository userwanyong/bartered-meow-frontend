import React from 'react';
import { Card, Avatar, Row, Col, Typography, Divider, Space, Tag } from 'antd';
import { createStyles } from 'antd-style';
import { GithubOutlined, MailOutlined, GlobalOutlined } from '@ant-design/icons';
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
        name: '郭恩楠',
        role: '组织协调、前端开发',
        avatar: 'https://bartered-meow.oss-cn-beijing.aliyuncs.com/10221e3b-6d4f-4eb3-996f-4f049145f230.png',
        bio: '负责项目的组织、前端部分工程的设计与实现，具有丰富的React开发经验',
        skills: ['React', 'TypeScript', 'Ant Design', 'UmiJS'],
        github: 'https://github.com/CM2021178gl',
        email: '2686084667@qq.com',
        blog: '',
    },
    {
        name: '万永健',
        role: '前、后端开发',
        avatar: 'https://bartered-meow.oss-cn-beijing.aliyuncs.com/30c058cd-4253-401d-aec3-4ee85e43bb29.jpg',
        bio: '负责项目的部分前端开发、以及后端API设计与实现，专注于高性能服务开发',
        skills: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
        github: 'https://github.com/userwanyong',
        email: '2026804718@qq.com',
        blog: 'https://userwanyong.github.io',
    },
    {
        name: '陈鸿利',
        role: '---',
        avatar: 'https://bartered-meow.oss-cn-beijing.aliyuncs.com/fd429664-2db5-4e45-b615-1d7707300713.jpg',
        bio: '---',
        skills: ['SpringAI', 'DDD', 'JustAuth', 'oss'],
        github: '---',
        email: '---',
        blog: '',
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
                    <Title className={styles.teamTitle}>智喵集市制作组</Title>
                    <Paragraph className={styles.teamSubtitle}>
                        我们是一支充满激情的团队，致力于打造最优质的AI交易平台，为用户提供便捷、安全的交易体验
                    </Paragraph>
                </div>

                <div className={styles.projectInfo}>
                    <Title level={3} style={{ marginBottom: '16px' }}>项目简介</Title>
                    <Paragraph>
                        智喵集市是一个基于人工智能技术的交易平台，旨在为用户提供智能化的交易体验。
                        平台集成了智能推荐、AI助手、自动化交易等功能，让交易变得更加简单高效。
                        本项目是2025中国大学生计算机设计大赛的参赛作品，由智喵集市团队精心打造
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
                                <Tag color="cyan">Spring AI</Tag>
                                <Tag color="orange">JustAuth</Tag>
                                <Tag color="green">oss</Tag>
                            </Space>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Title level={4}>项目特点</Title>
                            <li>智能AI助手，提供实时交易建议</li>
                            <li>简洁直观的用户界面</li>
                            <li>完善的用户服务体系</li>
                            <li>模拟真实支付场景</li>
                            <li>集成第三方登录</li>
                        </Col>
                    </Row>
                </div>

                <Title className={styles.sectionTitle}>团队成员</Title>
                <Row gutter={[24, 24]} justify="center">
                    {teamMembers.map((member, index) => (
                        <Col xs={24} sm={12} md={8} lg={8} key={index}>
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
                                        <a href={member.blog} target="_blank" rel="noopener noreferrer">
                                            <GlobalOutlined style={{ fontSize: '20px' }} />
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