import { useState } from "react"
import { Link, useNavigate, useParams} from 'react-router-dom'
import "./style.scss"
import useRequest from "../../hooks/useRequest"


// 仅在加载组件时加后端api请求配置
const defaultRequestData ={
  url: '/hotsearch.json',
  method: "GET",
  params: { shopId: ''}
}


const Search = () => {

  const searchHistoryList = localStorage.getItem('search-history')
  const searchHistoryListParsed = searchHistoryList ? JSON.parse(searchHistoryList) : ["猪肉"]
  const [keyword, setKeyword] = useState('')
  const [historyList, setHistoryList] = useState(searchHistoryListParsed)

  const navigate = useNavigate()

  // 页面跳转携带的入参
  const params = useParams()
  if(params.shopId) {
    defaultRequestData.params.shopId = params.shopId
  }

  const { data } = useRequest(defaultRequestData)
  const hotList = data?.data || []

  const handleKeyDown = (key) => {
    if(key === 'Enter' && keyword){
      const keywordIndex = historyList.findIndex( item => item === keyword)
      const newHistoryList = [...historyList]
      if(keywordIndex > -1 ) {
        newHistoryList.splice(keywordIndex, 1)
      }
      newHistoryList.unshift(keyword);
      if(newHistoryList.length > 20) {
        newHistoryList.splice(20, newHistoryList.length - 20)
      }
      setHistoryList(newHistoryList)
      localStorage.setItem('search-history', JSON.stringify(newHistoryList))
      navigate(`/searchList/${params.shopId}/${keyword}`)
      setKeyword('')
    } 
  }

  const handleHistoryListClean = () => {
    setHistoryList([])
    localStorage.setItem('search-history', JSON.stringify([]))
  }

  function handleKeywordClick(keyword) {
    navigate(`/searchList/${params.shopId}/${keyword}`);
  }


  return (
    <div className="page page-search">
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
            onKeyDown={e => handleKeyDown(e.key)}
          />
        </span>
      </div>

      {
        historyList.length ? (
          <>
            <div className="title">
              历史搜索
              <span className="iconfont title-close" onClick={handleHistoryListClean}>&#xe6a6;</span>
            </div>
            <ul className="list">
              {
                historyList.map((item,index) => {
                  return (

                    <li 
                    className="list-item"
                    key={item + index}
                    onClick={() => handleKeywordClick(item)}
                    >{item}</li>
                  )
                })
              }
            </ul>
          </>
        ) : null
      }
      {
        hotList.length ? (
          <>
            <div className="title">热门搜索</div>
            <ul className="list">
              {
                hotList.map((item,index) => {
                  return (
                    <li 
                    className="list-item"
                    key={item + index}
                    onClick={() => handleKeywordClick(item.keyword)}
                    >{item.keyword}</li>
                  )
                })
              }
            </ul>
          </>
        ) : null
      }
    </div>
  )
}

export default Search