import { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Slider, Switch, FormControlLabel } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../components/theme';
import Navbar from '../components/Navbar';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import BookmarkButton from '../components/BookmarkButton';
import { useUser } from '../context/userContext';

import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import CreateReview from '../components/CreateReview'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './Profile';
import FeedPage from './Feed';
import { formatOpeningDays } from '../utils/formatOpeningDays';
import cafeAPI from '../api/cafe';

const baseUrl = process.env.REACT_APP_ISLOCAL === "true" ? process.env.REACT_APP_LOCAL_API_URL : process.env.REACT_APP_PROD_API_URL;

function CafeSearchPage() {
    const [cafes, setCafes] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedCafe, setSelectedCafe] = useState(null);
    const [bookmarks, setBookmarks] = useState([]); // holds { cid, id } for each bookmarked cafe
    const [loading, setLoading] = useState(false);
    const { userId } = useUser();

    // janky frontend for filter search
    const [minRating, setMinRating] = useState(0);
    const [openNow, setOpenNow] = useState(false);
    const [useMyLoc, setUseMyLoc] = useState(false);      // ← NEW
    const [myLoc, setMyLoc] = useState(null);

    const [openCreateReview, setOpenCreateReview] = useState(false);
    const [reviewData, setReviewData] = useState([]); // holds {cafeName, cid} when rate button is pressed
    const handleReviewModalOpen = (cafeName, cid) => {
        setOpenCreateReview(true);
        setReviewData([cafeName, cid]);
    };
    const handleReviewModalClose = () => {
        setOpenCreateReview(false);
        setReviewData([]);
    }    
    const [sliderPriceFilter, setSliderPriceFilter] = useState([0,50]);
    const [userFilterPrice, setUserFilterPrice] = useState(false);
    const fetchPriceFilteredCafes = async () => {
        if (sliderPriceFilter) {
            const getCafesWithinRange = await cafeAPI.searchCafesByPriceRange(inputValue, sliderPriceFilter[0], sliderPriceFilter[1]); 
            setCafes(getCafesWithinRange);
        }
    };
    const handleChange = (event, newValue) => {
        setUserFilterPrice(true);
        setSliderPriceFilter(newValue);
        fetchPriceFilteredCafes();
    };

    const resetPriceFilter = () => {
        setSliderPriceFilter([0,50]);
        setUserFilterPrice(false);
        fetchCafes(inputValue);
    };

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
                stars.push(<StarIcon key={i} sx={{ color: 'primary.main' }} />); // full star
            } else if (i === Math.ceil(value) && !Number.isInteger(value)) {
                stars.push(<StarHalfIcon key={i} sx={{ color: 'primary.main' }} />); // half star
            } else {
                stars.push(<StarBorderIcon key={i} sx={{ color: 'primary.main' }} />); // empty star
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

    // When user toggles "Use My Location"
    useEffect(() => {
        if (!useMyLoc) {
            setMyLoc(null);
            return;
        }
        if (!navigator.geolocation) {
            alert('Geolocation not supported');
            setUseMyLoc(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            pos => {
                setMyLoc({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            },
            err => {
                console.error('Geolocation error:', err);
                setUseMyLoc(false);
            }
        );
    }, [useMyLoc]);


    // Helper: given a café’s openingDays JSON string, is it open right now?
    function isOpenNow(cafe) {
        try {
            const obj = JSON.parse(cafe.openingDays);
            const now = new Date();
            const day = now.getDay(); // 0=Sunday … 6=Saturday
            const minutesNow = now.getHours() * 60 + now.getMinutes();
            const period = obj.periods.find(p => p.open.day === day);
            if (!period) return false;

            const openMin = period.open.hour * 60 + period.open.minute;
            const closeMin = period.close.hour * 60 + period.close.minute;
            return minutesNow >= openMin && minutesNow <= closeMin;
        } catch (e){
            console.error(e)
            return false;
        }
    }

    // Helper: Haversine formula!!!! 👀
    function getDistanceKm(lat1, lon1, lat2, lon2) {
        const toRad = x => (x * Math.PI) / 180;
        const R = 6371; // Earth km radius
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Helper: apply name + rating + openNow + location filters
    const visibleCafes = cafes
        .filter(c => c.name.toLowerCase().includes(inputValue.toLowerCase()))
        .filter(c => Number(c.googleRating) >= minRating)
        .filter(c => openNow ? isOpenNow(c) : true)
        .filter(c => {
            if (!useMyLoc || !myLoc) return true;
            const dist = getDistanceKm(
                myLoc.lat,
                myLoc.lng,
                Number(c.latitude),
                Number(c.longitude)
            );
            return dist <= 3; // within 5 km
        });

    return (
        <ThemeProvider theme={theme}>
            <Navbar />
            <Routes>
                <Route path='/cafesearch' element={<CafeSearchPage />} />
                <Route path='/feed' element={<FeedPage />} />
                <Route path='/profile' element={<Profile />} />
            </Routes>
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
                        if (userFilterPrice){
                            fetchPriceFilteredCafes();
                        } else {
                            fetchCafes(v); // live search
                        }
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            setSelectedCafe(null);
                            fetchCafes(inputValue);
                        }
                    }}
                />
                <Typography gutterBottom sx={{mt:2}}>Filter by price range</Typography>
                <Box
                    sx={{
                            justifyContent: 'left',
                            width:'30%',
                            ml: 2,
                            display: 'flex', 
                            flexDirection: 'row', 
                            gap: 5
                        }}
                >
                    
                    <Slider
                        value={sliderPriceFilter}
                        onChange={handleChange}
                        min={0}
                        max={50}
                        marks = {[
                                {
                                    value: 0,
                                    label: '$0 CAD',
                                },
                                {
                                    value: 50,
                                    label: '$50+ CAD',
                                }
                        ]}
                         valueLabelDisplay="auto"
                    />
                    <Button variant="outlined" onClick={resetPriceFilter} sx={{height:'100%'}}>Reset</Button>
                </Box>
                <Box sx={{ mt: 2, mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={openNow}
                                onChange={() => setOpenNow(o => !o)}
                            />
                        }
                        label={
                            <Typography variant="body1">
                                Open Now
                            </Typography>
                        }
                    />
                    <FormControlLabel
                        control={<Switch checked={useMyLoc} onChange={() => setUseMyLoc(u => !u)} />}
                        label={<Typography variant="body1">My Location</Typography>}
                    />
                    <Box sx={{ width: 150 }}>
                        <Typography variant="body1" textAlign="center">Min. Rating</Typography>
                        <Slider
                            value={minRating}
                            onChange={(_, v) => setMinRating(Number(v))}
                            step={0.5}
                            min={0}
                            max={5}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                </Box>

                {!selectedCafe && inputValue && visibleCafes.length === 0 && (
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

                {!selectedCafe && visibleCafes.length > 0 && (
                    <>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            {inputValue
                                ? `Showing ${visibleCafes.length} result${visibleCafes.length > 1 ? 's' : ''} for "${inputValue}"`
                                : `Showing all ${visibleCafes.length} cafes`}
                        </Typography>

                        {visibleCafes.map(cafe => {
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
                                    <Box sx={{ flex: 2 }}>
                                        <Typography variant="h6">
                                            ☕️ {cafe.name}
                                        </Typography>
                                        <h5> </h5>
                                        <Typography variant="h">
                                            📍 {formatAddress(cafe.address)}
                                        </Typography>
                                        <h5 > </h5>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2">
                                                {Number(cafe.googleRating).toFixed(1)}
                                            </Typography>
                                            <StarRating rating={cafe.googleRating} />
                                        </Box>
                                        {cafe.startprice && 
                                            <Typography variant="body2" sx={{mt:2}}>
                                                Price range: $ {cafe.startprice} CAD - $ {cafe.endprice} CAD
                                            </Typography>
                                        }
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2">Hours</Typography>
                                        {formatOpeningDays(cafe.openingDays).map((line, i) => (
                                            <Typography key={i} variant="body2" noWrap>
                                                {line}
                                            </Typography>
                                        ))}
                                    </Box>


                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Button variant="contained" onClick={() => handleReviewModalOpen(cafe.name, cafe.id)}>
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

                            <Button variant="contained" onClick={() => handleReviewModalOpen(selectedCafe.name, selectedCafe.id)}>Rate</Button>

                        </Box>
                    </Box>
                )}
            </Box>
            <Modal
                open={openCreateReview}
                onClose={handleReviewModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                }}>
                    <Button onClick={handleReviewModalClose} sx={{ marginLeft: 'auto', display: 'block' }}> 
                        <CloseIcon/> 
                    </Button>
                    <CreateReview cafeName={reviewData[0]} cid={reviewData[1]}/>
                </Box>
            </Modal>
        </ThemeProvider>
    );
}

export default CafeSearchPage;
