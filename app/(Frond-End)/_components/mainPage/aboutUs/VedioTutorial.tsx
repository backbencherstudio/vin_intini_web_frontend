"use client";

import { Play, ChevronLeft, ChevronRight, Pause, ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";

const videos = [
    {
        id: 1,
        title: "YOUR QUESTIONS answered!",
        edition: "March edition",
        duration: "27:45",
        thumbnail: "/images/aboutUs/thumble1.png",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 2,
        title: "YOUR QUESTIONS answered!",
        edition: "March edition",
        duration: "27:45",
        thumbnail: "/images/aboutUs/thumble2.png",
        videoUrl: "https://www.w3schools.com/html/movie.mp4"
    },
    {
        id: 3,
        title: "YOUR QUESTIONS answered!",
        edition: "March edition",
        duration: "27:45",
        thumbnail: "/images/aboutUs/thumble3.png",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 4,
        title: "YOUR QUESTIONS answered!",
        edition: "March edition",
        duration: "27:45",
        thumbnail: "/images/aboutUs/thumble4.png",
        videoUrl: "https://www.w3schools.com/html/movie.mp4"
    },
    {
        id: 5,
        title: "YOUR QUESTIONS answered!",
        edition: "March edition",
        duration: "27:45",
        thumbnail: "/images/aboutUs/thumble1.png",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
];

export default function VideoTutorial() {
    const [selectedVideo, setSelectedVideo] = useState(videos[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVideoSelect = (video: any) => {
        if (selectedVideo.id === video.id) {
            togglePlay();
        } else {
            setSelectedVideo(video);
            setIsPlaying(false);
            if (videoRef.current) {
                videoRef.current.load();
            }
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -280, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 280, behavior: "smooth" });
        }
    };

    return (
        <div className="w-full ">
            <div className=" mx-auto py-8 md:py-12 lg:py-25  ">
                {/* Header Section */}
                <div className="mb-12 flex flex-col justify-center items-center md:items-start">
                    <p className="text-primaryColor text-xl font-semibold  ">
                        Key Features
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#000] mt-3">
                        Video Tutorial
                    </h2>
                    <p className="text-[#404040] mt-4 text-lg font-normal max-w-2xl">
                        Learn how to make the most of Mind Unite with our step-by-step video guide
                    </p>
                </div>

                {/* Main Video Player */}
                <div className="relative rounded-3xl overflow-hidden  mb-12 aspect-video bg-[#0A0A0A] group">
                    <video
                        ref={videoRef}
                        key={selectedVideo.id}
                        src={selectedVideo.videoUrl}
                        className="w-full h-full object-cover"
                        poster={selectedVideo.thumbnail}
                        onClick={togglePlay}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
                    />

                    {/* Play/Pause Overlay Button */}
                    <button
                        onClick={togglePlay}
                        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                            }`}
                    >
                        <div className=" rounded-full p-5 md:p-7  transition-all duration-300 hover:scale-110">
                            {isPlaying ? (
                                <Pause className="w-10 h-10 md:w-14 md:h-14 text-white" />
                            ) : (
                                <Play className="w-10 h-10 md:w-14 md:h-14 text-white fill-white ml-1" />
                            )}
                        </div>
                    </button>

                    {/* Video Info Overlay
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                        <p className="text-[#00B2FF] text-xs md:text-sm font-semibold tracking-wide">
                            {selectedVideo.title}
                        </p>
                        <p className="text-white text-lg md:text-2xl font-bold mt-1">
                            {selectedVideo.edition}
                        </p>
                    </div> */}

                    {/* Video Duration Badge */}
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white text-xs md:text-sm px-3 py-1.5 rounded-lg font-medium">
                        {selectedVideo.duration}
                    </div>
                </div>

                {/* Carousel Section */}
                <div className="relative">
                    {/* Carousel Container */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
                    >
                        {videos.map((video) => (
                            <div
                                key={video.id}
                                onClick={() => handleVideoSelect(video)}
                                className={`flex-shrink-0 w-[200px] md:w-[260px] bg-white rounded-sm overflow-hidden border-2 cursor-pointer transition-all duration-300  ${selectedVideo.id === video.id
                                    ? "border-[#04A1B7] "
                                    : "border-[#EDEDED] hover:border-[#04A1B7]/50"
                                    }`}
                            >
                                {/* Thumbnail */}
                                <div className="relative group overflow-hidden">
                                    <Image
                                        src={video.thumbnail}
                                        alt={video.title}
                                        width={260}
                                        height={146}
                                        className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110"
                                        unoptimized
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = `https://via.placeholder.com/260x146/1A1A1A/00B2FF?text=Video+${video.id}`;
                                        }}
                                    />

                                    {/* Play Icon Overlay on Hover */}
                                    {/* <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="bg-[#00B2FF] rounded-full p-3 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                            {selectedVideo.id === video.id && isPlaying ? (
                                                <Pause className="w-5 h-5 text-white" />
                                            ) : (
                                                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                            )}
                                        </div>
                                    </div> */}

                                    {/* Duration Badge */}
                                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-medium">
                                        {video.duration}
                                    </div>

                                    {/* Active Indicator */}
                                    {selectedVideo.id === video.id && (
                                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#04A1B7] " />
                                    )}
                                </div>

                                {/* Video Info */}
                                <div className="p-4">
                                    <p className="text-[#0F0F0F] text-base font-semibold tracking-wide truncate">
                                        {video.title}
                                    </p>
                                    <p className="text-sm text-[#0F0F0F] font-semibold mt-1">
                                        {video.edition}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={scrollLeft}
                        className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 bg-white shadow-xl p-2 md:p-3 rounded-full border border-[#EDEDED] hover:bg-gray-50  transition-all z-10 hover:border-[#04A1B7]"
                    >
                        <ArrowLeft size={22} className="text-[#1A1A1A] md:w-6 md:h-6" />
                    </button>

                    <button
                        onClick={scrollRight}
                        className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 bg-white shadow-xl p-2 md:p-3 rounded-full border border-[#EDEDED] hover:bg-gray-50 hover:shadow-2xl transition-all z-10 hover:border-[#04A1B7    ]"
                    >
                        <ArrowRight size={22} className="text-[#1A1A1A] md:w-6 md:h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}