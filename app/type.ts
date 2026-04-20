import { JSX } from "react";

export type Testimonial = {
    id: string;
    review: string;
    rating: number;
    imgUrl: string;
    reviewer: {
        name: string;
        occupation: string;
        location: string;
        avatarUrl: string;
    }
}


export type OurImpactType = {
    id: string;
    title: string;
    description: string;
    Icon: any;
    value: string;
    uniqueKey: string;
    bgColor: string;
    IconBgColor: string;
}