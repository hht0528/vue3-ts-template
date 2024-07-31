import axios, { AxiosResponse } from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import type { RequestConfig, RequestInterceptors, CreateRequestConfig, BaseResponse } from './types'

import { message } from 'ant-design-vue'

class Request {
  // axios 实例
  private instance: AxiosInstance
  // 拦截器对象
  private interceptorsObj?: RequestInterceptors<AxiosResponse<BaseResponse, any>>
  // * 存放取消请求控制器Map
  private abortControllerMap: Map<string, AbortController>

  constructor(config: CreateRequestConfig) {
    this.instance = axios.create(config)
    // * 初始化存放取消请求控制器Map
    this.abortControllerMap = new Map()
    this.interceptorsObj = config.interceptors

    // 拦截器执行顺序 接口请求 -> 实例请求 -> 全局请求 -> 实例响应 -> 全局响应 -> 接口响应
    this.instance.interceptors.request.use(
      //全局请求拦截
      (config: InternalAxiosRequestConfig) => {
        const controller = new AbortController()
        const url = config.url || ''
        config.signal = controller.signal
        //添加当前请求地址
        this.abortControllerMap.set(url, controller)

        //请求提示
        message.loading('正在请求', 0)
        return config
      },
      (err: any) => err
    )

    // 实例请求拦截器
    this.instance.interceptors.request.use(
      this.interceptorsObj?.requestInterceptors,
      this.interceptorsObj?.requestInterceptorsCatch
    )
    //实例响应拦截
    this.instance.interceptors.response.use(
      this.interceptorsObj?.responseInterceptors,
      this.interceptorsObj?.responseInterceptorsCatch
    )

    //全局响应拦截
    this.instance.interceptors.response.use(
      (response) => {
        //删除当前取消队列
        const url = response.config.url || ''
        this.abortControllerMap.delete(url)
        return response.data
      },
      (err) => err
    )
  }

  private _request<T>(config: RequestConfig<T>): Promise<T> {
    //接口请求拦截
    if (config.interceptors?.requestInterceptors) {
      config = config.interceptors.requestInterceptors(config as any)
    }

    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, T>(config)

        //全局响应拦截
        .then((res) => {
          if (config.interceptors?.responseInterceptors) {
            //接口响应拦截
            res = config.interceptors.responseInterceptors(res)
          }
          resolve(res)
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

  get<T = any>(config: RequestConfig<T>) {
    return this._request<T>({ ...config, method: 'GET' })
  }

  post<T = any>(config: RequestConfig<T>) {
    return this._request<T>({ ...config, method: 'POST' })
  }

  delete<T = any>(config: RequestConfig<T>) {
    return this._request<T>({ ...config, method: 'DELETE' })
  }

  patch<T = any>(config: RequestConfig<T>) {
    return this._request<T>({ ...config, method: 'PATCH' })
  }
}

export default Request
export { RequestConfig, RequestInterceptors }
