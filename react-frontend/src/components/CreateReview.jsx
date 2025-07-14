import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {Box, TextField, Grid, Button, Alert} from '@mui/material';
import theme from './theme';
import StarRating from './StarRating';
import CreateReviewRow from './CreateReviewRow';
import { getAuth } from "firebase/auth";

function CreateReview({cafeName, cid}) {
    const [userRating, setUserRating] = useState(0);
    const [drinkRating, setDrinkRating] = useState(0);
    const [foodRating, setFoodRating] = useState(0);
    const [atmosphereRating, setAtmosphereRating] = useState(0);
    const [notes, setNotes] = useState("");
    const [showSubmissionResult, setShowSubmissionResult] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState(null);

    const handleSubmit = async () => {
        setShowSubmissionResult(true);
        // Add your review submission logic here
        const result = await FormSubmission();
        setSubmissionMessage(result);
    };
    const FormSubmission = async () => {
        if (userRating === 0){
            return <Alert severity="error">Please submit a ranking.</Alert>;
        }
        try {
            const auth = getAuth();
            const user = auth.currentUser; // Get current user synchronously
            
            if (!user) {
                return <Alert severity="error">You must be signed in to write a review.</Alert>;
            }
            
            // Fetch and find the matching user
            const res = await fetch("http://localhost:3001/users");
            if (!res.ok) throw new Error("Failed to fetch users");
            
            const users = await res.json();
            const matchingUser = users.find(u => u.firebase_uid === user.uid);
            
            if (!matchingUser) {
                console.error("No matching user found for this Firebase UID");
                return <Alert severity="error">User not found in database.</Alert>;
            }
            
            const currentUid = matchingUser.id; // Use local variable instead of state
            const currentCid = cid || 1; // Handle null cid
            
            
            const result = await CreateReviewRow(userRating, foodRating, drinkRating, atmosphereRating, notes, currentUid, currentCid);
            console.log(result);
            return <Alert severity="success">Your review was successfully created.</Alert>;
            
        } catch (error){
            console.log(error);
            return <Alert severity="error">An error has occurred/you have already created a review for this cafe.</Alert>;
        }
    }
    return (
        <ThemeProvider theme={theme}>
            <Box 
            display="flex" 
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
                {showSubmissionResult && submissionMessage}
            </Box>
        </ThemeProvider>
    );
}

export default CreateReview;

