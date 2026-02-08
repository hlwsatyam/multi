import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  HeartOutlined,
  InboxOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth';
import AdminDashboard from '../components/AdminDashboard';

const { Header, Sider, Content } = Layout;

const Admin = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/admin'),
    },
    {
      key: 'enquiries',
      icon: <InboxOutlined />,
      label: 'Enquiries',
      onClick: () => navigate('/admin/enquiries'),
    },
    {
      key: 'donations',
      icon: <HeartOutlined />,
      label: 'Donations',
      onClick: () => navigate('/admin/donations'),
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: 'Users',
      onClick: () => navigate('/admin/users'),
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
      onClick: () => navigate('/admin/reports'),
    },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="min-h-screen">
      <Sider
        width={250}
        theme="light"
        className="shadow-lg border-r border-gray-200"
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-lifeline-blue text-center">
            {process.env.REACT_APP_APP_NAME}
          </h1>
          <p className="text-gray-500 text-center text-sm mt-1">Admin Panel</p>
        </div>
        
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          className="border-r-0"
        />
      </Sider>

      <Layout>
        <Header className="bg-white shadow-sm px-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Welcome back, {user?.username} 👋
            </h2>
            <p className="text-gray-500 text-sm">Admin Dashboard</p>
          </div>

          <div className="flex items-center space-x-4">
            <Dropdown overlay={userMenu} placement="bottomRight" arrow>
              <div className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
                <Avatar 
                  src={user?.profilePic ? `http://localhost:5000/uploads/${user.profilePic}` : null}
                  icon={<UserOutlined />}
                  className="bg-lifeline-blue"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-800">{user?.username}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
            {/* Default content if no sub-route */}
            {!window.location.pathname.includes('/admin/') && <AdminDashboard />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;