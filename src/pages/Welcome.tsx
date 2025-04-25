import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: React.ReactNode;
  href: string;
}> = ({ title, href, index, desc }) => {
  const { useToken } = theme;

  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <a href={href} target="_blank" rel="noreferrer">
        了解更多 {'>'}
      </a>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        styles={{
          body: {
            backgroundImage:
              initialState?.settings?.navTheme === 'realDark'
                ? 'linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
                : 'linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
          },
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
            }}
          >
            交易喵-AI交易平台
          </div>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            阶段一（已完成）、阶段二、阶段三
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              index={1}
              href=""
              title="阶段一"
              desc={
                <>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>用户端</div>
                  •  商品首页 [第一阶段]
                  <br />
                  •  个人信息 [第一阶段]
                  <br />
                  •  修改密码 [第一阶段]
                  <br />
                  •  忘记密码 [第一阶段]
                  <br />
                  •  我要买 [第一阶段]
                  <br />
                  •  我要卖（CRUD） [第一阶段]
                  <br />
                  •  我的购物车（收藏）[第一阶段]
                  <br />
                  •  我的订单  [第一阶段]
                  <br />
                  •  我的成交记录  [第一阶段]
                  <br />
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>管理端</div>
                  •  用户管理  [第一阶段]
                  <br />
                  •  商品管理  [第一阶段]
                  <br />
                  •  分类管理  [第一阶段]
                  <br />
                  •  订单管理  [第一阶段]
                </>
              }
            />
            <InfoCard
              index={2}
              title="阶段二"
              href=""
              desc={
                <>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>用户端</div>
                  •  对商品进行评论  [第二阶段]
                  <br />
                  •  历史浏览记录  [第二阶段]
                  <br />
                  •  第三方登陆  [第二阶段]
                  <br />
                  •  AI助手（在与AI的对话中完成，eg.告诉自己的需求，期望的价格范围等，由AI查询数据库并总结返回给用户。 eg.将繁杂的使用可视化界面的相关操作交给AI完成，个人信息的修改，修改密码，售卖商品，购买商品等非重要信息，支付and重要信息由用户自主填写，AI将严格遵守本平台的规定，只回答相关问题，其他无关问题一律不回答，保证专一性）[第二阶段]
                  <br />
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>管理端</div>
                  •  审核管理   [第二阶段]
                  <br />
                  •  评论管理   [第二阶段]
                  <br />
                  •  操作日志  [第二阶段]
                  <br />
                  •  公告管理  [第二阶段]
                  <br />
                  •  数据的批量导入导出  [第二阶段]
                  <br />
                  •  基于AI的数据统计（在与AI的对话中完成，帮助管理员分析商品的售卖情况，日常流水，调用接口直接导出数据等） [第二阶段]
                </>
              }
            />
            <InfoCard
              index={2}
              title="阶段三"
              href=""
              desc={
                <>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>性能优化</div>
                  •  使用redis缓存提高查询速度，减轻数据库压力
                  <br />
                  •  使用ES进行搜索，提高搜索效率
                  <br />
                  •  使用mq进行消息的异步处理，使请求结果更快返回给用户，提高用户体验
                  <br />
                  •  对数据库进行分库分表以适应海量数据
                  <br />
                  •  拆分为微服务，各模块多服务器部署，服务间使用rpc通信，提高响应速度
                  <br />
                  •  拓展权限模块，使用satoken进行权限管理
                  <br />
                  •  使用xxl-job进行定时任务，处理规定时间内未支付订单
                </>
              }
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
