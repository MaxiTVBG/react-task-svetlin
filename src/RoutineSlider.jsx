import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import RecommendationCard from './RecommendationCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RoutineSlider = ({ products, wishlist, toggleWishlist }) => {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-[36px]">
        <div className="lg:col-span-1 px-2 md:px-4 lg:pr-0 h-full">
          <div className="bg-[#EEF7FB] rounded-lg shadow-md p-4 flex flex-col justify-center text-center h-[420px] w-full xl:w-[350px]">
            <h3 className="text-2xl font-semibold font-bricolage mb-2 text-gray-800">
              Daily routine
            </h3>
            <p className="font-montserrat text-gray-900">
              Perfect for if you're looking for soft, nourished skin, our moisturizing body washes are made with skin-natural nutrients that work with your skin to replenish moisture. With a light formula, the bubbly lather leaves your skin feeling cleansed and cared for. And by choosing relaxing fragrances you can add a moment of calm to the end of your day.
            </p>
          </div>
        </div>
        <div className="lg:col-span-2 relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={2}
            loop={true}
            navigation={{
              nextEl: '.swiper-button-next-custom',
            }}
            pagination={{ clickable: true, el: '.swiper-pagination-container' }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 1,
                spaceBetween: 0,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 36,
              },
            }}
            className="!pb-12"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <RecommendationCard
                  product={product}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={toggleWishlist}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-button-next-custom"></div>
        </div>
      </div>
      <div className="swiper-pagination-container text-center"></div>
    </div>
  );
};

export default RoutineSlider;