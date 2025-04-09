import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Select, Typography } from 'antd';
import { useModel } from '@umijs/max';
import { update } from '@/services/user-center/userController';
import { createStyles } from 'antd-style';
import UserInfo from '@/components/UserInfo';  // 添加这行

const { Option } = Select;
const { Text } = Typography;

const useStyles = createStyles(({ token }) => ({
    container: {
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
        marginTop: '80px',
    },
    avatar: {
        width: '100px',
        height: '100px',
        margin: '0 auto 20px',
        display: 'block',
    },
    form: {
        maxWidth: '600px',
        margin: '0 auto',
    },
    submitButton: {
        width: '100px',
        display: 'block',
        margin: '0 auto',
    },
    // 添加顶部栏样式
    topBar: {
        width: '100%',
        height: '60px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 50px',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
    },
    userInfo: {
        position: 'absolute',
        right: '50px',
    },
    username: {
        color: token.colorTextSecondary,
        cursor: 'pointer',
        '&:hover': {
            color: token.colorPrimary,
        },
    },
}));

// 添加必要的导入
import { upload } from '@/services/user-center/fileController';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';

const ProfilePage: React.FC = () => {
    const { styles } = useStyles();
    const { initialState, setInitialState } = useModel('@@initialState');
    const { currentUser } = initialState || {};
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);  // 添加上传loading状态

    const handleUpload = async (file: File) => {
        try {
            setUploadLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            const res = await upload(formData);
            if (res.status === 200 && res.message) {
                form.setFieldValue('avatar_url', res.message);
                message.success('上传成功');
            } else {
                message.error(res.message);
            }
        } catch (error: any) {
            message.error('上传失败：' + error.message);
        } finally {
            setUploadLoading(false);
        }
    };

    const onFinish = async (values: API.UserUpdateRequestDTO) => {
        setLoading(true);
        try {
            const res = await update({
                id: currentUser?.id,
                ...values,
            });

            if (res.status === 200) {
                message.success('个人信息修改成功');
                // 更新全局用户信息
                if (initialState?.fetchUserInfo) {
                    const userInfo = await initialState.fetchUserInfo();
                    setInitialState((s) => ({
                        ...s,
                        currentUser: userInfo,
                    }));
                }
            }
        } catch (error: any) {
            message.error('更新失败：' + error.message);
        }
        setLoading(false);
    };



    return (
        <div>
            <div className={styles.topBar}>
                <UserInfo />
            </div>
            {/* 原有的内容 */}
            <div className={styles.container}>
                <Card title="个人信息修改">
                    <Upload
                        name="file"
                        listType="picture-card"
                        showUploadList={false}
                        className={styles.avatar}
                        accept="image/*"  // 添加这行，限制只能选择图片文件
                        beforeUpload={(file) => {
                            // 验证文件类型
                            const isImage = file.type.startsWith('image/');
                            if (!isImage) {
                                message.error('只能上传图片文件！');
                                return false;
                            }
                            // 验证文件大小
                            if (file.size > 5 * 1024 * 1024) {
                                message.error('图片大小不能超过 5MB');
                                return false;
                            }
                            handleUpload(file);
                            return false;
                        }}
                    >
                        {form.getFieldValue('avatar_url') || currentUser?.avatar_url ? (
                            <img
                                src={form.getFieldValue('avatar_url') || currentUser?.avatar_url}
                                alt="avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div>
                                {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
                                <div style={{ marginTop: 8 }}>上传头像</div>
                            </div>
                        )}
                    </Upload>
                    <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '20px' }}>
                        点击头像可更换图片
                    </Text>

                    <Form
                        form={form}
                        layout="vertical"
                        className={styles.form}
                        initialValues={{
                            nickname: currentUser?.nickname,
                            gender: currentUser?.gender,
                            phone: currentUser?.phone,
                            email: currentUser?.email,
                            avatar_url: currentUser?.avatar_url,
                        }}
                        onFinish={onFinish}
                    >
                        {/* 添加隐藏的头像字段 */}
                        <Form.Item
                            name="avatar_url"
                            hidden
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="昵称"
                            name="nickname"
                            rules={[{ required: true, message: '请输入昵称' }]}
                        >
                            <Input placeholder="请输入昵称" />
                        </Form.Item>

                        <Form.Item
                            label="性别"
                            name="gender"
                        >
                            <Select placeholder="请选择性别">
                                <Option value={0}>男</Option>
                                <Option value={1}>女</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="手机号"
                            name="phone"
                            rules={[
                                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                            ]}
                        >
                            <Input placeholder="请输入手机号" />
                        </Form.Item>

                        <Form.Item
                            label="邮箱"
                            name="email"
                            rules={[
                                { type: 'email', message: '请输入正确的邮箱格式' }
                            ]}
                        >
                            <Input placeholder="请输入邮箱" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className={styles.submitButton}
                            >
                                保存修改
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default ProfilePage;