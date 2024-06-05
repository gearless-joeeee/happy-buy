import { useState } from "react"
import useRequest from "../../hooks/useRequest"
import { useNavigate } from "react-router-dom"
import message from "../../utils/message"

export default function Login() {

  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const request = useRequest()
  const handleSubmit = () => {
    if(!password || !phone) {
      message("请填写手机号或密码")
      return
    }

    request({
      url: '/login.json',
      method: 'GET',
      params: {
        phone,
        password
      }
    })
    .then(data => {
      console.log(data)
        const {data: {token }} = data
        localStorage.setItem('token', token)
        navigate('/home')
    }).catch(e => {
        message(e?.message || "unkonw error")
    })
  }
  return (
    <>
      <form className='form'>
          <div className="form-control">
            <label className="form-title">手机号</label>
            <input  
              type="text" 
              className="form-input" 
              placeholder='请输入手机号'
              value={phone}
              onChange={e=> setPhone(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="form-title">密码</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder='请输入密码'
              value={password}
              onChange={e=> setPassword(e.target.value)}
            />
          </div>
      </form>
      <button className="submit" onClick={handleSubmit}>登录</button>
      <p className="accept">*登录即表示你赞同使用条款及隐私政策</p>
    </>
  )
}
