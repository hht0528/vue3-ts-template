import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/mock/api/test',
    method: 'get',

    response: () => {
      return {
        code: 0,
        message: 'success',
        data: {
          'rows|10': [
            {
              id: '@guid',
              name: '@cname',
              'age|20-30': 23,
              'job|1': ['前端工程师', '后端工程师', 'UI工程师', '需求工程师'],
            },
          ],
        },
      }
    },
  },
] as MockMethod[]
