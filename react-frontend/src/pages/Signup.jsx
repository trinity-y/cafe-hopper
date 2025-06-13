import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import Stack from '@mui/material/Stack';

import SignupCard from '../components/auth/SignupCard';

import theme from '../components/theme';

function SignupPage() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Stack
                height="50%"
                justifyContent="center"
                alignItems="center"
            >
                <SignupCard/>
            </Stack>
        </ThemeProvider>
    );
}

export default SignupPage;

