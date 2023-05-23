import { makeAutoObservable } from 'mobx'
import { makePersistable} from 'mobx-persist-store'

import { http } from "../utils";
class UserStore{
  constructor(){
    makeAutoObservable(this)
    
    makePersistable(this,{
      name:'UserInfoStore',
      properties:['userInfo'],
      storage: window.localStorage,
    })
    userInfo={}
    getUserInfo = async()=>{
      const res = await http.get('/user/profile')
      this.userInfo = res.data
    }
  }
}
export default UserStore