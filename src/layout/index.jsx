import { useState } from 'react'
import { Outlet,useLocation,Link } from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { Button, Layout, Menu, theme, Image } from 'antd'
import './index.scss'
import Crumbs from './Breadcrumb'
import logo from '../assets/logo.png'


const { Header, Sider, Content } = Layout

const Layouts = () => {
  console.log('333');
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const {pathname} = useLocation()

  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical">
            <Image src={logo} />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['/']}
            selectedKeys={[pathname]}
            // onClick={({ key }) => {
            //   navigate(`${key}`)
            // }}
            items={[
              {
                key: '/',
                icon: <UserOutlined />,
                label: <Link to='/'>首页</Link>,
              },
              {
                key: '/article',
                icon: <VideoCameraOutlined />,
                label: <Link to='/article'>内容管理</Link>,
              },
              {
                key: '/publish',
                icon: <UploadOutlined />,
                label: <Link to='/publish'>发布文章</Link>,
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: '12px 24px',
              minHeight: 280,
              background: colorBgContainer,
            }}>
            <Crumbs />
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default Layouts
