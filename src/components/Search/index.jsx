import { useState } from "react"
import { Link} from 'react-router-dom'
import "./style.scss"
import useRequest from "../../hooks/useRequest"

const defaultRequestData ={
  url: '/hotsearch',
  method: "GET",
}


const Search = () => {

  const searchHistoryList = localStorage.getItem('history-list')
  const searchHistoryListParsed = searchHistoryList ? JSON.parse(searchHistoryList) : ["猪肉"]
  const [keyword, setKeyword] = useState('')
  const [historyList, setHistoryList] = useState(searchHistoryListParsed)

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
      localStorage.setItem('history-list', JSON.stringify(newHistoryList))
    } 
  }

  const handleHistoryListClean = () => {
    setHistoryList([])
    localStorage.setItem('history-list', JSON.stringify([]))
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