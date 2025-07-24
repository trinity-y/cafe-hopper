import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UserList from './UserList';

const baseUrl = process.env.REACT_APP_ISLOCAL === "true" ? process.env.REACT_APP_LOCAL_API_URL : process.env.REACT_APP_PROD_API_URL;

const UserSearch = ({ userId, onFriendAdded, friends = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [addingIds, setAddingIds] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
        return;
      }

      const fetchUsers = async () => {
        setLoading(true);
        try {
          const res = await fetch(`${baseUrl}/users/search?search=${searchTerm}&userId=${userId}`);
          const data = await res.json();
          setSearchResults(data);
        } catch (err) {
          console.error('Search error:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, userId]);

  useEffect(() => {
    setSearchResults((prev) =>
      prev.map((user) => ({
        ...user,
        isFriend: friends.some((f) => f.id === user.id),
      }))
    );
  }, [friends]);

  const handleAddFriend = async (friendId) => {
    setAddingIds((prev) => [...prev, friendId]);

    try {
      const res = await fetch('http://localhost:3001/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, following_id: friendId }),
      });

      if (res.ok) {
        setSnackbarMessage('Friend added!');
        setSearchResults((prev) =>
          prev.map((user) =>
            user.id === friendId ? { ...user, isFriend: true } : user
          )
        );
        onFriendAdded?.();
      } else {
        const error = await res.json();
        setSnackbarMessage(error.message || 'Failed to add friend');
      }
    } catch (err) {
      setSnackbarMessage('Error adding friend');
    } finally {
      setAddingIds((prev) => prev.filter((id) => id !== friendId));
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Search users"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: loading && <CircularProgress size={20} />,
        }}
        sx={{ mb: 2 }}
      />
      <UserList users={searchResults} onAddFriend={handleAddFriend} addingIds={addingIds} />
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={2000}
        onClose={() => setSnackbarMessage('')}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default UserSearch;
