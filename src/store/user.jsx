import { makeAutoObservable } from 'mobx'
import { makePersistable,clearPersistedStore } from 'mobx-persist-store'

import { http } from '@/utils'
class UserStore {
  constructor() {
    makeAutoObservable(this)

    makePersistable(this, {
      name: 'UserInfoStore',
      properties: ['userInfo'],
      storage: window.localStorage,
    })
  }
  userInfo = {}
  getUserInfo = async () => {
    const res = await http.get('/user/profile')
    // 使用 runInAction在内部处理getUserInfo异步结果
    // runInAction(()=>{
    //   this.userInfo = res.data
    // })
    // 或在单独的函数中进行
    this.setUser(res.data)
  }
  setUser = (userData) =>[
    this.userInfo = userData
  ]
  // logOut = () =>{

  // }
  // 删除持久化的数据
  async clearStoredDate() {
    this.userInfo = {}
    await clearPersistedStore(this)
  }
}
export default UserStore
