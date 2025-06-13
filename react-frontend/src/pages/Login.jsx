import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import Stack from '@mui/material/Stack';

import LoginCard from '../components/auth/LoginCard';

import theme from '../components/theme';

function LoginPage() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Stack
                height="50%"
                justifyContent="center"
                alignItems="center"
            >
                <LoginCard/>
            </Stack>
        </ThemeProvider>
    );
}

export default LoginPage;

