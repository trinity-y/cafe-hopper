import {Box} from '@mui/material';
import StarRating from './StarRating';
import { Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

function Review({review}) {
    // Expecting review object with the following structure:
    // 1. Username (username)
    // 2. Cafe name (cname)
    // 3. Cafe Rating (crating)
    // 4. Notes (notes)
    return (
        <>
        <Box component="section" sx={{ px:4, py: 2, border: '1px solid grey', width: '100%', bgcolor:'whitesmoke', padding:'2em' }} display="flex" justifyContent="space-between" >
            {/* main review info */}
            <Box display="flex" flexDirection="column" sx={{ height: '100%', marginTop:'1em' }}>
                <Box display="flex" alignItems="baseline" gap={3}>
                    <Typography variant='h4' style={{ margin: 0 }}>{review.cafename}</Typography>
                    <StarRating rating={review.rating} interactive={false}></StarRating>
                </Box>
                <Typography variant='h5' style={{ fontStyle: 'italic', margin: 0, marginTop: '4px' }}>
                    {`written by ${review.username} 🐸`}
                </Typography>
                <br/>
                <Typography variant='p' style={{ margin: 'auto 0' }}>{review.notes}</Typography>
                <br/>
                <Box display="flex" gap={0.5}>
                    <IconButton 
                        // onClick={handleThumbsUp}
                        aria-label="thumbs up"
                        color="black"
                        disableRipple
                        sx={{
                            '&:hover': {
                                color: 'secondary.main'
                            },
                            width: 'auto'
                        }}
                    >
                        <ThumbUpIcon />
                    </IconButton>
                    <Typography variant='p' style={{ margin: 'auto 0' }}>101</Typography> {/* TODO: update w/ like count */}
                </Box>
                
            </Box>
            {/* detailed ratings */}
            <Box display="flex" flexDirection="column"sx={{textAlign: 'center', justifyContent:'center'}} gap={1}>
                <Box display="flex" alignItems="center" gap={1.5} >
                    <Typography variant='p'>Food Rating 🥪</Typography>
                    <StarRating rating={review.rating} interactive={false}></StarRating>
                </Box>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant='p'>Drink Rating ☕</Typography>
                    <StarRating rating={review.rating} interactive={false}></StarRating>
                </Box>  
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant='p'>Atmosphere Rating 🏠</Typography>
                    <StarRating rating={review.rating} interactive={false}></StarRating>
                </Box>              
            </Box>
        </Box>
        </>
    );
};

export default Review;
