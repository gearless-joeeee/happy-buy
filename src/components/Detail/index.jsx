import './style.scss'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import useRequest from '../../hooks/useRequest'
import Popover from '../Popover'
import message from '../../utils/message'

const Detail =  () => {
  const [showCart, setShowCart] = useState(false)



  // 跳转到detail页时请求加入购物车数量
  const [tempCount, setTempCount] = useState(0)
  const [count, setCount] = useState(0)
  const params = useParams()
  const {request: cartRequset} = useRequest({manual: true})
  useEffect(()=>{
    cartRequset({
      url: '/cart',
      method: 'GET',
      params: {
        id: params.id
      }
    }).then(response => {
      if(response.success){
        const data = response.data
        setTempCount(data.count)
        setCount(data.count)
      }
    }).catch(e=>{
      message(e.message)
    })
  },[params,cartRequset])
  
  function changeTempCount(count){
    if(count < 0) return
    setTempCount(count)
  }
  
  const {request:cartChangeRequest} = useRequest({manual: true}) 
  function changeCart() {
    cartChangeRequest({
      url:'/cartchange',
      method:'GET',
      params: {
        count: tempCount
      }
    }).then(response=>{
      if(response.success){
        setShowCart(false)
        setCount(tempCount)
      }
    }).catch(e=>{
      message(e.message)
    })
  }


  // 请入detail页请求商品数据
  const requestData = useRef({
    url:'/detail',
    method: 'GET',
    params: {id: params.id}
  })
  const {data} = useRequest(requestData.current)
  const result = data?.data || null

  const navigate = useNavigate()

  function closeMask(){
    setTempCount(count)
    setShowCart(false)
  }

  return (
    <div className="page page-detail">
      <div className="title">
        <span 
          className="iconfont back-btn"
          onClick={()=> navigate(-1)}
        >&#xe601;</span>
        商品详情
      </div>
      <img src={result?.imgUrl} alt={result?.title} className="product" />
      <div className="main">
        <div className="main-meta">
          <span className="main-meta-price">
            <span className="main-meta-price-yen">&yen;</span>
            {result?.price}
          </span>
          <span className="main-meta-sales">
            已售
            <span className='nubmer'>{result?.sales}</span>
          </span>
         
        </div>
        <div className="main-content">
          <p className="main-content-title">{result?.title}</p>
          <p className="main-content-subtitle">{result?.subtitle}</p>
        </div>
      </div>
      <div className="spec">
        <p className="spec-title">规格信息</p>
        <div className="spec-content">
          <div className="spec-content-left">
            <p className="spec-content-item">产地</p>
            <p className="spec-content-item">规格</p>
          </div>
          <div className="spec-content-right">
            <p className="spec-content-item">{result?.origin}</p>
            <p className="spec-content-item">{result?.specification}</p>
          </div>
        </div>
      </div>
      <div className="detail">
        <h3 className="detail-title">商品详情</h3>
        <p className="detail-content">{result?.detail}</p>
      </div>
      <div className="docker">
        <div className="cart">
          <p className="iconfont cart-icon">&#xe826;<span className="icon-count">{count}</span></p>
          <p className="cart-text">购物车</p>
        </div>
        <button className="add-to-cart" onClick={()=> setShowCart(true)}>加入购物车</button>
      </div>
      <Popover show={showCart} maskClickCallback={closeMask}> 
      <div className="cart">

        <div className="cart-content">
          <img src={result?.imgUrl} alt={result?.title} className="cart-content-img" />
          <div className="cart-content-info">
            <p className="cart-content-info-title">{result?.title}</p>
            <span className="cart-content-info-price">
              <span className="cart-content-info-price-yen">&yen;</span>
              {result?.price}
            </span>
          </div>
        </div>
        <div className="cart-count">
          购买数量
          <div className="cart-count-counter">
          <button className="cart-count-counter-btn" onClick={()=> changeTempCount(tempCount-1)}>-</button>
          <span className="cart-count-counter-text">{tempCount}</span>
          <button className="cart-count-counter-btn" onClick={()=> changeTempCount(tempCount+1)}>+</button>
          </div>
        </div>
        <button className="cart-btn" onClick={changeCart}>加入购物车</button>
      </div>
      </Popover>
    </div>
  )
}


export default Detail