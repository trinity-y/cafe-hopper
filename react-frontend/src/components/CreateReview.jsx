import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {Box, TextField, Grid, Button, Alert} from '@mui/material';
import theme from './theme';
import StarRating from './StarRating';
import CreateReviewRow from './CreateReviewRow';
import { getAuth, onAuthStateChanged } from "firebase/auth";

function CreateReview({cafeName, cid}) {
    const [userRating, setUserRating] = useState(0);
    const [drinkRating, setDrinkRating] = useState(0);
    const [foodRating, setFoodRating] = useState(0);
    const [atmosphereRating, setAtmosphereRating] = useState(0);
    const [notes, setNotes] = useState("");
    const [showSubmissionResult, setShowSubmissionResult] = useState(false);

    const handleSubmit = () => {
        setShowSubmissionResult(true);
        // Add your review submission logic here
    };
    const FormSubmission = () => {
        let uid = 0;
        if (userRating === 0){
            return <Alert severity="error">Please submit a ranking.</Alert>;
        }
        try {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    uid = user.uid;
                } else {
                    return <Alert severity="error">You must be signed in to write a review.</Alert>;
                }
            });
            CreateReviewRow(userRating, foodRating, drinkRating, atmosphereRating, notes, uid, cid);
        } catch (error){
            console.log(error);
            return <Alert severity="error">An error has occured.</Alert>;
        }
        return <Alert severity="success">Your review was successfully created.</Alert>;
    }
    return (
        <ThemeProvider theme={theme}>
            <Box 
            display="flex" 
            // bgcolor="primary.main"
            alignItems="center"
            justifyContent="center"
            flexDirection={"column"}
            width={"600px"}
            gap={2}
            >
                <Box
                display={"flex"} flexDirection={"row"} gap={10}
                alignItems={"center"}
                >
                    <h1>Create a Review</h1>
                    <h3>{cafeName ? cafeName : "Unnamed Cafe"}</h3>
                </Box>
                <StarRating rating={0} onRatingChange={setUserRating} inputRatingToChange={userRating}></StarRating>
                <TextField
                    id="outlined-textarea"
                    label="Write notes here"
                    placeholder="I liked the atmosphere..."
                    onChange={(event) => {
                        setNotes(event.target.value);
                        console.log(event.target.value);
                    }}
                    multiline
                    sx={{width: '80%'}}
                />
                { userRating !== 0 && 
                    (<Box width={"80%"} justifyContent={"center"}> 
                        <Grid container spacing={1}>
                            <Grid size={12}>
                                <Box display="flex" alignItems="left" justifyContent="left" gap={2}>
                                    <Box width={"60%"}>
                                        <h4>Drink Rating</h4>
                                    </Box>
                                    <StarRating rating={0} onRatingChange={setDrinkRating} inputRatingToChange={drinkRating}></StarRating>
                                </Box>
                            </Grid>
                            <Grid size={12}>
                                <Box display="flex" alignItems="left" justifyContent="left" gap={2}>
                                    <Box width={"60%"}>
                                        <h4>Food Rating</h4>
                                    </Box>
                                    <StarRating rating={0} onRatingChange={setFoodRating} inputRatingToChange={foodRating}></StarRating>
                                </Box>
                            </Grid>
                            <Grid size={12}>
                                <Box display="flex" alignItems="left" justifyContent="left" gap={2}>
                                    <Box width={"60%"}>
                                        <h4>Atmosphere Rating</h4>
                                    </Box>
                                    <StarRating rating={0} onRatingChange={setAtmosphereRating} inputRatingToChange={atmosphereRating}></StarRating>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    )
                }
                <Button variant="contained" onClick={handleSubmit}> Submit </Button>
                {showSubmissionResult && (FormSubmission())}
            </Box>
        </ThemeProvider>
    );
}

export default CreateReview;

