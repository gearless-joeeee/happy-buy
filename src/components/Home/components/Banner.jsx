import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from 'swiper/element/bundle'

register()
function Banner({ location, banners }) {
  const swiperElRef = useRef(null)
  const [page, setPage] = useState(1)
  useEffect(() => {

    
    if(banners){
      console.log(swiperElRef.current)

        // swiper parameters
        const swiperParams = {
          slidesPerView: 1,
          slidesPerGroup:2,
          speed: 500,
          loop:true,
          cssMode:true,
          on: {
            init() {
              // ...
            },
          },
        }
        
        console.log("before assign")
        console.dir(swiperElRef.current)
        // now we need to assign all parameters to Swiper element
        Object.assign(swiperElRef.current, swiperParams)
        
        console.log("after assign")
        console.dir(swiperElRef.current)
        
        // and now initialize it
        swiperElRef.current.initialize()


    }
    // if(banners){
    //   console.dir(swiperElRef.current)

    //   swiperElRef.current.slideSlots = banners.length
    // }

  }, [banners])

  useEffect(() => {
    swiperElRef.current.addEventListener('swiperslidechange', (e) => {
      const [swiper] = e.detail
      setPage(+swiper.activeIndex + 1)
    })

  }, [])

  const navigate = useNavigate()
  const handleSearchClick = () => {
    navigate('/search')
  }

  return (
    <div className="banner">
      <h3 className="location">
        <span className="iconfont">&#xe650;</span>
        {location?.address || ''}
      </h3>
      <div className="search" onClick={handleSearchClick}>
        <span className="iconfont">&#xe698;</span>
        <span>请输入你需要搜索的内容</span>
      </div>
      <div className="swiper-area">
        <swiper-container
          init="false"
          // slides-per-view="1" speed="500" loop="true" css-mode="true"
          ref={swiperElRef}
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
        <p className="pagination">
          {page}/{banners?.length || 0}{' '}
        </p>
      </div>
    </div>
  )
}

export default Banner
