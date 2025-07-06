import {Box} from '@mui/material';
import StarRating from './StarRating';
function Review(review) {
    // Expecting review object with the following structure:
    // 1. Username (username)
    // 2. Cafe name (cname)
    // 3. Cafe Rating (crating)
    // 4. Notes (notes)
    return (<Box component="section" sx={{ p: 2, border: '1px solid grey', width: '80%' }} display="flex" 
            flexDirection={"column"} gap={.5}>
                <h4>{review.username}</h4>
                <h5>{review.cafename}</h5>
                <StarRating rating={review.rating} interactive={false}></StarRating>
                <p>{review.notes}</p>

    </Box>);
};

export default Review;