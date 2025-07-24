import { client } from './base';

const getReviewsForFeed = async (uid) => {
    try {
        const response = await client.get('/reviews/feed', {
            params: { uid }
        })
        return response.data;
    } catch (e) {
        console.error(e);
    }
}

const reviewAPI = {
    getReviewsForFeed
}
export default reviewAPI;