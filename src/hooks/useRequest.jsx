import axios from 'axios'
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import message from '../utils/message';

const defaultRequestConfig = {
  url: '/',
  methods: 'GET',
  data: {},
  params: {}
}

export default function useRequest(options) {

  const [data, setData] = useState(null)
  const navigate = useNavigate()
    // 发起新的请求前,清空上次请求的状态


  const request = useCallback((config) => {
    const loginToken = localStorage.getItem('token')
    const headers = loginToken ? { token: loginToken, } : {}
    // 登录后,每次发起请求时携带token
    return axios.request({
      baseURL: 'http://api.proxyman.io/mock/',
      url: config.url,
      method: config.method,
      data: config.data || defaultRequestConfig.data ,
      params: config.params || defaultRequestConfig.params,
      headers,
    })
    .then((response) => {
      setData(response.data)
      return response.data
    })
    .catch((e) => {
      if (e?.response?.status === 403) {
        localStorage.removeItem('token')
        navigate('/login')
      }
      throw new Error(e)
    })
  }, [navigate])

  useEffect(()=>{
    request(options).catch(e => {
      message(e?.message)
    })
  },[options, request])

  return {request, data}
}
