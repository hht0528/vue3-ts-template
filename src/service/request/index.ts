import axios, { AxiosResponse } from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import type { RequestConfig, RequestInterceptors, CreateRequestConfig, BaseResponse } from './types'
import { ElMessage } from 'element-plus'
import { getMessageInfo } from './status'

class Request {
  // axios 实例
  instance: AxiosInstance
  // 拦截器对象
  interceptorsObj?: RequestInterceptors<AxiosResponse<BaseResponse, any>>
  // * 存放取消请求控制器Map
  abortControllerMap: Map<string, AbortController>

  constructor(config: CreateRequestConfig) {
    //console.log(1111)
    this.instance = axios.create(config)
    // * 初始化存放取消请求控制器Map
    this.abortControllerMap = new Map()
    this.interceptorsObj = config.interceptors
    // 拦截器执行顺序 接口请求 -> 实例请求 -> 全局请求 -> 实例响应 -> 全局响应 -> 接口响应
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const controller = new AbortController()
        const url = config.url || ''
        config.signal = controller.signal
        this.abortControllerMap.set(url, controller)
        return config
      },
      (err: any) => err
    )

    this.instance.interceptors.response.use(
      (response) => {
        //删除当前取消队列
        console.log('response2')
        const url = response.config.url || ''
        this.abortControllerMap.delete(url)
        return response
      },
      (err) => {
        const { response } = err
        if (response) {
          ElMessage({
            message: getMessageInfo(response.status),
            type: 'error',
          })
          return Promise.reject(response.data)
        }
        ElMessage({
          message: '网络连接异常,请稍后再试!',
          type: 'error',
        })
      }
    )

    // 使用实例拦截器
    this.instance.interceptors.request.use(
      this.interceptorsObj?.requestInterceptors,
      this.interceptorsObj?.requestInterceptorsCatch
    )
    this.instance.interceptors.response.use(
      this.interceptorsObj?.responseInterceptors,
      this.interceptorsObj?.responseInterceptorsCatch
    )
  }

  request<T>(config: RequestConfig<AxiosResponse<T, any>>) {
    //接口请求拦截
    if (config.interceptors?.requestInterceptors) {
      config = config.interceptors.requestInterceptors(config as any)
    }

    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<T>(config)
        .then((res) => {
          //接口响应
          if (config.interceptors?.responseInterceptors) {
            res = config.interceptors.responseInterceptors(res)
          }
          resolve(res.data)
          // console.log(config)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * 取消全部请求
   */
  cancelAllRequest() {
    for (const [, controller] of this.abortControllerMap) {
      controller.abort()
    }
    this.abortControllerMap.clear()
  }
  /**
   * 取消指定的请求
   * @param url 待取消的请求URL
   */
  cancelRequest(url: string | string[]) {
    const urlList = Array.isArray(url) ? url : [url]
    for (const _url of urlList) {
      this.abortControllerMap.get(_url)?.abort()
      this.abortControllerMap.delete(_url)
    }
  }

  get<T>(config: RequestConfig) {
    return this.request<BaseResponse<T>>({ ...config, method: 'GET' })
  }
}

export default Request
export { RequestConfig, RequestInterceptors }
