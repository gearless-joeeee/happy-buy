import { useRef, useState } from "react"
import useRequest from "../../hooks/useRequest"
import { useNavigate } from "react-router-dom"
import { Modal } from "../../utils/Modal"
export default function Register() {
  const modalRef = useRef(null)
  const [userName, setUserName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate()

  const request = useRequest()
  const handleSubmit = () => {
    if(!password || !phone || !confirmPassword) {
      modalRef.current.showMessage("请填写手机号或密码")
      return
    }

    if( !(password === confirmPassword) ){
      modalRef.current.showMessage("手机密码不一致")
      return
    }

    request({
      url: '/reigster',
      method: 'POST',
      data: {
        userName,
        phone,
        password
      }
    })
    .then(data => {
      console.log(data)
        const { message } = data
        // localStorage.setItem('token', token)
        modalRef.current.showMessage(message)
        navigate('/account/login')
    }).catch(e => {
      modalRef.current.showMessage(e?.message || "unkonw error")
    })
  }
  return (
    <>
      <form className='form'>
          <div className="form-control">
            <label className="form-title">用户名</label>
            <input  
              type="text" 
              className="form-input" 
              placeholder='请输入用户名'
              value={userName}
              onChange={e=> setUserName(e.target.value)}
            />
          </div>
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
          <div className="form-control">
            <label className="form-title">确认密码</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder='请再次输入密码'
              value={confirmPassword}
              onChange={e=> setConfirmPassword(e.target.value)}
            />
          </div>
      </form>
      <button className="submit" onClick={handleSubmit}>注册</button>
      <p className="accept">*登录即表示你赞同使用条款及隐私政策</p>
      <Modal ref={modalRef}/>
    </>
  )
}