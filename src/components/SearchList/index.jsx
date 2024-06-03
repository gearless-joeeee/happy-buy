import { useState } from "react"
import { Link, useNavigate, useParams} from 'react-router-dom'
import "./style.scss"
import useRequest from "../../hooks/useRequest"





const SearhList = () => {

  const params = useParams()
  const [keyword, setKeyword] = useState(params.keyword)
  const [tabValue, setTabValue] = useState('default')
  const [requestData, setRequestData] = useState({
    url:'/searchlist',
    method:"GET",
    params: {
      keyword,
      shopId:params.shopId,
      type:tabValue
    }
  })


  const { data } = useRequest(requestData)
  const searchList = data?.data || []

  function handleKeyDown(key) {
    if(key === 'Enter' && keyword) {
      // 更新本地存储内容
      const localSearchList = localStorage.getItem('search-history');
      const seachListHistory = localSearchList ? JSON.parse(localSearchList): [];
      const keywordIndex = seachListHistory.findIndex(item => item === keyword);
      const newHistoryList = [...seachListHistory];
      if(keywordIndex > -1) {
        newHistoryList.splice(keywordIndex, 1)
      }
      newHistoryList.unshift(keyword);
      if(newHistoryList.length > 20) {
        newHistoryList.length = 20;
      }
      localStorage.setItem('search-history', JSON.stringify(newHistoryList));

      //更新请求参数
      const newRequestData = { ...requestData };
      newRequestData.params.keyword = keyword;
      setRequestData(newRequestData);
      setKeyword('')
    }
  }

  function handleTabClick (tabValue) {
    setTabValue(tabValue)
    const newRequestData = {...requestData}
    newRequestData.params.type = tabValue
    setRequestData(newRequestData)
  }

  return (
    <div className="page page-search-list">
      <div className="search">
      <span className="iconfont icon-back"><Link to='/home'>&#xe601;</Link></span>
        <span className="search-area">
          <span className="iconfont icon-search" >&#xe698;</span>
          <input 
            type="text" 
            className="search-input"
            placeholder="请输入商品名称"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={(e) => { handleKeyDown(e.key)}}
          />
          <span className="iconfont search-clear">&#xe6a6;</span>
        </span>
      </div>
      <ul className="tab">
        <li 
          className={tabValue === 'default'  ? 'tab-item tab-item-active' : 'tab-item'}
          onClick={()=>handleTabClick('default')}
        >默认</li>
        <li 
          className={tabValue === 'sales'  ? 'tab-item tab-item-active' : 'tab-item'}
          onClick={()=>handleTabClick('sales')}
        >销量</li>
        <li 
          className={tabValue === 'price'  ? 'tab-item tab-item-active' : 'tab-item'}
          onClick={()=>handleTabClick('price')}
        >价格</li>
    
      
      </ul>
      <ul className="list">
        {
          searchList.map(item => {
            return (
              <Link to={`/detail/${item.id}`}>
              <li className="item" key={item.id}>
                <img src={item.imgUrl} alt={item.title} className="item-img" />
                <div className="item-content">
                  <p className="item-content-title">{item.title}</p>
                  <p className="item-content-meta">
                    <span className="item-content-meta-price">
                      <span className="item-content-meta-yen">&yen;</span>
                      {item.price}
                    </span>
                    <span className="item-content-meta-sales">已售{item.sales}</span>
                  </p>
                </div>
              </li>
              </Link>
            )
          })
        }
      </ul>

    
    </div>
  )
}

export default SearhList