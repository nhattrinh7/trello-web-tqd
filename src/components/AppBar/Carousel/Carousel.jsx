// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'

import Box from '@mui/material/Box'

function Carousel() {
  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={1}
      // onSlideChange={() => console.log('slide change')}
      // onSwiper={(swiper) => console.log(swiper)}
      loop={true}
    >
      <SwiperSlide>
        <Box
          component="img"
          src={'/Carousel_Image_Boards_2x.webp'}
          sx={{
            width: '70%',
            height: 'auto',
            borderRadius: 2,
            boxShadow: 3
          }}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Box
          component="img"
          src={'/Carousel_Image_Lists_2x.webp'}
          sx={{
            width: '70%',
            height: 'auto',
            borderRadius: 2,
            boxShadow: 3
          }}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Box
          component="img"
          src={'/Carousel_Image_Cards_2x.webp'}
          sx={{
            width: '70%',
            height: 'auto',
            borderRadius: 2,
            boxShadow: 3
          }}
        />
      </SwiperSlide>
      ...
    </Swiper>
  )
}

export default Carousel