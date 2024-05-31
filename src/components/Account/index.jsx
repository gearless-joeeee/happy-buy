import { Link, Outlet, useLocation } from 'react-router-dom'
import './style.scss'
export default function Login() {
  const location = useLocation()
  const loginTabActived = location.pathname === '/account/login'
  const loginActivedClass = loginTabActived ? 'tab-item-active' : ''
  const registerActivedClass = !loginTabActived ? 'tab-item-active' : ''
  return (
    <div className="page account-page">
      <ul className="tab">
        <li className={`tab-item tab-item-left ${loginActivedClass}`}>
        <Link to='/account/login'>登录</Link>  
        </li>
        <li className={`tab-item tab-item-right ${registerActivedClass}`}>
          <Link to='/account/register'>注册</Link>  
        </li>
      </ul>
      <Outlet/>
    </div>
  )
}
