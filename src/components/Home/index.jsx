import './style.scss'
import Banner from './components/Banner'
import Card from './components/Card'
import Category from './components/Category'
import { useEffect, useState } from 'react'
import useRequest from '../../hooks/useRequest'
import Docker from '../Docker'

const defaultRequestConfig = {
  url: '/home',
  methods: 'GET',
  data: {
    latitude: 37.7304167,
    longitude: -122.384425
  }
}



function Home() {
  const localLocation = localStorage.getItem('location')
  const locationHistory = localLocation ? JSON.parse(localLocation) : null
  if(locationHistory){
    defaultRequestConfig.data.latitude = locationHistory.latitude
    defaultRequestConfig.data.longitude = locationHistory.longitude
  }
  const [ requestConfig, setRequestConfig] = useState(defaultRequestConfig)

  const { data } = useRequest(requestConfig)
  useEffect(()=>{
    if( !locationHistory && !navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position) => {
          const { coords : { latitude, longitude} } =  position
          localStorage.setItem('location', JSON.stringify({
            latitude, longitude
          }))
          setRequestConfig({
            ...defaultRequestConfig,
            data: {latitude, longitude}
          })
        }, error => {
          console.log(error)
        }, {timeout: 500}
      )
    }
  },[locationHistory])

  let location, banners, categories, freshes = undefined
  const dataResult =  data?.data
  if(dataResult){
    location = dataResult.location
    banners = dataResult.banners
    freshes = dataResult.freshes
    categories = dataResult.categories
  }
  return (
    <div className='page page-home'>
      <Banner location={location} banners={banners}/>
      <Category categories={categories} />
      <Card title="新品尝鲜" list={freshes} />
      <div className='bottom'>
        - 我是有底线的 -
      </div>
      <Docker activeName="home"/>
    </div>
  )
}

export default Home
