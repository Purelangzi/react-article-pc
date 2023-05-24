import { useState, useEffect } from 'react'
import { Outlet, useLocation, Link,useNavigate } from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons'
import {
  Button,
  Layout,
  Menu,
  theme,
  Image,
  Popconfirm,
  Dropdown,
  Space,
} from 'antd'
import './index.scss'
import Crumbs from './Breadcrumb'
import logo from '../assets/logo.png'
import { observer } from 'mobx-react-lite'
import useStore from '../store'
const { Header, Sider, Content } = Layout

const Layouts = () => {
  const { UserStore,LoginStore } = useStore()
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const { pathname } = useLocation()
  useEffect(() => {
    try {
      UserStore.getUserInfo()
    } catch {}
  }, [UserStore])
  const onLogout = () => {
    UserStore.clearStoredDate()
    LoginStore.clearStoredDate()
    navigate('/login',{replace:true})
    
  }
  const items = [
    {
      key:'0',
      label:UserStore.userInfo.name
    },
    {
      key: '1',
      label: UserStore.userInfo.birthday,
    },
    {
      key: '2',
      label: UserStore.userInfo.mobile,

    }
  ]
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
            items={[
              {
                key: '/',
                icon: <UserOutlined />,
                label: <Link to="/">首页</Link>,
              },
              {
                key: '/article',
                icon: <VideoCameraOutlined />,
                label: <Link to="/article">内容管理</Link>,
              },
              {
                key: '/publish',
                icon: <UploadOutlined />,
                label: <Link to="/publish">发布文章</Link>,
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
            <div className="user-info">
              <Dropdown
                menu={{
                  items,
                }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <Image width={40} height={40} src={UserStore.userInfo.photo} preview={false} />
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
              <span className="user-logout">
                <Popconfirm
                  title="是否确认退出?"
                  onConfirm={onLogout}
                  okText="退出"
                  cancelText="取消">
                  <LogoutOutlined />
                  退出
                </Popconfirm>
              </span>
            </div>
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

export default observer(Layouts)
