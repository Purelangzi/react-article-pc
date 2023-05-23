import { createContext, useContext } from 'react'
import LoginStore from './login'
import UserStore from './user'
class RootStore {
  constructor() {
    this.LoginStore = new LoginStore()
    this.UserStore = new UserStore()
  }
}
const context = createContext(new RootStore())
const useStore = () => useContext(context)
export default useStore
