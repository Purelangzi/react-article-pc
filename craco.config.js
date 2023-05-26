const path = require('path')
const { whenProd, getPlugin, pluginByName } = require('@craco/craco')
module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    // 配置CDN
    configure: (webpackConfig) => {
      // webpackConfig自动注入的webpack配置对象
      // 可以在这个函数中对它进行详细的自定义配置
      // 只要最后return出去就行
      let cdn = {
        js: [],
        css: []
      }
      // 只有生产环境才配置
      whenProd(() => {
        // key:需要不参与打包的具体的包
        // value: cdn文件中 挂载于全局的变量名称 为了替换之前在开发环境下
        // 通过import 导入的 react / react-dom / echarts /antd，antd内部引用了dayjs需要dayjs
        webpackConfig.externals = {
          'react': 'React',
          'react-dom': 'ReactDOM',
          'mobx':'mobx',
          'echarts':'echarts',
          dayjs:'dayjs',
          antd:'antd',
          axios: 'axios'
        }
        // 配置现成的cdn 资源数组 现在是公共为了测试
        // 实际开发的时候 用公司自己花钱买的cdn服务器
        cdn = {
          js: [
  
            'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/mobx/6.9.0/mobx.umd.production.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.2/echarts.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7/dayjs.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/antd/5.5.1/antd.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js'
          ],
          css: []
        }
      })

      // 都是为了将来配置 htmlWebpackPlugin插件 将来在public/index.html注入
      // cdn资源数组时 准备好的一些现成的资源
      const { isFound, match } = getPlugin(
        webpackConfig,
        pluginByName('HtmlWebpackPlugin')
      )

      if (isFound) {
        // 找到了HtmlWebpackPlugin的插件
        match.userOptions.files = cdn
      }

      return webpackConfig
    }
  },
  
}
