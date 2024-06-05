import { useEffect, useState } from 'react'
import useRequest from '../../hooks/useRequest'
import './style.scss'
import { useNavigate, useParams } from 'react-router-dom'
import message from '../../utils/message'
import Popover from '../Popover'
import { Picker } from 'antd-mobile'

function Order() {
  // 请求订单页数据
  const [data, setData] = useState(null)
  const { request } = useRequest({ manual: true })
  const params = useParams()
  useEffect(() => {
    request({
      url: '/orderDetail.json',
      method: 'GET',
      params: {
        id: params.orderId,
      },
    })
      .then((response) => {
        if (response.success) {
          setData(response.data)
        }
      })
      .catch((e) => message(e.message))
  }, [request, params])

  // 地址列表弹窗
  const [showAddressList, setShowAddressList] = useState(false)
  const [addressList, setAddressList] = useState([])
  const { request: addressListRequest } = useRequest({ manual: true })
  function handleReceiverClick() {
    addressListRequest({
      url: '/userAddress.json',
      method: 'GET',
    })
      .then((response) => {
        if (response.success) {
          setAddressList(response.data)
          setShowAddressList(true)
        }
      })
      .catch((e) => message(e.message))
  }
  function handleAddressClick(address) {
    const newData = { ...data }
    newData.address = {
      id: address.id,
      name: address.name,
      phone: address.phone,
      address: address.address,
    }
    setShowAddressList(false)
    setData(newData)
  }

  // 送达日期
  const [showTimeRange, setShowTimeRange] = useState(false)

  // 支付方式弹窗
  const [showPayment, setShowPayment] = useState(false)
  const [payway, setPayWay] = useState('weixin')
  const {request: paymentRequest} = useRequest({manual: true})

  // 页面跳转
  const navigate = useNavigate()
  function handleSubmitClick(){
    paymentRequest({
      url: '/pay.json',
      method: 'GET',
      params: {
        id: params.orderId,
        payway,
        time: data.time,
        addressId: data.address.id
      }
    }).then(response=>{
      if(response.success){
        navigate('/home')
      }
    }).catch(e=> message(e.message))
  }

  return data ? (
    <div className="page page-order">
      <h3 className="title">确认订单</h3>
      <div className="receiver" onClick={handleReceiverClick}>
        <span className="iconfont receiver-icon">&#xe650;</span>
        <div className="receiver-content">
          <span className="receiver-content-name">
            收货人:{data.address.name}
          </span>
          <span className="receiver-content-phone">{data.address.phone}</span>
          <p className="receiver-content-address">
            收货人地址: {data.address.address}
          </p>
        </div>
      </div>
      <div className="delivery">
        <span className="delivery-text">送达时间</span>
        <span 
          className="delivery-select"
          onClick={()=>setShowTimeRange(true)}
        >
          {data.time?.[0]} {data.time?.[1]}:{data.time?.[2]}
        </span>
      </div>
      {data.shop.map((shop) => {
        return (
          <ul className="shop" key={shop.shopId}>
            <h3 className="shop-title">
              <span className="iconfont shop-title-icon">&#xe7ce;</span>
              {shop?.shopName}
            </h3>
            {(shop.cartList || []).map((product) => {
              return (
                <li className="shop-product" key={product?.productId}>
                  <img
                    src={product?.imgUrl}
                    alt={product?.title}
                    className="shop-product-img"
                  />
                  <div className="shop-product-content">
                    <h3 className="shop-product-content-title">
                      {product?.title}
                    </h3>
                    <p className="shop-product-content-weight">
                      {product?.weight}
                    </p>
                  </div>
                  <div className="shop-product-order">
                    <p className="shop-product-order-price">
                      <span className="shop-product-content-price-yen">
                        &yen;
                      </span>
                      {product?.price}
                    </p>
                    <p className="shop-product-order-count">x{product.count}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )
      })}

      <div className="order-submit">
        <p className="order-submit-total">
          合计:{' '}
          <span className="order-submit-total-price">
            <span className="order-submit-total-price-yen">&yen;</span>
            {data.total}
          </span>
        </p>
        <button className="order-submit-btn" onClick={()=> setShowPayment(true)}>提交订单</button>
      </div>
      <Popover
        show={showAddressList}
        maskClickCallback={() => setShowAddressList(false)}
      >
        <ul className="address-popover">
          <h3 className="address-popover-title">选择地址</h3>
          {addressList.map((address) => {
            return (
              <li
                className="address-popover-item"
                key={address.id}
                onClick={() => handleAddressClick(address)}
              >
                <span className="address-popover-item-name">
                  {address.name}
                </span>
                <span className="address-popover-item-phone">
                  {address.phone}
                </span>
                <p className="address-popover-item-address">
                  收货人地址: {address.address}
                </p>
              </li>
            )
          })}
        </ul>
      </Popover>
      <Picker
        visible={showTimeRange}
        columns={data.timeRange}
        value={data.time}
        onConfirm={(value)=> {
          const newData = {...data}
          newData.time = value
          setData(newData)
          setShowTimeRange(false)
        }}
        onSelect={(val, extend) => {
          console.log('onSelect', val, extend.items)
        }}
      />
      <Popover show={showPayment} maskClickCallback={()=>setShowPayment(false)}>
        <div className="payment-popover">
          <h3 className="payment-popover-title">选择支付方式</h3>
          <p className="payment-popover-price">&yen;{data.total}</p>
          <ul className="payment-popover-methods">
            <li className="payment-popover-method">
              <img src={require('../../images/weixin.png')} alt="wechat-pay" className="payment-popover-method-img" />
              <span className="payment-popover-method-name">微信</span>
              <div 
                className={payway === 'weixin'? 'radio radio-active' : 'radio'}
                onClick={()=> setPayWay('weixin')}
              ></div>
            </li>
            <li className="payment-popover-method">
              <img src={require('../../images/cash.png')} alt="remain-pay" className="payment-popover-method-img" />
              <span className="payment-popover-method-name">余额 ({data.money})</span>
              <div 
                className={payway === 'cash'? 'radio radio-active' : 'radio'}
                onClick={()=> setPayWay('cash')}
              ></div>
            </li>
          </ul>
          <button 
            className="payment-popover-btn"
            onClick={handleSubmitClick}
          >立即支付</button>
        </div>
      </Popover>
    </div>
  ) : null
}

export default Order
