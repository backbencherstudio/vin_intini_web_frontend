"use client"
import m1 from "@/public/images/feature-img.jpg";
import Image from "next/image";
import { useRef, useState } from "react";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function TestSlide() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const swiperRef = useRef<any>(null);

  const goNext = () => swiperRef.current?.slideNext();
  const goPrev = () => swiperRef.current?.slidePrev();

  const testimonials = [
    {
      id: 1,
      name: "Wati (Indonesian helper)",
      testimonial: "Saya pindah majikan dengan bantuan agency ini. Sekarang saya lebih senang.",
      imageUrl: m1, // Replace with the actual image URL
    },
    {
      id: 2,
      name: "John (Singaporean employer)",
      testimonial: "This agency made my hiring process so much easier. Highly recommended!",
      imageUrl: m1, // Replace with the actual image URL
    },
    {
      id: 3,
      name: "Siti (Malaysian helper)",
      testimonial: "I found a great employer thanks to the agency. Very happy with my new job!",
      imageUrl: m1, // Replace with the actual image URL
    },
    {
      id: 4,
      name: "Maria (Filipino helper)",
      testimonial: "The agency helped me find a wonderful family to work with. I'm very grateful!",
      imageUrl: m1, // Replace with the actual image URL
    },
    {
      id: 5,
      name: "David (Australian employer)",
      testimonial: "Professional service and excellent candidates. Highly satisfied with the process.",
      imageUrl: m1, // Replace with the actual image URL
    },
  ];

  return (
    <section className="container">
      <div className=" mb-20">
       
        <div className="relative grid grid-cols-12">
          <div className="col-span-1 flex justify-center w-full">
         <button onClick={goPrev} >
                 <div className=" z-10 flex items-center group justify-center cursor-pointer w-10 h-8 rounded-lg bg-white/20 border border-primaryColor hover:bg-primaryColor shadow shadow-stone-300 transition-all backdrop-blur-[5px]">
                  <FaLongArrowAltLeft className="text-primaryColor group-hover:text-whiteColor" />
                </div>
              </button>
          </div>
              <div className="col-span-10">
                <div >
            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              loop={true}
              speed={1000}
              autoplay={{
                
                delay: 300000,
                disableOnInteraction: false,
              }}
             
              modules={[Navigation, Autoplay, Pagination]}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex + 1)}
              className="w-full"
               pagination={{
          clickable: true,
          bulletClass: 'hero-bullet',
          bulletActiveClass: 'hero-bullet-active',
        }}
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="w-full md:p-6 p-4  rounded-lg space-y-4">
                    <div className="flex flex-col md:flex-row items-center md:gap-6 lg:gap-10">
                      <Image
                        src={testimonial.imageUrl}
                        alt={testimonial.name}
                        width={550}
                        height={150}
                        className="rounded-md lg:max-w-[30%] md:max-w-[18%] object-cover"
                      />
                      <div>
                        <p className="text-lg mt-4 md:mt-0 md:text-2xl text-descriptionColor lg:pr-28 leading-[160%]">
                          {testimonial.testimonial}
                        </p>
                        <div className="md:text-lg text-base flex items-center gap-3 font-medium mt-5">
                          <div className="w-5 h-0.5 bg-headerColor" />
                          {testimonial.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
                </div>
              </div>
              <div className="col-span-1 flex justify-center w-full">
              <button onClick={goNext}>
                <div className=" z-10 flex items-center group justify-center cursor-pointer w-10 h-8 rounded-lg bg-white/20 border border-primaryColor hover:bg-primaryColor shadow shadow-stone-300 transition-all backdrop-blur-[5px]">
                  <FaLongArrowAltRight className="text-primaryColor group-hover:text-whiteColor" />
                </div>
          </button>
              </div>
        </div>
      </div>
      <style jsx global>{` 
        .hero-bullet {
          width: 20px !important;
          height: 8px !important;
          transition: all 0.3s ease;
          margin: 0px 5px;
          display: inline-block;
          cursor: pointer;
        
          // padding:10px;
        }

        .hero-bullet-active {
          position: relative;
          // transform: scale(1.1);
          }
         
      `}</style>
    </section>
  );
}
 // css active color and center==========
//  .swiper-pagination-bullets{
//   display: flex !important;
//   justify-content: center !important;
// }
// .hero-bullet {
//       background-color: var(--grayColor1) !important;
//       border-radius: 4px;
//     }
//     .hero-bullet-active {
//       background-color: #45CCD2 !important;
//     }
