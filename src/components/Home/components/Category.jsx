const category = ({categories}) => {

  return (
    <div className="category">
      {
        (categories || []).map( category => {
          return (
          <div className="category-item" key={category.id}>
            <img src={category.imgUrl} alt={category.name} className="category-item-img" />
            <p className="category-item-desc">{category.name}</p>
          </div>
          )
        })
      }
    </div>
  )
}
export default category