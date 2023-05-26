import {lazy,Suspense} from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);


const LazyLoad = (path)=>{

  const Comp = lazy(()=>import('../pages/'+path))
  return(
    <Suspense fallback={<Spin indicator={antIcon} />}>
      <Comp></Comp>
    </Suspense>
  )
}
export default LazyLoad