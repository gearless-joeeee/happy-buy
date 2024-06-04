import './style.scss'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useRequest from '../../hooks/useRequest'
import message from '../../utils/message'
import Docker from '../Docker'
import Popover from '../Popover'

function Category() {
  // 页面跳转
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])

  // 驱动请求重新发送的数据
  const [currentTag, setCurrentTag] = useState('')
  const [currentCategory, setCurrentCategory] = useState('')
  const [keyword, setKeyword] = useState('')

  const { request: tagAndCategoryRequest } = useRequest({ manual: true })
  const { request: prodcutRequest } = useRequest({ manual: true })

  function handleKeyDown(key, target) {
    if (key === 'Enter') {
      setKeyword(target.value)
    }
  }

  useEffect(() => {
    prodcutRequest({
      url: '/categoryproduct',
      method: 'POST',
      data: {
        keyword,
        category: currentCategory,
        tag: currentTag,
      },
    })
      .then((data) => {
        if (data?.success) {
          const result = data.data
          setProducts(result)
        }
      })
      .catch((e) => {
        message(e?.message)
      })
  }, [prodcutRequest, currentTag, currentCategory, keyword]) // 数据改变,请求重新发送

  useEffect(() => {
    tagAndCategoryRequest({
      url: '/categorytagList',
      method: 'GET',
    })
      .then((data) => {
        if (data?.success) {
          const result = data.data
          setCategories(result.category)
          setTags(result.tag)
        }
      })
      .catch((e) => {
        message(e)
      })
  }, [tagAndCategoryRequest])

  // 购物车相关逻辑
  const [showCart, setShowCart] = useState(false)
  const [cartProductInfo, setCartProductInfo] = useState({
    id: '',
    title: '',
    imgUrl: '',
    price: '',
    count: 0,
  })
  const { request: cartRequset } = useRequest({ manual: true })
  function handleProductClick(e, productId) {
    e.stopPropagation()
    cartRequset({
      url: '/cartProductInfo',
      method: 'GET',
      params: { productId },
    })
      .then((response) => {
        if (response?.success) {
          setCartProductInfo(response.data)
          setShowCart(true)
        }
      })
      .catch((e) => {
        message(e.message)
      })
  }

  function handleCartNumChange(type) {
    const newCartProductInfo = { ...cartProductInfo }
    const { count } = newCartProductInfo
    if (type === 'minus') {
      newCartProductInfo.count = count - 1 < 0 ? 0 : count - 1
    } else {
      newCartProductInfo.count = count + 1
    }
    setCartProductInfo(newCartProductInfo)
  }

  // 更新购物车内容
  const { request: cartChangeRequest } = useRequest({ manual: true })
  function changeCartInfo() {
    console.log('get executed')
    cartChangeRequest({
      url: '/cartchange',
      method: 'GET',
      params: {
        id: cartProductInfo.id,
        count: cartProductInfo.count,
      },
    })
      .then(() => {
        setShowCart(false)
      })
      .catch((e) => {
        message(e.message)
      })
  }

  function closeMask() {
    setShowCart(false)
  }

  return (
    <div className="page page-category">
      <h2 className="title">
        <span className="iconfont back-btn" onClick={() => navigate(-1)}>
          &#xe601;
        </span>
        分类
      </h2>
      <div className="search-area">
        <span className="iconfont search-icon">&#xe698;</span>
        <input
          type="text"
          className="search-input"
          placeholder="请输入商品"
          onKeyDown={(e) => handleKeyDown(e.key, e.currentTarget)}
        />
      </div>
      <ul className="category">
        <li
          className={
            currentTag === ''
              ? 'category-item-active category-item'
              : 'category-item'
          }
        >
          全部
        </li>
        {categories.map((category) => {
          return (
            <li
              key={category?.id}
              onClick={() => setCurrentCategory(category.id)}
              className={
                currentCategory === category.id
                  ? 'category-item-active category-item'
                  : 'category-item'
              }
            >
              {category?.name}
            </li>
          )
        })}
      </ul>
      <ul className="tag">
        <li
          className={
            currentTag === '' ? 'tag-item-active tag-item' : 'tag-item'
          }
        >
          全部
        </li>
        {tags.map((tag) => {
          return (
            <li
              className={
                currentTag === tag ? 'tag-item-active tag-item' : 'tag-item'
              }
              key={tag}
              onClick={() => setCurrentTag(tag)}
            >
              {tag}
            </li>
          )
        })}
      </ul>
      <ul className="product">
        <h4 className="product-title">精品商品({products.length})</h4>
        {products.map((product) => {
          return (
            <li
              className="product-item"
              key={product?.id}
              onClick={() => navigate(`/detail/${product.id}`)}
            >
              <img
                src={product?.imgUrl}
                alt={product?.title}
                className="product-item-img"
              />
              <div className="prodcut-item-content">
                <p className="product-item-content-title">{product?.title}</p>
                <p className="product-item-content-sales">
                  已售{product?.sales}
                </p>
                <span className="product-item-content-price">
                  <span className="product-item-content-price-yen">&yen;</span>
                  {product?.price}
                </span>
                <button
                  className="product-item-content-buy"
                  onClick={(e) => handleProductClick(e, product.id)}
                >
                  购买
                </button>
              </div>
            </li>
          )
        })}
      </ul>
      <Docker activeName={'category'}></Docker>
      <Popover show={showCart} maskClickCallback={closeMask}>
        <div className="cart">
          <div className="cart-content">
            <img
              src={cartProductInfo.imgUrl}
              alt={cartProductInfo.title}
              className="cart-content-img"
            />
            <div className="cart-content-info">
              <p className="cart-content-info-title">{cartProductInfo.title}</p>
              <span className="cart-content-info-price">
                <span className="cart-content-info-price-yen">&yen;</span>
                {cartProductInfo.price}
              </span>
            </div>
          </div>
          <div className="cart-count">
            购买数量
            <div className="cart-count-counter">
              <button
                className="cart-count-counter-btn"
                onClick={() => handleCartNumChange('minus')}
              >
                -
              </button>
              <span className="cart-count-counter-text">
                {cartProductInfo.count}
              </span>
              <button
                className="cart-count-counter-btn"
                onClick={() => handleCartNumChange('plus')}
              >
                +
              </button>
            </div>
          </div>
          <div className="cart-buttons">
            <button className="cart-btn" onClick={changeCartInfo}>
              加入购物车
            </button>
            <button className="cart-btn" >
              立即购买
            </button>
          </div>
        </div>
      </Popover>
    </div>
  )
}

export default Category
