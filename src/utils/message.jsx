
import ReactDOM from 'react-dom/client';

const modalStyle = {
  position:"fixed",
  right: "0",
  top: "0",
  width: "max-content",
  whiteSpace: "nowrap",
  background: "#68CD86",
  borderLeft: "5px solid #187FE7",
  borderLeftColor: "#42A85F",
  padding: "10px"
}

const modalMessageStyle = {
  color: "white",
  textAlign: "left",
  fontSize: ".16rem"
}

const element = document.createElement('div')
const root = ReactDOM.createRoot(element)

function message( message, timeout = 1500) {
  root.render(
    <div style={modalStyle}>
      <p style={modalMessageStyle}>{message}</p>
    </div>
  )
  if(!element.parentNode){
    document.body.appendChild(element)
    setTimeout(()=>{
      document.body.removeChild(element)
    }, timeout)
  }
  
}

export default message
