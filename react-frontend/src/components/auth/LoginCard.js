import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import handleLogin from '../../api/auth';
const theme = createTheme();

function LoginCard() {
    const [email, setEmail] = React.useState("");
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState("");

    const validateInputs = () => {
        if (!email || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            return true;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
            return false;
        }
    };

    const handleSubmit = async () => {
        if (emailError) return;
        const successfulAuth = await handleLogin(email);
        if (!successfulAuth) {
            setEmailErrorMessage('We could not send an email to this email address. Try again later.')
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Card variant='active'>
                <Typography
                    component="h1"
                >
                    Log in
                </Typography>
                <Typography>
                    Enter your e-mail and we'll send you a passwordless sign-in link.
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                            error={emailError}
                            helperText={emailErrorMessage}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={emailError ? 'error' : 'primary'}
                            value={email}
                            onChange={(event)=>{setEmail(event.target.value)}}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={validateInputs}
                        >
                        Send me a link!
                    </Button>
                </Box>
                
            </Card>
        </ThemeProvider>
    );
}

export default LoginCard;

