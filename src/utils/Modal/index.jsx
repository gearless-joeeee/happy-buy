import { createPortal } from "react-dom"
import "./style.css"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

export const Modal = forwardRef((props, ref) => {
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')

  const divRef = useRef(document.createElement('div'))
  const divEl = divRef.current

  useEffect(()=>{
    if(showModal){
      document.body.appendChild(divEl)
    } else {
      if(divEl.parentNode){
        document.body.removeChild(divEl)
      }
    }
    return () =>{
      if(divEl.parentNode){
        document.body.removeChild(divEl)
      }
    }
  },[showModal,divEl])

  useImperativeHandle(ref, () => {
    return {
      showMessage(message) {
        setMessage(message)
        setShowModal(true)
        setTimeout(()=> {
          setShowModal(false)
        },1500)
      }
    }
  },[])

  return createPortal((
    <div className="modal">
      <p className="modal-message">{message}</p>
    </div>
  ),divEl)
})