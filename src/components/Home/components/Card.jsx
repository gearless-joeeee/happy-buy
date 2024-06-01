
const Card = ({title, list}) => {

  return (
    <div className="card">
      <h3 className="card-title">
        <img src={require("../../../images/hot.png")} alt="" className="card-title-img" />
      {title}
      <span className="card-title-more">更多<span className="iconfont">&#xe631;</span></span>
      </h3>
      <div className="card-content">
        {
          (list || []).map(item => {
            return (
              <div className="card-content-item" key={item.id}>
                <img src={item.imgUrl} alt="{item.name}" className="card-content-item-img" />
              <div className="card-content-item-desc">{item.name}</div>
              <div className="card-content-item-price">
                <span className="card-content-item-yen">&yen;</span>
                {item.price}
                <span className="iconfont">&#xe653;</span>
              </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )

} 

export default Card