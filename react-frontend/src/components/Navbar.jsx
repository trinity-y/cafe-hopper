import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';
import navLogo from './navLogo.PNG';

const navItems = [
    { label: 'Search', path: '/cafesearch' },
    { label: 'Feed', path: '/feed' },
    { label: 'Profile', path: '/profile' },
];

export default function Navbar() {
    const location = useLocation();

    return (
        <AppBar position="static" sx={{ backgroundColor: 'secondary.nav', boxShadow: 'none' }}>
            <Toolbar>
                {/* App Title / Logo */}
                <Box component="img" src={navLogo} sx={{
                    width: 40,
                    height: 40,
                    objectFit: 'cover',
                    objectPosition: 'center',
                    mr: 1
                }} />
                <Typography variant="h6" component={Link} to="/cafesearch" sx={{ color: 'background.default', textDecoration: 'none', flexGrow: 1 }}>
                    CaféHopper
                </Typography>

                {/* Nav links */}
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {navItems.map((item) => (
                        <Button
                            key={item.path}
                            component={Link}
                            to={item.path}
                            sx={{
                                color: location.pathname === item.path ? 'primary.main' : 'background.default',
                                textTransform: 'none',
                                ml: 1
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}