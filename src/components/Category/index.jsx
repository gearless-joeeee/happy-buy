import './style.scss'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useRequest from '../../hooks/useRequest'
import message from '../../utils/message'
import Docker from '../Docker'



function Category() {

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])

  const { request: tagAndCategoryRequest} = useRequest({manual: true})

  const { request: prodcutRequest} = useRequest({manual: true})

  useEffect(()=>{
    prodcutRequest({
      url: '/categoryproduct',
      method: 'GET',
    }).then(data=>{
      if(data?.success){
        const result = data.data
        setProducts(result)
      }
    }).catch((e) => {
      message(e?.message)
    })
  },[prodcutRequest])

  useEffect(()=>{
    tagAndCategoryRequest({
      url: '/categorytagList',
      method: 'GET',
    }).then(data=>{
      if(data?.success){
        const result = data.data
        setCategories(result.category);
        setTags(result.tag)
      }
    }).catch((e)=>{
      message(e)
    })
  },[tagAndCategoryRequest])

  const navigate = useNavigate()
  return (
    <div className='page page-category'>
        <h2 className="title">
        <span 
          className="iconfont back-btn"
          onClick={()=> navigate(-1)}
        >&#xe601;</span>
        分类
      </h2>
      <div className="search-area">
        <span className="iconfont search-icon">&#xe698;</span>
        <input type="text" className="search-input" placeholder='请输入商品'/>
      </div>
      <ul className="category">
        {
          categories.map(category => {
            return (
              <li className="category-item" key={category?.id}>{category?.name}</li>
            )
          })
        }
      </ul>
      <ul className="tag">
        {
          tags.map(tag=>{
            return (
              <li className="tag-item" key={tag}>{tag}</li>
            )
          })
        }
      </ul>
      <ul className="product">
        <h4 className="product-title">精品商品(6)</h4>
        {
          products.map(product => {
            return (
              <li className="product-item" key={product?.id}>
                <img src={product?.imgUrl} alt={product?.title} 
                className="product-item-img" />
                <div className="prodcut-item-content">
                  <p className="product-item-content-title">{product?.title}</p>
                  <p className="product-item-content-sales">已售{product?.sales}</p>
                  <span className="product-item-content-price">
                    <span className="product-item-content-price-yen">&yen;</span>
                    {product?.price}
                  </span>
                  <button className="product-item-content-buy">购买</button>
                </div>
              </li>
            )
          })
        }
      </ul>
      <Docker activeName={'category'}></Docker>
    </div>
  )
}

export default Category
