import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { label: 'Search', path: '/cafesearch' },
    { label: 'Feed', path: '/feed' },
    { label: 'Profile', path: '/profile' },
];

export default function Navbar() {
    const location = useLocation();

    return (
        <AppBar position="static">
            <Toolbar>
                {/* App Title / Logo */}
                <Typography variant="h6" component={Link} to="/" sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}>
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
                                color: location.pathname === item.path ? 'secondary.main' : 'inherit',
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