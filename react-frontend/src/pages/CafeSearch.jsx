import { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../components/theme';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';

function CafeSearchPage() {
    const [cafes, setCafes] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedCafe, setSelectedCafe] = useState(null);

    // helper to strip out ", Canada"
    const formatAddress = (address) =>
        address.replace(/,\s*Canada$/, '').trim();

    const StarRating = ({ rating }) => {
        const value = typeof rating === 'string'
            ? parseFloat(rating)
            : rating;
        const stars = [];
        const totalStars = 5;

        for (let i = 1; i <= totalStars; i++) {
            if (i <= Math.floor(value)) {
                stars.push(<StarIcon key={i} sx={{ color: 'gold' }} />); // full star
            } else if (i === Math.ceil(value) && !Number.isInteger(value)) {
                stars.push(<StarHalfIcon key={i} sx={{ color: 'gold' }} />); // half star
            } else {
                stars.push(<StarBorderIcon key={i} sx={{ color: 'gold' }} />); // empty star
            }
        }

        return <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>{stars}</Box>;
    };
    const fetchCafes = async (term = '') => {
        try {
            const url = new URL('http://localhost:3001/cafes/search');
            if (term) url.searchParams.set('search', term);
            const res = await fetch(url.toString());
            const data = await res.json();
            setCafes(data);
        } catch (error) {
            console.error('Error fetching cafes:', error);
            return null;
        }
    };

    useEffect(() => {
        fetchCafes('');
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                justifyContent: 'center',
                padding: '30px'
            }}>
                <TextField
                    fullWidth
                    label="Search for a Cafe"
                    value={inputValue}
                    onChange={e => {
                        const v = e.target.value;
                        setInputValue(v);
                        setSelectedCafe(null);
                        fetchCafes(v); // live search
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            setSelectedCafe(null);
                            fetchCafes(inputValue);
                        }
                    }}
                />

                {!selectedCafe && inputValue && cafes.length === 0 && (
                    <Box
                        sx={{
                            mt: 6,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h6">
                            Sorry! There are no matching cafes for “{inputValue}” 🐸❓
                        </Typography>
                    </Box>
                )}

                {!selectedCafe && cafes.length > 0 && (
                    <>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            {inputValue
                                ? `Showing ${cafes.length} result${cafes.length > 1 ? 's' : ''} for "${inputValue}"`
                                : `Showing all ${cafes.length} cafes`}
                        </Typography>

                        {cafes.map(cafe => (
                            <Box
                                Boxkey={cafe.cid}
                                sx={{
                                    mt: 2,
                                    p: 2,
                                    border: '1px solid black',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Box>
                                    <h3 > ☕️ {cafe.name}</h3>
                                    <h5 >{formatAddress(cafe.address)}</h5>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2">
                                            {Number(cafe.googleRating).toFixed(1)}
                                        </Typography>
                                        <StarRating rating={cafe.googleRating} />
                                    </Box>

                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Button variant="contained" disabled>
                                        More info
                                    </Button>
                                    <Button variant="contained" disabled>
                                        Rate
                                    </Button>
                                </Box>
                            </Box>
                        ))}
                    </>
                )}


                {selectedCafe && (
                    <Box
                        sx={{
                            p: 2, border: '1px solid black',
                            display: 'flex', justifyContent: 'space-between'
                        }}
                    >
                        <Box>
                            <h3> ☕️ {selectedCafe.name}</h3>
                            <h5>{formatAddress(selectedCafe.address)}</h5>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2">
                                    {Number(selectedCafe.googleRating).toFixed(1)}
                                </Typography>
                                <StarRating rating={selectedCafe.googleRating} />
                            </Box>

                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button variant="contained" disabled>More info</Button>
                            <Button variant="contained" disabled>Rate</Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </ThemeProvider>
    );
}

export default CafeSearchPage;