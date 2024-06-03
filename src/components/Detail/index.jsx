import './style.scss'
import { useParams } from 'react-router-dom'
import { useRef } from 'react'
import useRequest from '../../hooks/useRequest'

const Detail =  () => {
  const params = useParams()

  const requestData = useRef({
    url:'/detail',
    method: 'GET',
    params: {id: params.id}
  })
  
  const {data} = useRequest(requestData.current)
  const result = data?.data || null

  return (
    <div className="page page-detail">
      <div className="title">
        <span className="iconfont back-btn">&#xe601;</span>
        商品详情
      </div>
      <img src={result?.imgUrl} alt={result?.title} className="product" />
      <div className="main">
        <div className="main-meta">
          <span className="main-meta-price">
            <span className="main-meta-price-yen">&yen;</span>
            {result?.price}
          </span>
         已售{result?.sales}
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
          <p className="iconfont cart-icon">&#xe826;</p>
          <p className="cart-text">购物车</p>
        </div>
        <button className="add-to-cart">加入购物车</button>
      </div>
    </div>
  )
}


export default Detail