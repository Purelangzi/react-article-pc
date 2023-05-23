import { makeAutoObservable } from 'mobx'

import { makePersistable, pausePersisting, startPersisting,isHydrated,clearPersistedStore,getPersistedStore} from 'mobx-persist-store'
import { http } from '../utils'
class LoginStore {
  constructor() {
    makeAutoObservable(this)
    // 持久化存储配置
    makePersistable(this, {
      name: 'TokenStore',
      properties: ['token'],
      storage: window.localStorage,
    })
  }
  token = ''
  login = async ({ mobile, code }) => {
    const res = await http.post('http://geek.itheima.net/v1_0/authorizations', {
      mobile,
      code,
    })
    this.token = res.data.token
  }
  // 暂停持久化
  pauseStore() {
    pausePersisting(this)
  }
  // 开始持久化
  startStore() {
    console.log('开始持久化');
    startPersisting(this)
  }
  // 是否存储完成
  get isHydrated() {
    return isHydrated(this)
  }
  // 删除持久化的数据
  async clearStoredDate() {
    await clearPersistedStore(this)
  }
  // 取持久化的数据
  async getStoredData() {
    return getPersistedStore(this)
  }
}
export default LoginStore