import {Form,Button, Radio,Input,Upload,Space,Select,notification} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {http} from '@/utils'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './index.scss'
import { useState,useEffect,useRef } from 'react'



const Publish = () => {
  
  const [fileList,setFileList] = useState([])// 已上传的图片地址列表
  const [channels, setChannelsList] = useState([])// 文章列表
  
  const [imgCount,setImgCount] = useState(1) // 保存的图片数量
  let isCheckPass = true // 上传的图片是否检查格式通过
  const cacheImgList = useRef([]) // 声明已上传图片的暂存仓库
  
  const [params] = useSearchParams()
  const articleId = params.get('id')
  const navigate = useNavigate()
  //获取当前上下文正在使用的 Form 实例
  const [form] = Form.useForm()

  useEffect(()=>{
    const getArticleDetail = async()=>{
      try {
        const {data} = await http.get(`/mp/articles/${articleId}`)
        // 设置表单的值
        form.setFieldsValue({
          ...data,
          type:data.cover.type
        })
        const newImage = data.cover.images.map(url=>({url}))
        setImgCount(data.cover.type)
        setFileList(newImage)
        cacheImgList.current = newImage
      } catch {}
      
    }
    if(articleId){
      getArticleDetail()
    }
    
  },[articleId,form])
  
  useEffect(() => {
    const getChannelList = async () => {
      try {
        const res = await http.get('/channels')
        setChannelsList(res.data.channels)
      } catch {}
    }
    getChannelList()
  }, [])
  
  
  const onRadioChange = e=>{
    const count = e.target.value
    setImgCount(count)
    // 当前没有已上传的图片
    if(!cacheImgList.current.length) return
    if(count ===1){
       // 单图，只展示第一张
       setFileList([cacheImgList.current[0]])
    }else if (count === 3){
      // 三图，显示最新上传的三张
      setFileList(cacheImgList.current.slice(-3))
    }else{
      // 无图
      setFileList([])
    }
  }
  // 上传前的回调
  const onBeforeUpload = (_,fileList) => {
    const isJpgOrPng = fileList.every(item=>{
     return item.type === 'image/jpeg' || item.type ==='image/png'
    })
    if (!isJpgOrPng) {
      notification.error({message:'只能上传 JPG/PNG 格式的图片!'});
    }
    const isLt2M = fileList.every(item=>item.size / 1024 / 1024 < 2)
    if (!isLt2M) {
      notification.error({message:'图片大小必须小于 2MB!'});
    }
    isCheckPass = isJpgOrPng && isLt2M
    return isCheckPass;
  }
  //图片上传改变时的回调(上传中，上传完成，上传失败都会触发)
  const onUploadChange = ({fileList}) => {

    // 是否通过上传前的格式检查
    if(!isCheckPass) return 
    // 手动删除图片后
    if(!fileList.length){
      setFileList(fileList)
      cacheImgList.current = []
      return
    }
    // fileList 当前的文件列表。
    const newFileList = fileList.map(file=>{
      // 拿到后端返回的url
      if(file.response?.data){
        return {...file,url:file.response.data.url}
      }
      return file
    })
    // 把图片列表存入暂存图片仓库一份
    cacheImgList.current = newFileList
    setFileList(newFileList)

  }
  // 修改或发布文章
  const onFinish = async(values) => {

    const { channel_id, content, title, type } = values
    const params = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type: type,
        images: fileList.map(item => item.response?item.response.data.url:item.url)
      }
    }
    try {
      if(articleId){
        await http.post(`/mp/articles/${articleId}?draft=false`, params)
  
      }else{
        await http.post('/mp/articles?draft=false', params)
      }
    } catch {}
    navigate('/article')
    notification.success({message:`${articleId ? '更新成功' : '发布成功'}`})
  }
   


  const propsUpload = {
    name:'image',
    listType:'picture-card',
    action: 'http://geek.itheima.net/v1_0/upload',
    onChange: onUploadChange,
    beforeUpload:onBeforeUpload,
    multiple: imgCount > 1,
    maxCount:imgCount
  };
  return ( 
    <div className='publish'>
      <Form labelCol={{span:4}} wrapperCol={{ span: 12 }} initialValues={{ type: 1 }} onFinish={onFinish}  form={form}>
        <Form.Item label="标题" name="title" rules={[{required:true,message: '请输入文章标题'}]}>
          <Input placeholder="请输入文章标题" style={{ width: 400 }} />
        </Form.Item>
        <Form.Item label="频道" name="channel_id" rules={[{required:true,message: "请选择频道"}]}>
          <Select options={channels.map(item=>({
            value: item.id,
            label: item.name
          }))} placeholder="请选择频道" style={{ width: 400 }} />
        </Form.Item>
        <Form.Item label="封面">
          <Form.Item name="type">
            <Radio.Group onChange={onRadioChange}>
              <Radio value={1}>单图</Radio>
              <Radio value={3}>三图</Radio>
              <Radio value={0}>无图</Radio>
            </Radio.Group>
          </Form.Item>
          {imgCount >0 && (
            <div>
              <Upload {...propsUpload} fileList={fileList} >
                <div style={{ marginTop: 8 }}>
                   <PlusOutlined />
                </div>
             </Upload>
             <span>jpg/png 单张小于2m</span>
            </div>
             
          )}
           
          
        </Form.Item>
        <Form.Item label="内容" name="content" rules={[{ required: true, message: '请输入文章内容' }]}>
          <ReactQuill className="publish-quill" theme="snow" placeholder="请输入文章内容"/>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {articleId?'修改':'发布'}文章
              </Button>
            </Space>
          </Form.Item>
      </Form>
    </div>
   );
}
 
export default Publish;