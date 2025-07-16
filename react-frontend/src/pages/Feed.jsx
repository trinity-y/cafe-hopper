import React from 'react';

import { ThemeProvider } from '@emotion/react';
import theme from '../components/theme';
import { Box, Stack } from '@mui/material';
import Review from '../components/Review';
import CssBaseline from '@mui/material/CssBaseline';
import {Typography} from '@mui/material';
// import { useUser } from '../context/userContext';

// add the three other ratings later
const testReviews = [
    {
        username: 'abrasiveprophet',
        cafename: 'Midnight Run Cafe',
        rating: 4,
        notes: "iced latte w/ simple syrup <3"
    },
    {
        username: 'abrasiveprophet',
        cafename: 'Midnight Run Cafe',
        rating: 4,
        notes: "iced latte w/ simple syrup <3"
    },
    {
        username: 'abrasiveprophet',
        cafename: 'Midnight Run Cafe',
        rating: 4,
        notes: "iced latte w/ simple syrup <3"
    }
]
function FeedPage() {
    // const { setUser } = useUser();
    
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
                        testReviews.map((review, index) => {
                            return <Review key={index} review={review}/>
                        })
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
