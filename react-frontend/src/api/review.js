import { client } from './base';

const getReviewsForFeed = async (uid) => {
    try {
        const response = await client.get('/reviews/feed', {
            params: { uid }
        })
        console.log(response.data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
}

const reviewAPI = {
    getReviewsForFeed
}
export default reviewAPI;