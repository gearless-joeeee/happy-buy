import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const defaultRequestConfig = {
  url: '/',
  methods: 'GET',
  data: {},
  params: {}
}

export default function useRequest() {
  const navigate = useNavigate()
    // 发起新的请求前,清空上次请求的状态

  const loginToken = localStorage.getItem('token')
  const request = (config) => {
    // 发起请求时携带tok

    const headers = loginToken ? { token: loginToken, } : {}
    return axios.request({
      baseURL: 'http://api.proxyman.io/mock/',
      url: config.url,
      method: config.method,
      data: config.data || defaultRequestConfig.data ,
      params: config.params || defaultRequestConfig.params,
      headers,
    })
    .then((response) => {
      return response.data
    })
    .catch((e) => {
      if (e?.response?.status === 403) {
        localStorage.removeItem('token')
        navigate('/login')
      }
      throw new Error(e)
    })
  }
  return request
}
