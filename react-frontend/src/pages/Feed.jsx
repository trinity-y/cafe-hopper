import React from 'react';

import { ThemeProvider } from '@emotion/react';
import theme from '../components/theme';
import { Box, Stack } from '@mui/material';
import Review from '../components/Review';
import CssBaseline from '@mui/material/CssBaseline';
import {Typography} from '@mui/material';
import { useUser } from '../context/userContext';

import reviewAPI from '../api/review';

function FeedPage() {
    const { userId } = useUser();
    const [reviews, setReviews] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                const getFeedReviewsResult = await reviewAPI.getReviewsForFeed(userId); 
                setReviews(getFeedReviewsResult);
            }
        }
        console.log(reviews);
        fetchData();
    }, [userId]);
    
    return (
    <>
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
            sx={{ display:'flex', flexDirection:'column', alignItems:'center'}}
            width={'100%'}
        >
            <Box
                sx={{ display:'flex', flexDirection:'column', alignItems:'center'}}
                width={'80%'}
            >
                <Box
                    sx={{ alignItems:'left'}}
                    width='100%'
                    paddingX='1em'
                    paddingTop='1em'
                >
                    <Typography variant="h2" fontWeight='fontWeightMedium' color='whitesmoke' margin={'1rem'}>Your Feed</Typography>
                </Box>
                <Stack
                    justifyContent="center"
                    alignItems={"center"}
                    width={'100%'}
                >
                    <Box width={'100%'} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '30px'}}>
                        {
                        reviews?.length > 0 ?
                        reviews.map((review, index) => {
                            return <Review key={index} review={review}/>
                        }) :
                        <Box
                            sx={{ alignItems:'left'}}
                            width='100%'
                        >
                            <Typography variant="h5" color='whitesmoke'>You're not following anyone who has written a review yet!</Typography>
                        </Box>
                        } 
                    </Box>
                </Stack>
            </Box>
            
        </Box>



    </ThemeProvider>

    </>
    )
}

export default FeedPage;
