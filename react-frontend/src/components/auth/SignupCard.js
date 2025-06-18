import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import authAPI from '../../api/auth';
import theme from '../theme';

function SignupCard() {
    const [email, setEmail] = React.useState("");
    const [emailError, setEmailError] = React.useState(false);
    const [emailMessage, setEmailMessage] = React.useState("");

    const [username, setUsername] = React.useState("");
    // eslint-disable-next-line no-unused-vars
    const [usernameError, setUsernameError] = React.useState(false); // ! eventually return an error if the username already exists
    // eslint-disable-next-line no-unused-vars
    const [usernameMessage, setUsernameMessage] = React.useState("");

    const validateInputs = async () => {
        let valid = true;
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(true);
            setEmailMessage('Please enter a valid email address.');
            valid = false;
        } else if (await authAPI.doesEmailExist(email)) {
            setEmailError(true);
            setEmailMessage('Looks like you already have an account! Please log in instead.');
            valid = false;
        } else {
            setEmailError(false);
            setEmailMessage('');
        }

        if (!username) {
            setUsernameError(true);
            setUsernameMessage('Please enter a username.');
            valid = false;
        } else if (!(await authAPI.validUsername(username))) {
            setUsernameError(true);
            setUsernameMessage(`Username ${username} already exists! Please pick another.`);
            valid = false;
        } else {
            setUsernameError(false);
            setUsernameMessage('');
        }
        return valid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!(await validateInputs())) return;
        const emailSent = await authAPI.handleSignup(email, username);
        if (!emailSent) {
            setEmailMessage('We could not send an email to this email address. Try again later.')
        } else {
            setEmailMessage('Sent! Check your inbox.');
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Stack
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Card
                    variant='outline'
                    sx={{ p: '3em', width:'80%'}}
                >
                    <Typography
                        variant="h3"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', paddingBottom:'0.5rem' }}
                    >
                        Welcome to Cafe Hopper! 🐸☕
                    </Typography>
                    <Typography
                        variant="body"
                    >
                        Fill in some quick info to get started.
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            gap:'1em',
                            paddingTop:'1em',
                        }}
                    >
                        <FormControl fullWidth>
                            <FormLabel htmlFor="name">Username</FormLabel>
                            <TextField
                                error={usernameError}
                                helperText={usernameMessage}
                                id="username"
                                type="username"
                                name="username"
                                placeholder="froggy2025"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={usernameError ? 'error' : 'primary'}
                                value={username}
                                onChange={(event)=>{setUsername(event.target.value)}}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                error={emailError}
                                helperText={emailMessage}
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
                            >
                            Sign Up
                        </Button>
                    </Box>
                    
                </Card>
            </Stack>
            
        </ThemeProvider>
    );
}

export default SignupCard;

