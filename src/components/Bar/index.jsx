import * as echarts from 'echarts'
import { useRef, useEffect } from 'react'



const Bar = ({title,xData,sData,style={width: '800px', height: '400px'}}) => {
  const barRef = useRef(null)
  const echartInit = () => {
    const myChart = echarts.init(barRef.current)
    myChart.setOption({
      title: {
        text: title,
      },
      tooltip: {},
      xAxis: {
        data: xData,
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: sData,
        },
      ],
    })
  }
  useEffect(() => {
    echartInit()
  }, [])


  return (
    <div>
      <div ref={barRef} style={style}></div>
    </div>
  )
}

export default Bar
