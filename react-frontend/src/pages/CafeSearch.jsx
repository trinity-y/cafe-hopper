import { useState, useEffect } from 'react';
import { Box, TextField, Autocomplete, Typography, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../components/theme';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';

function CafeSearchPage() {
    const [cafes, setCafes] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedCafe, setSelectedCafe] = useState(null);
    const StarRating = ({ rating }) => {
        const stars = [];
        const totalStars = 5;

        for (let i = 1; i <= totalStars; i++) {
            if (i <= Math.floor(rating)) {
                // Full star
                stars.push(<StarIcon key={i} sx={{ color: 'gold' }} />);
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                // Half star
                stars.push(<StarHalfIcon key={i} sx={{ color: 'gold' }} />);
            } else {
                // Empty star
                stars.push(<StarBorderIcon key={i} sx={{ color: 'gold' }} />);
            }
        }

        return <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>{stars}</Box>;
    };
    const fetchCafes = async (searchTerm = '') => {
        try {
            const url = new URL('http://localhost:3001/cafes/search');
            if (searchTerm) url.searchParams.set('search', searchTerm);
            const res = await fetch(url.toString());
            const data = await res.json();
            setCafes(data);
        } catch (error) {
            console.error('Error fetching cafes:', error);
            return null;
        }
    };

    useEffect(() => {
        fetchCafes();
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
                <Autocomplete
                    freeSolo
                    options={cafes}
                    inputValue={inputValue}
                    onInputChange={(_, v) => {
                        setInputValue(v);
                        setSelectedCafe(null);
                        fetchCafes(v); // live search
                    }}
                    getOptionLabel={(option) => option.name || ''}
                    onChange={(_, newValue) => {
                        setSelectedCafe(newValue);
                        setInputValue(newValue?.name || '');
                    }}
                    renderOption={(props, option) => (
                        <Box component="li" {...props}>
                            {option.name}
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search for a Cafe"
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    setSelectedCafe(null);
                                    fetchCafes(inputValue); // fetch filtered on Enter
                                }
                            }}
                        />
                    )}
                />

                {!selectedCafe && inputValue && cafes.length > 0 && (
                    <>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Showing {cafes.length} result{cafes.length > 1 ? 's' : ''} for "{inputValue}"
                        </Typography>
                        {cafes.map(cafe => (
                            <Box
                                key={cafe.cid}
                                sx={{
                                    mt: 2, p: 2, border: '1px solid black',
                                    display: 'flex', justifyContent: 'space-between'
                                }}
                            >
                                <Box>
                                    <h3>{cafe.name}</h3>
                                    <StarRating rating={cafe.googleRating} />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Button variant="contained" disabled>More info</Button>
                                    <Button variant="contained" disabled>Rate</Button>
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
                            <h3>{selectedCafe.name}</h3>
                            <StarRating rating={selectedCafe.googleRating} />
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