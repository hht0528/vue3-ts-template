import request from '@/service'

export const getTest = () => {
  return request.get<testType>({
    url: '/test',
  })
}
