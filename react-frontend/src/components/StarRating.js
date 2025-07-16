import {Box} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
const StarRating = ({ rating, onRatingChange, inputRatingToChange, interactive = true }) => {
        // const interactive = true;
        const displayRating = interactive ? inputRatingToChange : rating;
        const stars = [];
        const totalStars = 5;

        for (let i = 1; i <= totalStars; i++) {
            const isFilled = i <= Math.floor(displayRating);
            const isHalf = i === Math.ceil(displayRating) && !Number.isInteger(displayRating);
            
            stars.push(
                <Box
                    key={i}
                    sx={{
                        cursor: interactive ? 'pointer' : 'default',
                    }}
                    onClick={interactive ? () => onRatingChange(i) : undefined}
                >
                    {isFilled ? (
                        <StarIcon sx={{ color: 'gold' }} />
                    ) : isHalf ? (
                        <StarHalfIcon sx={{ color: 'gold' }} />
                    ) : (
                        <StarBorderIcon sx={{ color: 'gold' }} />
                    )}
                </Box>
            );
        }

        return <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>{stars}</Box>;
    };
    export default StarRating;