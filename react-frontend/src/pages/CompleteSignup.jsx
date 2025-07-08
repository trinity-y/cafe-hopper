import React from 'react';
import { Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import Stack from '@mui/material/Stack';

import MessageCard from '../components/auth/MessageCard';

import theme from '../components/theme';

import authAPI from '../api/auth';
import { onAuthStateChanged, isSignInWithEmailLink } from 'firebase/auth';
import auth from '../firebase/firebase';
function CompleteSignupPage() {
    const url = window.location.href;
    const urlSearchParams = new URLSearchParams(window.location.search);
    const username = urlSearchParams.get("username");
    const email = localStorage.getItem('emailForSignIn');

    const [navigateTo, setNavigateTo] = React.useState("")
    const [message, setMessage] = React.useState("Completing your signup...")

    React.useEffect(() => {
        // automatically handles and processes login link
        const cleanupFunc = onAuthStateChanged(auth, async (user) => {
            if (user) { // if already signed in
                try {
                    await authAPI.completeSignup(username, user.uid);
                    localStorage.removeItem("emailForSignIn");
                    setNavigateTo("/cafesearch");
                } catch (e) {
                    console.error(e);
                    setMessage("Something went wrong finishing signup.");
                }
            } else { // otherwise we need to log in
                setMessage("Could not process your sign up. Try again later.");
            }
        });
        return () => cleanupFunc();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const trySignInWithEmailLink = async () => {

        if (isSignInWithEmailLink(auth, url)) {
            if (!email) {
                setMessage("Couldn't log you in. Please try again later.");
                return;
            }

            try {
                await authAPI.loginFromLink(email, url);
            } catch (e) {
                console.error('Error signing in with email link:', e);
                setMessage("Couldn't log you in. Please try again later.");
            }
        }
        };

        trySignInWithEmailLink();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (navigateTo) {
        return <Navigate to={navigateTo} replace/>;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Stack
                height="50%"
                justifyContent="center"
                alignItems="center"
            >
                <MessageCard message={message}/>
            </Stack>
        </ThemeProvider>
    );
}

export default CompleteSignupPage;

