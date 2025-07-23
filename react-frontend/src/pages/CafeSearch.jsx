import { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../components/theme';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import BookmarkButton from '../components/BookmarkButton';
import { useUser } from '../context/userContext';

const baseUrl = process.env.REACT_APP_ISLOCAL ? process.env.REACT_APP_LOCAL_API_URL : process.env.REACT_APP_PROD_API_URL;

function CafeSearchPage() {
    const [cafes, setCafes] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedCafe, setSelectedCafe] = useState(null);
    const [bookmarks, setBookmarks] = useState([]); // holds { cid, id } for each bookmarked cafe
    const [loading, setLoading] = useState(false);
    const { userId } = useUser();

    // Fetch user bookmarks
    const fetchBookmarks = async () => {
        if (!userId) {
            return;
        }
        try {
            const res = await fetch(`${baseUrl}/bookmarks/${userId}`);
            if (!res.ok) {
                throw new Error('Failed to fetch bookmarks');
            }
            const data = await res.json(); // [{ id, uid, cid }]
            console.log('[fetchBookmarks] Fetched bookmarks:', data);
            setBookmarks(data);
        } catch (err) {
            console.error('[fetchBookmarks] Error:', err);
        }
    };

    // Add bookmark
    const addBookmark = async (cid) => {
        try {
            const res = await fetch(`${baseUrl}/bookmarks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: userId, cid }),
            });
            if (!res.ok) {
                throw new Error('Failed to add bookmark');
            }
            await fetchBookmarks(); // refresh bookmarks
            return true;
        } catch (err) {
            console.error('[addBookmark] Error:', err);
            return false;
        }
    };

    // Delete bookmark
    const deleteBookmark = async (cid) => {
        const bookmark = bookmarks.find((b) => b.cid === cid);
        if (!bookmark) {
            return false;
        }
        try {
            const res = await fetch(`${baseUrl}/bookmarks/${bookmark.id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                throw new Error('Failed to delete bookmark');
            }
            await fetchBookmarks(); // refresh bookmarks
            return true;
        } catch (err) {
            return false;
        }
    };

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
            const url = new URL(`${baseUrl}/cafes/search`);
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

    useEffect(() => {
        if (userId !== null) fetchBookmarks();
    }, [userId]);

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

                        {cafes.map(cafe => {
                            const isBookmarked = bookmarks.some((b) => b.cid === cafe.id);

                            return (
                                <Box
                                    key={cafe.id}
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
                                        <BookmarkButton
                                            isBookmarked={isBookmarked}
                                            disabled={loading}
                                            onToggle={async (newState) => {
                                                if (!userId) {
                                                    return false;
                                                }
                                                setLoading(true);
                                                let success;
                                                if (newState) {
                                                    success = await addBookmark(cafe.id);
                                                } else {
                                                    success = await deleteBookmark(cafe.id);
                                                }
                                                setLoading(false);
                                                return success;
                                            }}
                                        />
                                    </Box>
                                </Box>
                            );
                        })}
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
