import logo from '../../assets/logo.png'
import './index.scss'
import { useEffect } from 'react'
import {
  Card,
  Button,
  Checkbox,
  Form,
  Input,
  message,
  notification,
} from 'antd'
import useStore from '../../store'
import { useNavigate } from 'react-router-dom'
const Login = () => {
  const { LoginStore } = useStore()
  const navigate = useNavigate()
  // 已登录不能进登录页
  useEffect(() => {
    if (LoginStore.token) {
      navigate('/', { replace: true })
    }
  }, []) 
  // 防止过多渲染
  if (LoginStore.token){
    return
  }
  console.log('444');
  const onFinish = async (values) => {
    const { mobile, code } = values
    try {
      await LoginStore.login({ mobile, code })
      navigate('/', { replace: true })
      // LoginStore.startStore()
      // useEffect(() => {
      //   navigate('/',{replace:true})
      // }, [])
      notification.success({ message: '登录成功' })
    } catch (error) {
      message.error(error.message)
    }
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} />
        <Form
          name="basic"
          size="large"
          // labelAlign="left"
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 18,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            mobile: '13333333333',
            code: '246810',
            remember: true,
          }}
          validateTrigger={['onBlur', 'onChange']}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          <Form.Item
            label="手机号"
            name="mobile"
            rules={[
              {
                required: true,
                message: ' 请输入手机号!',
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号码格式不对',
                validateTrigger: 'onBlur',
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="code"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
              { len: 6, validateTrigger: 'onBlur', message: '请输入6位密码' },
            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 2,
              span: 16,
            }}>
            <Checkbox className="login-checkbox-label">
              {' '}
              我已阅读并同意「用户协议」和「隐私条款」
            </Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 4,
              span: 16,
            }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
