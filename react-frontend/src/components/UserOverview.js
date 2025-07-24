import {Box, Typography, Button} from '@mui/material';
import getEmojiForUser from './UserEmoji';
import { useUser } from '../context/userContext';
import { getAuth, signOut } from 'firebase/auth';

const handleSignOut = () => {
    signOut(getAuth())
}
const UserOverview = () => {
    const {user} = useUser();

    return (
        <Box sx={{display:'flex', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
            <Typography variant="h4" >Welcome, <b>{user?.username}</b>! {getEmojiForUser(user?.id)}</Typography>
            <Button variant='contained' sx={{color:'white'}} onClick={handleSignOut} >Sign Out</Button>
        </Box>
    );
};
export default UserOverview;

