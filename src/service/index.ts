import { message } from 'ant-design-vue'
import Request from './request'
import { getMessageInfo } from './request/status'

const request = new Request({
  baseURL: import.meta.env.VITE_MOCK_URL,
  timeout: 15000,
  interceptors: {
    //实例请求拦截
    requestInterceptors: (config) => {
      const token = localStorage.getItem('TOKEN')
      if (config.headers && token) {
        config.headers.Authorization = token
      }
      return config
    },

    //实例响应拦截
    responseInterceptors(response) {
      if (response.status === 200) {
        //成功提示
        message.destroy()
        message.success('请求成功', 1)
        return response
      }
      message.destroy()
      message.error(getMessageInfo(response.status), 1)
      return response
    },
  },
})

export default request
