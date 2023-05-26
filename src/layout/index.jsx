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
  Dropdown,
  Space,
  ColorPicker,
  ConfigProvider
} from 'antd'
import './index.scss'
import Crumbs from './Breadcrumb'
import logo from '@/assets/logo.png'
import { observer } from 'mobx-react-lite'
import useStore from '@/store'
const { Header, Sider, Content } = Layout

const ThemeComponent = () => {
  const {ThemeStore } = useStore()
  return <ColorPicker value={ThemeStore.primaryColor} onChange={(_,hex)=>ThemeStore.setPrimaryColor(hex)} />;
};
const Layouts = () => {
  const { UserStore,LoginStore,ThemeStore } = useStore()
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const {token: { colorBgContainer }} = theme.useToken()
  const { pathname } = useLocation()
  useEffect(() => {
    try {
      UserStore.getUserInfo()
    } catch {}
  }, [UserStore])


  const themeClick = ({key}) =>{
    ThemeStore.setPrimaryColor(key)

  }
  const infoClick = ({key}) =>{
    if(key==='logout'){
      UserStore.clearStoredDate()
      LoginStore.clearStoredDate()
      navigate('/login',{replace:true})
    }
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
    },
    {
      key:'logout',
      label:"退出",
      icon:<LogoutOutlined/>
    }
    
  ]
  const themeItems = [
    {
      key:'#00b96b',
      label:'绿色'
    },
    {
      key: '#FFB6C1',
      label: '浅粉红',
    },
    {
      key:'#C71585',
      label:'紫色'
    },
    {
      key: '#1677ff',
      label: '默认',
    }
  ]
  return (
    <div>
      <ConfigProvider
        theme={{
          token: ThemeStore.primaryColor?{
            colorPrimary: ThemeStore.primaryColor,
          }:{}
        }}
      >
        <Layout style={{ minHeight: '100vh' }}>
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="sider-logo-vertical">
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
                  label: <Link to="/publish">文章管理</Link>,
                },
              ]}
            />
          </Sider>
          <Layout>
            <Header
              style={{
                padding: 0,
                background: colorBgContainer,
                display:'flex',
                justifyContent:'space-between'
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
              <div className='header-info'>
                <ThemeComponent/>
                <div className='system-theme'>
                  <Dropdown
                      menu={{
                        items:themeItems,
                        onClick:themeClick
                      }}>
                        <Button>
                          <Space>
                            切换主题
                            <DownOutlined />
                          </Space>
                        </Button>
                    
                    </Dropdown>
                </div>
                <div className="user-info">
                  <Dropdown
                    menu={{
                      items,
                      onClick:infoClick
                    }}>
                    <Space>
                      <Image width={40} height={40} src={UserStore.userInfo.photo} preview={false} />
                      <DownOutlined />
                    </Space>
                  </Dropdown>
                </div>
                
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
      </ConfigProvider>
    </div>
  )
}

export default observer(Layouts)
