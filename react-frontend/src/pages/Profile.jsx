import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import theme from '../components/theme';
import BookmarkTab from '../components/BookmarkTab';
import FriendTab from '../components/FriendsTab';
import UserOverview from '../components/UserOverview';
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <ThemeProvider theme={theme}>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    </ThemeProvider>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%', maxWidth: '900px', mx: 'auto', mt: 4, px: 2}}>
        <Box sx={{display:'flex', flexDirection:'column', gap:2}}>
          <UserOverview/>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="profile tabs">
              <Tab label="Reviews" {...a11yProps(0)} />
              <Tab label="Bookmarks" {...a11yProps(1)} />
              <Tab label="Following" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            Add reviews here
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <BookmarkTab />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <FriendTab />
          </CustomTabPanel>
        </Box>
      </Box>

    </ThemeProvider>
  );
}

