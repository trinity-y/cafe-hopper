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
const getReviewsForUser = async (uid) => {
    try {
        const response = await client.get('/reviews/user', {
            params: {uid}
        })
        console.log(response.data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
}

const reviewAPI = {
    getReviewsForFeed,
    getReviewsForUser
}
export default reviewAPI;