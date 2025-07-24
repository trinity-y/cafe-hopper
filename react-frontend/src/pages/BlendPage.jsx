import React from 'react';
import { ThemeProvider } from '@emotion/react';
import theme from '../components/theme';
import { Box, Stack } from '@mui/material';
import Cafe from '../components/Cafe';
import CssBaseline from '@mui/material/CssBaseline';
import { Typography } from '@mui/material';
import { useUser } from '../context/userContext';
import Navbar from '../components/Navbar';
import blendAPI from '../api/blend';

function BlendPage() {
    const { userId } = useUser();
    const [cafes, setCafes] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                const getBlendResult = await blendAPI.getBlend(userId);
                setCafes(getBlendResult);
            }
        }
        console.log(cafes);
        fetchData();
    }, [userId]);

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Navbar />
                <Box
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    width={'100%'}
                >
                    <Box
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        width={'80%'}
                    >
                        <Stack
                            justifyContent="center"
                            alignItems={"center"}
                            width={'100%'}
                        >
                            <Box width={'100%'} sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '30px'
                            }}>
                                {
                                    cafes?.length > 0 ?
                                        cafes.map((cafe, index) => {
                                            return <Cafe key={index} cafe={cafe} />
                                        }) :
                                        <Box
                                            sx={{ alignItems: 'left' }}
                                            width='100%'
                                        >
                                            <Typography variant="h5">No cafe recommendations found. Try adding more friends!</Typography>
                                        </Box>
                                }
                            </Box>
                        </Stack>
                    </Box>

                </Box>



            </ThemeProvider>

        </>
    )
}

export default BlendPage;