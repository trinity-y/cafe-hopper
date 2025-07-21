import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Grid, Card, CardContent } from '@mui/material';
import UserSearch from './UserSearch';
import axios from 'axios';
import { useUser } from '../context/userContext';

const FriendTab = () => {
  const { userId } = useUser();
  const [friends, setFriends] = useState([]);
  const [mutuals, setMutuals] = useState([]);
  const [unfollowingId, setUnfollowingId] = useState(null);
  const userEmojis = ['🐸', '☕', '🥐', '🧋', '🍵', '🍪', '🥗', '🥯', '🍰', '🍧'];

  const getEmojiForUser = (userId) => {
  	const index = userId % userEmojis.length; // hashing userId -> emoji
  	return userEmojis[index];
	};

  const fetchFriends = async () => {
    try {
      const response = await fetch(`http://localhost:3001/friends/${userId}`);
      const data = await response.json();
      setFriends(data);
    } catch (err) {
      console.error('Error fetching friends:', err);
    }
  };

  const fetchMutuals = async () => {
    try {
      const response = await fetch(`http://localhost:3001/friends/mutuals/${userId}`);
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
      const res = await axios.delete(`http://localhost:3001/friends/${userId}/${friendId}`);
      if (!res.ok) throw new Error('Failed to unfollow');
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
        	({mutuals.length} user {mutuals.length === 1 ? 'follows' : 'follow'} you back)
      	</Typography>
			)}

    	{friends.length === 0 ? (
				<Typography variant="body2" sx={{ mb: 4 }} >You haven’t followed anyone yet.</Typography>
				) : (
				<Box sx={{ display: 'flex', justifyContent: 'center', mt:2, mb: 4 }}>
					<Grid container spacing={2}  justifyContent="center">
						{friends.map((friend) => (
							<Grid key={friend.id}>
								<Card variant="outlined" sx={{ borderRadius: 10, height: 55, cursor: 'pointer' }} onClick={() => handleUnfollow(friend.id)}>
										<CardContent>
											<Typography variant="body1">
													{`${getEmojiForUser(friend.id)} ${friend.username}`}
											</Typography>
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
      <UserSearch userId={userId} onFriendAdded={handleFriendAdded} />
    </Box>
  );
};

export default FriendTab;
