import { createContext, useContext } from 'react'
import LoginStore from './login'
import UserStore from './user'
import ThemeStore from './theme'
class RootStore {
  constructor() {
    this.LoginStore = new LoginStore()
    this.UserStore = new UserStore()
    this.ThemeStore = new ThemeStore()
  }
}
const context = createContext(new RootStore())
const useStore = () => useContext(context)
export default useStore
