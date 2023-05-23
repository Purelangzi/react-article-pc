import { useRoutes, Navigate } from 'react-router-dom'
import { LazyLoad } from '../utils'
import Layouts from '../layout'
import AuthRoute from '../components/AuthRoute'
const BaseRouter = () => {
  let element = useRoutes([
   
    {
      path: '/',
      element: (
        <AuthRoute>
          <Layouts />
        </AuthRoute>
      ),
      children: [
        {
          index: true,
          element: LazyLoad('Home'),
        },
        {
          path: 'article',
          element: LazyLoad('Article'),
        },
        {
          path: 'publish',
          element: LazyLoad('Publish'),
        },
      ],
    },
    {
      path: '/login',
      element: LazyLoad('Login'),
    },
    {
      path: '*',
      element: <Navigate to="/" />,
    },
  ])
  return element
}
export default BaseRouter
