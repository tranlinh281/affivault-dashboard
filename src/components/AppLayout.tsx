import { Button, Layout, Menu, Space, Typography, message } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  FlagOutlined,
  LinkOutlined,
  LogoutOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { supabase } from '../lib/supabase';
import { ImportOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      message.error('Logout failed');
      return;
    }

    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark">
        <div style={{ padding: 16 }}>
          <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
            AffiVault
          </Typography.Title>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: '/',
              icon: <DashboardOutlined />,
              label: <Link to="/">Dashboard</Link>,
            },
            {
              key: '/links',
              icon: <LinkOutlined />,
              label: <Link to="/links">Links</Link>,
            },
            {
              key: '/categories',
              icon: <TagsOutlined />,
              label: <Link to="/categories">Categories</Link>,
            },
            {
              key: '/import',
              icon: <ImportOutlined />,
              label: <Link to="/import">Import</Link>,
            },
            {
              key: '/campaigns',
              icon: <FlagOutlined />,
              label: <Link to="/campaigns">Campaigns</Link>,
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ background: '#fff' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Typography.Text strong>Affiliate Content Workspace</Typography.Text>

            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Button>
          </Space>
        </Header>

        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}