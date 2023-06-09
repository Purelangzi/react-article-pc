import axios from "axios"
import {notification} from 'antd'

const http = axios.create({
  baseURL:'http://geek.itheima.net/v1_0',
  timeout:5000
})

let store = ''

http.interceptors.request.use(config=>{
  store = JSON.parse(localStorage.getItem('TokenStore'))
  if(store.token){
    config.headers.Authorization = `Bearer ${store.token}`
  }
  return config
},error=>{
  return Promise.reject(error)
})
http.interceptors.response.use(response=> {

  return response.data
}, error=> {
  const code = error.response.status
  if(code ===401){
    notification.error({
      message:'token过期,请重新登录',
    })
    localStorage.removeItem('TokenStore')
    window.location.href = '/login'
  }
  return Promise.reject(error.response.data)
})
export default http