import { useState } from 'react';
import { Box, TextField, Autocomplete, Typography, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../components/theme';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';

function CafeSearchPage() {
    const [cafes, setCafes] = useState([]);
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
    const fetchCafes = async () => {
        try {
            const response = await fetch('http://localhost:8080/cafes');
            const data = await response.json();
            setCafes(data);
        } catch (error) {
            console.error('Error fetching cafes:', error);
            return null;
        }
    };
    fetchCafes();
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                justifyContent: 'center',
                padding: '30px'
            }}>
                <Box>
                    <Autocomplete
                        options={cafes}
                        getOptionLabel={(option) => option.name || ''}
                        onChange={(event, newValue) => {
                            setSelectedCafe(newValue);
                        }}
                        renderOption={(props, option) => (
                            <Box component="li" {...props}>
                                <div>
                                    {option.name}
                                </div>
                            </Box>
                        )}
                        renderInput={(params) => <TextField {...params} label="Search for a Cafe" />}
                    />
                </Box>

                {selectedCafe &&
                    <Typography variant={"body1"}>
                        Showing results
                    </Typography>
                }

                {selectedCafe &&
                    <Box
                        variant='basic'
                        sx={{
                            p: 2,
                            border: '1px solid black',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                        <Box>
                            <h3>
                                {selectedCafe.name}
                            </h3>
                            <StarRating rating={selectedCafe.googleRating} />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                            <Button variant='contained' disabled>
                                More info
                            </Button>
                            <Button variant='contained' disabled>
                                Rate
                            </Button>
                        </Box>
                    </Box>
                }
            </Box>
        </ThemeProvider>
    );
}
export default CafeSearchPage;