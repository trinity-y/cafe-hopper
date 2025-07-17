import {Box} from '@mui/material';
import StarRating from './StarRating';
import { Typography } from '@mui/material';

function Cafe({cafe}) {
    // Expecting cafe object with the following structure:
    // 1. Cafe ID (id)
    // 2. Cafe name (name)
    // 3. Cafe address (address)
    // 4. Opening days (openingDays)
    // 5. Google rating (googleRating)
    // 6. Final rating (finalRating) - optional, only in ICafeWithRating
    return (
        <>
        <Box component="section" sx={{ px:4, py: 2, border: '1px solid grey', width: '100%', bgcolor:'whitesmoke', padding:'2em' }} display="flex" justifyContent="space-between" >
            <Box display="flex" flexDirection="column" sx={{ height: '100%', marginTop:'1em' }} gap={1}>
                <Typography variant='h4'>{cafe.name}</Typography>
                <StarRating rating={cafe.googleRating} interactive={false}></StarRating>
                <Typography variant='p' style={{ fontStyle: 'italic', margin: 0, marginTop: '4px' }}>
                    📍 {cafe.address}
                </Typography>
                <br/>
                <Typography variant='p' style={{ margin: '0' }}>
                    🕒 {cafe.openingDays}
                </Typography>
            </Box>
            {cafe.finalRating && (
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant='p'>Friend's Rating 🏆</Typography>
                    <StarRating rating={cafe.finalRating} interactive={false}></StarRating>
                </Box>
            )}           
        </Box>
        </>
    );
};

export default Cafe;