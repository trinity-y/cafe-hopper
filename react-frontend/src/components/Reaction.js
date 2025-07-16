import React, { useState, useEffect } from 'react';
import { ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from 'axios';
import './Reaction.css';

const Reaction = ({ reviewId, onReactionChange }) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [likeCount, setLikeCount] = useState(0); 

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserIdFromFirebaseUid(user.uid);
      } else {
        setCurrentUser(null);
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserIdFromFirebaseUid = async (firebaseUid) => {
    try {
      const response = await axios.get(`http://localhost:3001/users/firebase/${firebaseUid}`);
      setUserId(response.data.id);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  const fetchLikeCount = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/reactions?reviewId=${reviewId}`);
      setLikeCount(response.data.like_count ?? 0);
    } catch (error) {
      setLikeCount(0);
    }
  };

  const checkExistingReaction = async () => {
    if (!userId || !reviewId) return;

    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3001/reactions?reviewId=${reviewId}&userId=${userId}`);
      const userReaction = response.data.find(reaction => 
        reaction.uid === userId && reaction.reaction === 'like'
      );
      setHasLiked(!!userReaction);
    } catch (error) {
      console.error('Error checking reaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkExistingReaction();
    fetchLikeCount();
  }, [userId, reviewId]);

  const handleReaction = async () => {
    if (isLoading) return;

    const auth = getAuth();
    
    if (!auth.currentUser) {
      alert('Please log in to react to reviews');
      return;
    }

    if (!userId) {
      alert('User data not loaded yet, please try again');
      return;
    }

    setIsLoading(true);
    try {
      if (hasLiked) {
        await axios.delete(`http://localhost:3001/reactions/${userId}/${reviewId}`);
        setHasLiked(false);
        if (onReactionChange) onReactionChange('remove');
      } else {
        await axios.post('http://localhost:3001/reactions', {
          uID: userId,
          rID: reviewId,
          reaction: 'like'
        });
        setHasLiked(true);
        if (onReactionChange) onReactionChange('add');
      }
      await fetchLikeCount();
    } catch (error) {
      console.error('Error updating reaction:', error);
      
      if (error.response?.status === 409) {
        alert('You have already reacted to this review');
      } else if (error.response?.status === 404) {
        alert('Reaction not found');
      } else if (error.response?.status === 401) {
        alert('Please log in to react to reviews');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return null; 
  }

  return (
    <Box display="flex" alignItems="center" gap={0.5} className="reaction-container">
      <IconButton
        onClick={handleReaction}
        aria-label={hasLiked ? "Unlike" : "Like"}
        color="inherit"
        disabled={isLoading || !userId}
        sx={{
          '&:hover': { color: 'secondary.main' },
          padding: 0.5,
          width: 'auto'
        }}
      >
        {hasLiked ? (
          <ThumbUp className="thumb-icon filled" />
        ) : (
          <ThumbUpOutlined className="thumb-icon" />
        )}
      </IconButton>
      <Typography variant="body2" style={{ margin: 'auto 0' }}>
        {likeCount}
      </Typography>
    </Box>
  );
};

export default Reaction;