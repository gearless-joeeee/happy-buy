import { useEffect, useState } from 'react'
import useRequest from '../../hooks/useRequest'
import './style.scss'
import { useParams } from 'react-router-dom'
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
      url: '/orderDetail',
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
      url: '/userAddress',
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
        <button className="order-submit-btn">提交订单</button>
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
    </div>
  ) : null
}

export default Order
