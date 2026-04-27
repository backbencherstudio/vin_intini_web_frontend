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


export type EmpOpportunityType = {
    id: string;
    title: string;
    location: string;
    company: string;
    type: "Full Time" | "Part Time" | "Internship" | "Contract";
    mode: "Remote" | "On-site" | "Hybrid";
    salaryRange: string;
    postedTime: string;
}