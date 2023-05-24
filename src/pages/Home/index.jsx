import Bar from '../../components/Bar'

import './index.scss'

const Home = () => {
  const BarData = [
    {
      id:1,
      title:"主流框架满意度",
      xData:['react', 'vue', 'angular'],
      sData:[30, 40, 50]
    },
    {
      id:2,
      title:"主流框架使用度",
      xData:['react', 'vue', 'angular'],
      sData:[60, 70, 80]
    }
  ]
  return (
    <div className='Home'>
      {BarData.map(item=><Bar key={item.id} title={item.title} xData={item.xData} sData={item.sData} />)}
    </div>
  )
}

export default Home
