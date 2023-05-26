import { Link, useLocation } from 'react-router-dom'
import {Breadcrumb} from 'antd'
import './index.scss'

const breadcrumbNameMap = {
  '/article': '内容管理',
  '/publish': '文章管理',
}
const  Crumbs= () => {
  const location = useLocation()
  const pathSnippets = location.pathname.split('/').filter((i) => i)

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
    return {
      key: url,
      // title: <Link to={url}>{breadcrumbNameMap[url]}</Link>,
      title:breadcrumbNameMap[url]
    }
  })
  const breadcrumbItems = [
    {
      title: <Link to="/">首页</Link>,
      key: 'home',
    },
  ].concat(extraBreadcrumbItems)
  return (
    <div className="breadcrumb">
      <Breadcrumb items={breadcrumbItems} />
    </div>
  )
}
export default Crumbs