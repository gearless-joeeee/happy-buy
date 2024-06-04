import './style.scss'

function Popover({children, show, maskClickCallback}) {
  return show ? (
    <>
    <div className="popover-mask" onClick={maskClickCallback}></div>
    <div className="popover-content">{children}</div>
    </>
  ): null
}

export default Popover
