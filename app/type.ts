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