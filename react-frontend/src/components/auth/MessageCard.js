import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import theme from '../theme';

function MessageCard({message}) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Stack
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '70vh',
                }}
            >
                <Card
                    variant='outline'
                    sx={{ p: '3em', width:'80%'}}
                >
                    
                <Typography>{message}</Typography>                    
                </Card>
            </Stack>
            
        </ThemeProvider>
    );
}

export default MessageCard;

