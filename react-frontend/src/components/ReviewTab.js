import { Box, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import reviewAPI from '../api/review';
import cafeAPI from '../api/cafe';
import { useUser } from '../context/userContext';
import Review from './Review';

export default function ReviewTab() {
    const { userId } = useUser();
    const [reviews, setReviews] = useState([]);
    const [reviewsWithCafeName, setReviewsWithCafeName] = useState([]);
    const [cafe, setCafe] = useState(null);
    useEffect(() => {
        const fetchUserReviews = async () => {
            if (userId) {
                const getUserReviewsResult = await reviewAPI.getReviewsForUser(userId); 
                setReviews(getUserReviewsResult);
            }
        }
        fetchUserReviews();
    }, [userId]);
    useEffect(() => {
        const fetchCafeData = async (cid) => {
            if (cid){
                const getCafeResults = await cafeAPI.getCafe(cid); 
                return getCafeResults;
            }
        }
        // Processing cafe data for each cafe in user reviews and adding it to the reviews which will be used by the component
        // This is mostly to add cafe name
        const addCafeName = async () => {
            const tempReviews = [];
            for (const review of reviews){
                const cafeData = await fetchCafeData(review.cid);
                const newReview = { ...review };
                if (cafeData && review) {
                    newReview.name = cafeData.name;
                    newReview.rid = review.id;
                    // why did i camelcase them :(
                    newReview.overallRating = review.rating;
                }
                tempReviews.push(newReview);
            }
            setReviewsWithCafeName(tempReviews);
        };
        addCafeName();
    }, [reviews]);
    return(
        <Box>
            {
                reviewsWithCafeName?.length > 0 ?
                reviewsWithCafeName.map((review, index) => {
                    return <Review review={review} key={index} disableLikes={true} />
                }) :
                <Box
                    sx={{ alignItems:'left'}}
                    width='100%'
                >
                    <Typography variant="h5">You have no reviews yet.</Typography>
                </Box>
            } 
        </Box>
    ); 
}