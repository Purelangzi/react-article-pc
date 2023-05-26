import { makeAutoObservable } from 'mobx'

class Theme{
  constructor(){
    makeAutoObservable(this)
  }
  primaryColor='#1677ff'
  setPrimaryColor(color){
    this.primaryColor = color
  }

}
export default Theme