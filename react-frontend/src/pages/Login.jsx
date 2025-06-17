import React from 'react';
import { Navigate } from "react-router-dom";

import { isSignInWithEmailLink, onAuthStateChanged } from 'firebase/auth';
import auth from '../firebase/firebase';
import authAPI from '../api/auth';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

import LoginCard from '../components/auth/LoginCard';
import MessageCard from '../components/auth/MessageCard';
import theme from '../components/theme';

const statuses = {
    LOADING:"loading",
    SIGNINGUP:"signingup",
    LOGIN:"login",
    ERROR:"error",
}

function LoginPage() {
    const [status, setStatus] = React.useState(statuses.LOADING); // enforce enum
    const [navigateTo, setNavigateTo] = React.useState("");
    
    React.useEffect(() => {
        const trySignInWithEmailLink = async () => {
        const url = window.location.href;

        if (isSignInWithEmailLink(auth, url)) {
            const email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                setStatus(statuses.ERROR);
                return;
            }
            try {
                await authAPI.loginFromLink(email, url);
            } catch (error) {
                console.error('Error signing in with email link:', error);
                setStatus(statuses.ERROR);
            }
        } 
        };

        trySignInWithEmailLink();
    }, []);

    React.useEffect(() => {
        const cleanupFunc = onAuthStateChanged(auth, (user) => {
            if (user) { // if already signed in
                setNavigateTo("/");
                localStorage.removeItem('emailForSignIn'); // clean up
            } else { // otherwise we need to log in
                setStatus(statuses.LOGIN);
            }
        });

        return () => cleanupFunc();
    }, []);

    if (navigateTo) {
        return <Navigate to={navigateTo} replace/>;
    }

    return (
        <>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Stack
                height="50%"
                justifyContent="center"
                alignItems="center"
            >
            {status === statuses.LOADING && 
                <MessageCard message="Loading..."/>
            }
            {status === statuses.LOGIN && 
                <LoginCard/>
            }
            {status === statuses.ERROR &&
                <MessageCard message="Couldn't log you in. Try again later."/>
            }
            </Stack>
        </ThemeProvider>
        </>
    );
}

export default LoginPage;

