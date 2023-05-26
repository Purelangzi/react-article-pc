import useStore from '@/store'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
const AuthRoute = ({ children }) => {
  const { LoginStore } = useStore()
  const navigate = useNavigate()
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
