import {Box} from '@mui/material';
import StarRating from './StarRating';
import { Typography } from '@mui/material';
import Reaction from './Reaction';

function Review({review}) {
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
        <Box component="section" sx={{ px:4, py: 2, border: '1px solid grey', width: '100%', bgcolor:'whitesmoke', padding:'2em' }} display="flex" justifyContent="space-between" >
            {/* main review info */}
            <Box display="flex" flexDirection="column" sx={{ height: '100%', marginTop:'1em' }}>
                <Box display="flex" alignItems="baseline" gap={3}>
                    <Typography variant='h4' style={{ margin: 0 }}>{review.name}</Typography>
                    <StarRating rating={review.overallRating} interactive={false}></StarRating>
                </Box>
                <Typography variant='p' style={{ fontStyle: 'italic', margin: 0, marginTop: '4px' }}>
                    {`written by ${review.username} 🐸 on ${review.timestamp}`}
                </Typography>
                <br/>
                <Typography variant='p' style={{ margin: 'auto 0' }}>{review.notes}</Typography>
                <br/>
                <Reaction reviewId={review.rid} />
                
            </Box>
            {/* detailed ratings */}
            <Box display="flex" flexDirection="column"sx={{textAlign: 'center', justifyContent:'center'}} gap={1}>
                <Box display="flex" alignItems="center" gap={1.5} >
                    <Typography variant='p'>Food 🥪</Typography>
                    <StarRating rating={review.foodRating} interactive={false}></StarRating>
                </Box>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant='p'>Drink ☕</Typography>
                    <StarRating rating={review.drinkRating} interactive={false}></StarRating>
                </Box>  
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant='p'>Atmosphere 🏠</Typography>
                    <StarRating rating={review.atmosphereRating} interactive={false}></StarRating>
                </Box>              
            </Box>
        </Box>
        </>
    );
};

export default Review;
