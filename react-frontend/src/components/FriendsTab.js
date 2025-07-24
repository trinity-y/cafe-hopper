import { useEffect, useState } from 'react';
import { Box, Typography, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Grid, Card, CardContent } from '@mui/material';
import UserSearch from './UserSearch';
import axios from 'axios';
import { useUser } from '../context/userContext';
import getEmojiForUser from './UserEmoji'

const baseUrl = process.env.REACT_APP_ISLOCAL === "true" ? process.env.REACT_APP_LOCAL_API_URL : process.env.REACT_APP_PROD_API_URL;

const FriendTab = () => {
  const { userId } = useUser();
  const [friends, setFriends] = useState([]);
  const [mutuals, setMutuals] = useState([]);
  const [unfollowingId, setUnfollowingId] = useState(null);

  const fetchFriends = async () => {
    try {
      const response = await fetch(`${baseUrl}/friends/${userId}`);
      const data = await response.json();
      setFriends(data);
    } catch (err) {
      console.error('Error fetching friends:', err);
    }
  };

  const fetchMutuals = async () => {
    try {
      const response = await fetch(`${baseUrl}/friends/mutuals/${userId}`);
      const data = await response.json();
      setMutuals(data);
    } catch (err) {
      console.error('Error fetching mutuals:', err);
    }
  };

  const handleUnfollow = async (friendId) => {
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
    setMutuals((prev) => prev.filter((m) => m.id !== friendId));

    try {
      const res = await axios.delete(`${baseUrl}/friends/${userId}/${friendId}`);
      if (res.status !== 200) throw new Error('Failed to unfollow');
      fetchFriends();
      fetchMutuals();
    } catch (err) {
      console.error('Error unfollowing:', err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFriends();
      fetchMutuals();
    }
  }, [userId]);

  const handleFriendAdded = () => {
    fetchFriends();
    fetchMutuals();
  };

  if (!userId) return null;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Following
      </Typography>

      {friends.length !== 0 && (
        <Typography variant="body2" color='gray'>
          ({mutuals.length} {mutuals.length === 1 ? 'user follows' : 'users follow'} you back)
        </Typography>
      )}

      {friends.length === 0 ? (
        <Typography variant="body2" sx={{ mb: 4 }} >You haven’t followed anyone yet.</Typography>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
          <Grid container spacing={2} justifyContent="center">
            {friends.map((friend) => (
              <Grid key={friend.id}>
                <Card variant="outlined" sx={{ borderRadius: 10, height: 55 }}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">
                      {`${getEmojiForUser(friend.id)} ${friend.username}`}
                    </Typography>
                    <IconButton disableRipple sx={{ p: 0 }} onClick={() => handleUnfollow(friend.id)}>
                      <CloseIcon sx={{ px: 1 }} fontSize="small" />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Divider></Divider>

      <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
        Discover People
      </Typography>
      <UserSearch userId={userId} onFriendAdded={handleFriendAdded} friends={friends} />
    </Box>
  );
};

export default FriendTab;
