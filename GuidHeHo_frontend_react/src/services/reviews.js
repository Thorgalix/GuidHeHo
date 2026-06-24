import { api } from "./api";


export const fetchGuideReviews = async (guideId, page = 1) => {
    return api.get(`/reviews/${guideId}/?page=${page}`)
}

export const fetchTravelerReviews = async (travelerId, page = 1) => {
    return api.get(`/reviews/traveler/${travelerId}/?page=${page}`)
}

export const createReview = async (guide, rating, comment) => {
    return api.post(`/reviews/`, { guide, rating, comment })
}
