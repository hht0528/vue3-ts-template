import { ElMessage } from 'element-plus'
import Request from './request'
import { getMessageInfo } from './request/status'

const request = new Request({
  baseURL: '11111',
  timeout: 10000,
  interceptors: {
    requestInterceptors: (config) => {
      const token = localStorage.getItem('TOKEN')
      if (config.headers && token) {
        config.headers.Authorization = token
      }
      return config
    },
    responseInterceptors(response) {
      console.log('response')
      if (response.status === 200) {
        return response
      }
      ElMessage({ type: 'error', message: getMessageInfo(response.status) })
      return response
    },
  },
})

export default request
