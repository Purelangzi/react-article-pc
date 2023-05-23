import useStore from '../../store'
import { Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
const AuthRoute = ({ children }) => {
  console.log('AuthRoute')
  const { LoginStore } = useStore()
  const navigate = useNavigate()
  // if (LoginStore.token) {
  //   return <>{children}</>
  // } else {
  //   Navigate({to:'/login',replace:true})
  // }
  useEffect(() => {
    if (!LoginStore.token) {
      navigate('/login', { replace: true })
    }
  }, [])

  if (!LoginStore.token) {
    return null
  }
  return <>{children}</>
}

export default AuthRoute
