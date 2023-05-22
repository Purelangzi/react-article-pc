import {useRoutes} from 'react-router-dom'
import LazyLoad from '../utils/LazyLoad '
import Layouts from '../layout'

const BaseRouter = () =>{
  let element = useRoutes([
    {
      path:'/',
      element:<Layouts/>,
      children:[
        {
          index:true,
          element:LazyLoad('Home')
        },
        {
          path:'article',
          element:LazyLoad('Article')
        },
        {
          path:'publish',
          element:LazyLoad('Publish')
        },
      ]
    },
    {
      path:'/login',
      element:LazyLoad('Login')
    },
    {
      path:'*',
      element:LazyLoad('NotFound')
    }
  ])
  return element
}
export default BaseRouter