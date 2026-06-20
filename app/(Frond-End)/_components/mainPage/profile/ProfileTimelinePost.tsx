"use client";
import { useGetProfileTimelineQuery } from "@/feature/slice/post/postSlice";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CreatePostSection from "../post/CreatePostSection";
import PostCardSkleton from "../post/PostCardSkleton";
import ProfilePostCard from "./ProfilePostCard";
function ProfileTimelinePost({ userId }: { userId: string | number }) {
  const params = useParams();
  const { id } = params;
  const [currentIndex, setCurrentIndex] = useState(1);
  const { data, isLoading } = useGetProfileTimelineQuery({
    userId: id ? id : userId,
    query: `page=1&per_page=10`,
  });

  const posts = data?.data || [];
  const swiperRef = useRef<any>(null);

  const goNext = () => swiperRef.current?.slideNext();
  const goPrev = () => swiperRef.current?.slidePrev();

  return (
    <div className="w-full relative grid  h-full">
      {posts.length > 2 && (
        <button onClick={goPrev}>
          <div className=" z-10 flex top-[50%] left-2 absolute -translate-y-1/2 items-center group justify-center cursor-pointer w-10 h-10 rounded-full bg-white/20 border border-primaryColor hover:bg-primaryColor shadow shadow-stone-300 transition-all backdrop-blur-[5px]">
            <FaLongArrowAltLeft className="text-primaryColor group-hover:text-whiteColor" />
          </div>
        </button>
      )}

      {isLoading ? (
        <div className="text-center flex  py-10">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className=" rounded-md mb-4">
              <PostCardSkleton />
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          speed={1000}
          autoplay={{
            delay: 300000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
          }}
          modules={[Navigation, Autoplay, Pagination]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex + 1)}
          className="w-full"
          pagination={{
            clickable: true,
            bulletClass: "hero-bullet",
            bulletActiveClass: "hero-bullet-active",
          }}
        >
          {posts.map((post) => (
            <SwiperSlide className="" key={post.id}>
              <ProfilePostCard post={post} meta={data?.meta} userId={userId} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : !data?.meta?.is_own_profile ? (
        <p className="text-center text-grayColor1">No posts available</p>
      ) : (
        <div className=" py-6">
          <h4 className="text-lg font-semibold text-headerColor mb-4">
            Publish your first post
          </h4>
          <CreatePostSection />
        </div>
      )}
      {posts.length > 2 && (
        <button onClick={goNext}>
          <div className=" z-10 flex items-center group justify-center cursor-pointer w-10 h-10 rounded-full absolute top-[50%] right-2  -translate-y-1/2 bg-white/20 border border-primaryColor hover:bg-primaryColor shadow shadow-stone-300 transition-all backdrop-blur-[5px]">
            <FaLongArrowAltRight className="text-primaryColor group-hover:text-whiteColor" />
          </div>
        </button>
      )}
    </div>
  );
}

export default ProfileTimelinePost;
