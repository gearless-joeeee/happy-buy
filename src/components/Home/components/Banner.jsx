import { useState } from 'react'
import { register } from 'swiper/element/bundle'

register()
function Banner({ location, banners }) {
  const [page, setPage] = useState(1)

  return (
    <div className="banner">
      <h3 className="location">
        <span className="iconfont">&#xe650;</span>
        {location?.address || ''}
      </h3>
      <div className="search">
        <span className="iconfont">&#xe698;</span>
        <span>请输入你需要搜索的内容</span>
      </div>
      <div className="swiper-area">
        <swiper-container
          speed={500}
          loop={true}
          css-mode={true}
          slides-per-view={1}
          onSlideChange={(e) => setPage(e.activeIndex + 1)}
        >
          {(banners || []).map((item) => {
            return (
              <swiper-slide key={item.id}>
                <div className="swiper-item">
                  <img
                    className="swiper-item-img"
                    src={item.imgUrl}
                    alt="轮播图"
                  />
                </div>
              </swiper-slide>
            )
          })}
        </swiper-container>
        <p className="pagination">{page}/{banners?.length || 0} </p>
      </div>
    </div>
  )
}

export default Banner
