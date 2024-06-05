import './style.scss'
import Docker from '../Docker'
import { useEffect, useState } from 'react'
import useRequest from '../../hooks/useRequest'
import message from '../../utils/message'
import { useNavigate } from 'react-router-dom'


function Cart() {
  // 购物车动态数据渲染
  const [lists, setLists] = useState([])

  const { request } = useRequest({ manual: true })
  useEffect(() => {
    request({
      url: '/cartProducts.json',
      method: 'GET',
    })
      .then((response) => {
        if (response.success) {
          const newList = response.data
          newList.forEach((shop) => {
            shop.selected = false
            shop.cartList.forEach((product) => {
              product.selected = false
            })
          })
          setLists(newList)
        }
      })
      .catch((e) => {
        message(e.message)
      })
  }, [request])

  // 商品和商店选中状态切换逻辑
  function handleShopClick(shopId) {
    const newList = [...lists]
    const shop = newList.find((shop) => shop.shopId === shopId)
    if (shop.selected) {
      shop.selected = false
      shop.cartList.forEach((product) => {
        product.selected = false
      })
    }else {
      shop.selected = true
      shop.cartList.forEach(product=>{
        if(product.selected) return
        product.selected = true
      })
    }
    setLists(newList)
  }

  function handleProductClick(productId, shopId){
    const newList = [...lists]
    const shop = newList.find(shop => shop.shopId === shopId)
    let shopSelected = true 
    shop.cartList.forEach(product => {
      if(product.productId === productId ){
        product.selected = !product.selected
      }
      if(!product.selected){
        shopSelected = false
      }
    })
    shop.selected = shopSelected
    setLists(newList)
  }
  let hasUnSelectedShop  = lists.find(shop => shop.selected === false ) ?  true : false
  // 
  let totalCount = 0
  let totalPrice = 0
  lists.forEach((shop) => {
    shop.cartList.forEach((product) => {
      if(product.selected){
        totalCount++
        totalPrice += (product.price * product.count)
      }
    })
  })

  // 结账逻辑
  const {request: submitRequest} =  useRequest({manual:true})
  const navigate = useNavigate()
  function handleCartSubmit(){
    const params = []
    lists.forEach(shop=>{
      shop.cartList.forEach(product=>{
        if(product.selected){
          params.push({
            productId:product.productId,
            count: product.count
          })
        }
      })
    })
    if(params.length ===0){
      message('你没有勾选任何购物车中的商品,无法创建订单')
      return
    }
    submitRequest({
      url:'/cartSubmit.json',
      method:'GET',
      data: params
    }).then(response => {
      if(response.success){
        const {orderId} = response.data
        navigate(`/order/${orderId}`)
      }
    })
  }


  return (
    <div className="page page-cart">
      <p className="title">购物车</p>
      {lists.map((list) => {
        return (
          <ul className="shop" key={list.shopId}>
            <h3 className="shop-title">
              <div
                className={list.selected ? 'radio radio-active' : 'radio'}
                onClick={() => handleShopClick(list.shopId)}
              ></div>
              <span className="iconfont shop-title-icon">&#xe7ce;</span>
              {list?.shopName}
            </h3>
            {(list.cartList || []).map((item) => {
              return (
                <li className="shop-product" key={item?.productId}>
                  <div
                    className={item.selected ? 'radio radio-active' : 'radio'}
                    onClick={()=>handleProductClick(item.productId, list.shopId)}
                  ></div>
                  <img
                    src={item?.imgUrl}
                    alt={item?.title}
                    className="shop-product-img"
                  />
                  <div className="shop-product-content">
                    <h3 className="shop-product-content-title">
                      {item?.title}
                    </h3>
                    <p className="shop-product-content-weight">
                      {item?.weight}
                    </p>
                    <span className="shop-product-content-price">
                      <span className="shop-product-content-price-yen">
                        &yen;
                      </span>
                      {item?.price}
                    </span>
                    <span className="shop-product-content-count">
                      {item.count}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        )
      })}
      <div className="total">
        <div className="select-all">
          <div 
            className={hasUnSelectedShop ? 'radio': 'radio-active radio' }
          ></div>
          <span className="select-all-text">全选</span>
        </div>
        <div className="total-price">
          <span className="total-price-text">合计:</span>
          <span className="total-price-amount">{totalPrice}</span>
        </div>
        <button 
          className="check"
          onClick={handleCartSubmit}
        >结算({totalCount})</button>
      </div>
      <Docker activeName={'cart'} />
    </div>
  )
}

export default Cart
