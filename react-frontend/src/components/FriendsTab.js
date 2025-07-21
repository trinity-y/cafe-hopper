import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import UserSearch from './UserSearch';
import { useUser } from '../context/userContext';

const FriendTab = () => {
  const { userId } = useUser();
  const [friends, setFriends] = useState([]);
  const [mutuals, setMutuals] = useState([]);

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

  useEffect(() => {
    if (userId) {
      fetchFriends();
      fetchMutuals();
    }
  }, [userId]);

  const handleFriendAdded = () => {
    fetchFriends();
  };

  if (!userId) return null;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Your Friends
      </Typography>
      
      <Typography variant="p" color='gray' sx={{ mt: 1, mb: 3 }}>
        ({mutuals.length} mutual friends)
      </Typography>

      <List sx={{ mb: 4 }}>
        {friends.length === 0 ? (
          <Typography variant="body2">You haven’t added any friends yet.</Typography>
        ) : (
          friends.map((friend) => (
            <ListItem key={friend.id} divider>
              <ListItemText primary={`🐸 ${friend.username}`} />
            </ListItem>
          ))
        )}
      </List>

      <Typography variant="h6" gutterBottom>
        Add New Friends
      </Typography>
      <UserSearch userId={userId} onFriendAdded={handleFriendAdded} />
    </Box>
  );
};

export default FriendTab;
