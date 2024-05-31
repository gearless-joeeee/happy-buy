import './style.scss'
import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
export default function Guidet() {
  const pageRef = useRef(null)
  useEffect(() => {
    pageRef.current.style.opacity = '1'
  }, [])

  const navigate = useNavigate()
  const handleIconClick = () => {
    const token = localStorage.getItem('token')
    if(token){
      navigate('/home')
    } else {
      navigate('/account/login')
    }
  }
 
  return (
    <div ref={pageRef} className="page guide-page">
      <img
        alt="欢乐购"
        src={require('../../images/logo.png')}
        className="main-pic"
      />
      <p className="title">欢乐购</p>
      <img
        alt="欢乐购"
        src={require('../../images/slogan.png')}
        className="sub-pic"
      />
      <div className="iconfont arrow-icon" onClick={handleIconClick}>&#xe64f;</div>
    </div>
  )
}
