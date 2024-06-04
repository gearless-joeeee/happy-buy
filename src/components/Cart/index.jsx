import './style.scss'
import Docker from '../Docker'
import { useEffect, useState } from 'react'
import useRequest from '../../hooks/useRequest'
import message from '../../utils/message'

function Cart() {

  // 购物车动态数据渲染
  const [lists, setLists] = useState([])

  const {request} = useRequest({manual: true})
  useEffect(()=>{
    request({
      url: '/cartProducts',
      method: 'GET'
    }).then(response=>{
      if(response.success){
        console.log(response.data)
        setLists(response.data)
      }
    }).catch(e=>{
      message(e.message)
    })
  },[request])

  let totalCount = 0
  let totalPrice = 0;
  lists.forEach(list => {
    list.cartList.forEach(item => {
      totalCount++
      totalPrice += item.price
    })
  })

  return (
    <div className="page page-cart">
      <p className="title">购物车</p>
      {
        lists.map(list => {
          return (
            <ul className="shop" key={list.shopId}>
            <h3 className="shop-title">
              <div className="radio"></div>
              <span className="iconfont shop-title-icon">&#xe7ce;</span>
              {list?.shopName}
            </h3>
            {
              (list.cartList || []).map(item => {
                return (
                  <li className="shop-product" key={item?.productId}>
                    <div className="radio"></div>
                    <img src={item?.imgUrl} alt={item?.title} className="shop-product-img" />
                    <div className="shop-product-content">
                      <h3 className="shop-product-content-title">{item?.title}</h3>
                      <p className="shop-product-content-weight">{item?.weight}</p>
                      <span className="shop-product-content-price">
                        <span className="shop-product-content-price-yen">&yen;</span>
                        {item?.price}
                      </span>
                      <span className="shop-product-content-count">{item.count}</span>
                    </div>
                  </li>
                )
              })
            }
          </ul>
          )
        })
      }
      <div className="total">
        <div className="select-all">
          <div className="radio"></div>
          <span className="select-all-text">全选</span>
        </div>
        <div className="total-price">
          <span className="total-price-text">合计:</span>
          <span className="total-price-amount">{totalPrice}</span>
        </div>
        <button className="checl">结算({totalCount})</button>
      </div>
      <Docker activeName={'cart'}/>
    </div>
  )
}

export default Cart
