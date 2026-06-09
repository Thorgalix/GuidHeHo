import { api } from "./api";


export const fetchGuideReviews = async (guideId) => {
    return api.get(`/reviews/${guideId}/`)
}

export const createReview = async (guide, rating, comment) => {
    return api.post(`/reviews/`, { guide, rating, comment })
}
