import { client } from './base';

const getCafe = async (id) => {
    try {
        const response = await client.get(`/cafes/${id}`);
        console.log(response.data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
}
const searchCafesByPriceRange = async (search, startPrice, endPrice) => {
    try {
        const response = await client.get('/cafes/pricerange', {
            params: {search, startPrice, endPrice}
        })
        console.log(response.data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
}

const cafeAPI = {
    getCafe,
    searchCafesByPriceRange
}
export default cafeAPI;