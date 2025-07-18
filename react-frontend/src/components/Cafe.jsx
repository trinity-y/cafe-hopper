import {Box} from '@mui/material';
import StarRating from './StarRating';
import { Typography } from '@mui/material';

function Cafe({cafe}) {
    // Expecting cafe object with the following structure:
    // 1. Cafe ID (id)
    // 2. Cafe name (name)
    // 3. Cafe address (address)
    // 4. Opening days (openingDays)
    // 5. Final rating (finalRating) - only in ICafeWithRating
    // 6. Notes (friendNotes) - only in ICafeWithRating
    // 7. Friend's Username (friendUsername) - only in ICafeWithRating
    console.log(cafe.friendNotes);
    console.log(cafe.friendUsername);

    const formatOpeningHours = (hoursData) => {
        try {
            const parsed = typeof hoursData === 'string' ? JSON.parse(hoursData) : hoursData;
            
            if (parsed.weekdayDescriptions && Array.isArray(parsed.weekdayDescriptions)) {
                return parsed.weekdayDescriptions.map((day, index) => (
                <div key={index} style={{ marginBottom: '4px' }}>
                    {day}
                </div>
                ));
            }
            
            return 'Hours not available';
        } catch (error) {
            console.error('Error parsing opening hours:', error);
            return 'Hours not available';
        }
    };
    
    return (
        <>
        <Box component="section" sx={{ px:4, py: 2, border: '1px solid grey', width: '80%', bgcolor:'whitesmoke', padding:'2em' }} display="flex" justifyContent="space-between" >
            <Box display="flex" flexDirection="column" sx={{ height: '100%', marginTop:'1em' }} gap={1}>
                <Typography variant='h4'>{cafe.name}</Typography>
                <Typography variant='p' style={{ fontStyle: 'italic', margin: 0, marginTop: '4px' }}>
                    📍 {cafe.address}
                </Typography>
                {cafe.friendNotes && cafe.friendUsername && (
                    <Typography variant='p' style={{ margin: '0', marginTop: '8px', fontStyle: 'italic', color: '#666' }}>
                        💬 Your friend {cafe.friendUsername} said: "{cafe.friendNotes}"
                    </Typography>
                )}
                <br/>
                {cafe.finalRating && (
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Typography variant='p'>Friend's Rating 🏆</Typography>
                    <StarRating rating={cafe.finalRating} interactive={false}></StarRating>
                </Box>
            )}
            </Box>
            <Box display="flex" alignItems="center" gap={1.5}>
                <Typography variant='p' style={{ margin: '0' }}>
                    {formatOpeningHours(cafe.openingDays)}
                </Typography>  
            </Box>      
        </Box>
        </>
    );
};

export default Cafe;