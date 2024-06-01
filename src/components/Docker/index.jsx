import './style.scss'


const items = [
  {
    icon: '&#xe600;',
    text: '首页',
    url: '/home',
    name:'home',
  },
  {
    icon: '&#xe630;',
    text: '分类',
    url: '/category',
    name:'category',
  },
  {
    icon: '&#xe826;',
    text: '购物车',
    url: '/cart',
    name:'cart',
  },
  {
    icon: '&#xe8a0;',
    text: '我的',
    url: '/my',
    name:'my',
  }
]

const Docker = ({activeName}) => {
  return (
    <div className="docker">
      {
        items.map(item => {
          return (
            <div
              className={`docker-item ${activeName === item.name ? 'docker-item-active': ''}`.trim()} 
              key={item.name}>
              <p className="iconfont" dangerouslySetInnerHTML={{
              __html: item.icon}}></p>
              <p>{item.text}</p>
            </div>
          )
        })
      }
    </div>
  )
}

export default Docker