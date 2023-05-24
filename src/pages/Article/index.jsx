import {
  Card,
  Form,
  Radio,
  Select,
  DatePicker,
  Button,
  Image,
  Tag,
  Table,
  Space,
  Popconfirm,
  notification
} from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import 'dayjs/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import errorImg from '../../assets/error.png'
import { useEffect, useState } from 'react'
import { http } from '../../utils'
import { useNavigate } from 'react-router-dom'

const { RangePicker } = DatePicker
const Article = () => {
  const navigate = useNavigate()
  const [channels, setChannelsList] = useState([])
  const [article, setArticleList] = useState({
    list: [],
    count: 0,
  })
  const [params, setParams] = useState({
    page: 1, //当前页
    per_page: 10, // 每页条数
  })

  useEffect(() => {
    getChannelList()
  }, [])
  useEffect(() => {
    getArticlelList()
  }, [params])
  // 获取所有频道列表
  const getChannelList = async () => {
    try {
      const res = await http.get('/channels')
      setChannelsList(res.data.channels)
    } catch {}
  }
  // 获取所有文章列表
  const getArticlelList = async () => {
    try {
      const { data } = await http.get('/mp/articles', { params })
      setArticleList({
        list: data.results,
        count: data.table_count,
      })
    } catch {}
  }
  const pageChange = (page) => {
    setParams({
      ...params,
      page,
    })
  }

  const onFinish = (values) => {
    const { status, channel_id, date } = values
    const _params = {}
    _params.status = status
    if (channel_id) _params.channel_id = channel_id
    if (date) {
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    setParams({
      ...params,
      ..._params,
    })
  }
  const onDelArticle = async (data) => {
    if(data.status === 2){
      notification.warning({
        message:'不允许直接删除 已正式发表的文章',
        description:'如想删除，需要先编辑，将其变为待审核或者草稿',
        duration:6,
        
      })
      return
    }
    await http.delete(`/articles/${data.id}`)
    setParams({
      page: 1,
      per_page: 10,
    })
  }
  const onGoPublish = (data) => {
    
    navigate(`/publish?id=${data.id}`)
  }
  const StatusTag = (type) => {
    const tag = {
      0: <Tag color="default">草稿</Tag>,
      1: <Tag color="warning">待审核</Tag>,
      2: <Tag color="success">审核通过</Tag>,
      3: <Tag color="error">审核失败</Tag>,
    }
    return tag[type]
  }

  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      key: 'cover',
      render: (cover) => {
        return (
          <Image src={cover.images[0] || errorImg} width={80} height={60} />
        )
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (data) => StatusTag(data),
      // render: (data) => {
      //   if(data===1){
      //     return <Tag color="default">草稿</Tag>
      //   }else if(data===2){
      //     return <Tag color="success">审核通过</Tag>
      //   }else{
      //     return <Tag color="error">审核失败</Tag>
      //   }

      // },
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate',
      key: 'pubdate',
    },
    {
      title: '阅读数',
      dataIndex: 'read_count',
      key: 'read_count',
    },
    {
      title: '评论数',
      dataIndex: 'comment_count',
      key: 'comment_count',
    },
    {
      title: '点赞数',
      dataIndex: 'like_count',
      key: 'like_count',
    },
    {
      title: '操作',
      render: (data) => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => onGoPublish(data)}
            />
            <Popconfirm
              title="确认删除该条文章吗"
              onConfirm={() => onDelArticle(data)}
              okText="确认"
              cancelText="取消">
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        )
      },
    },
  ]
  return (
    <div>
      <Card>
        <Form onFinish={onFinish} initialValues={{ status: '' }}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={''}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="频道" name="channel_id">
            <Select
              allowClear={true}
              placeholder="请选择文章频道"
              style={{ width: 180 }}
              options={channels.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </Form.Item>
          <Form.Item label="日期" name="date">
            <RangePicker locale={locale} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title={`根据筛选条件共查询到 ${article.count} 条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={article.list}
          pagination={{
            pageSize: params.per_page,
            total: article.count,
            onChange: pageChange,
            current: params.page,
          }}
        />
      </Card>
    </div>
  )
}

export default Article
