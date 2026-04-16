import WrapperContainer from "../../_components/WrapperContainer";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export default function Testimonials() {
    return (
        <div className="bg-white w-full">
            <WrapperContainer>
                <div className="space-y-12 w-full grid grid-cols-1">
                    <div className="space-y-3 text-center">
                        <h3 className="text-primaryColor text-sm sm:text-base md:text-sm xl:text-xl font-semibold leading-[130%] tracking-[0.1px]">Testimonials</h3>
                        <h2 className="text-blackColor text-3xl sm:text-5xl font-semibold leading-[130%]">Hear from <span className="text-primaryColor">Our Community</span></h2>
                    </div>
                    <div className="w-full grid grid-cols-1">
                        <Carousel>
                            <CarouselContent>
                                <CarouselItem>...</CarouselItem>
                                <CarouselItem>...</CarouselItem>
                                <CarouselItem>...</CarouselItem>
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                </div>
            </WrapperContainer>
        </div>
    )
}