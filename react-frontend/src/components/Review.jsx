import {Box} from '@mui/material';
import StarRating from './StarRating';
import { Typography } from '@mui/material';
import Reaction from './Reaction';

function Review({review, key, disableLikes = false}) {
    // Expecting review object with the following structure:
    // 1. Username (username)
    // 2. Cafe name (name)
    // 3. Cafe Overall Rating (overallRating)
    // 4. Cafe Food Rating (foodRating)
    // 5. Cafe Drink Rating (drinkRating)
    // 6. Cafe Atmosphere Rating (atmosphereRating)
    // 7. Notes (notes)
    // 8. Review id (rid)
    // 9. Review timestamp (timestamp)
    return (
        <>
        <Box 
        component="section" 
        sx={{ 
            marginTop: key === 0 ? 0 : '0.5em',
            // borderColor: '#b5b5b5',
            width: '100%', 
            bgcolor: 'white', 
            padding: '2em' 
        }} 
        display="flex" 
        justifyContent="space-between"
        >
            {/* main review info */}
            <Box display="flex" flexDirection="column" sx={{ height: '100%', marginTop:'1em' }} gap={1}>
                <Typography variant='h4'>{review.name}</Typography>
                <StarRating rating={review.overallRating} interactive={false}></StarRating>
                {review.username && <Typography variant='p' style={{ fontStyle: 'italic', margin: 0, marginTop: '4px' }}>
                    {`written by ${review.username} 🐸 on ${review.timestamp}`}
                </Typography>}
                <br/>
                <Typography variant='p' style={{ margin: '0' }}>{review.notes}</Typography>
                {!disableLikes && <Reaction reviewId={review.rid}/>}
            </Box>
            {/* detailed ratings */}
            <Box display="flex" flexDirection="column"sx={{textAlign: 'center', justifyContent:'center'}} gap={1}>
                <Box display="flex" alignItems="center" gap={1.5} >
                    <Typography variant='p'>Food 🥪</Typography>
                    <StarRating rating={review.foodRating || review.foodrating} interactive={false}></StarRating>
                </Box>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant='p'>Drink ☕</Typography>
                    <StarRating rating={review.drinkRating || review.drinkrating} interactive={false}></StarRating>
                </Box>  
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant='p'>Atmosphere 🏠</Typography>
                    <StarRating rating={review.atmosphereRating || review.atmosphererating} interactive={false}></StarRating>
                </Box>              
            </Box>
        </Box>
        </>
    );
};

export default Review;
