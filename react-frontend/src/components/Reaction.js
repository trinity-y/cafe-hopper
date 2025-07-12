import React, { useState, useEffect } from 'react';
import { ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from 'axios';
import './Reaction.css';

const Reaction = ({ reviewId, onReactionChange }) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userId, setUserId] = useState(null);

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

  const checkExistingReaction = async () => {
    if (!userId || !reviewId) return;

    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3001/reactions/review/${reviewId}?userId=${userId}`);
      const userReaction = response.data.find(reaction => 
        reaction.uID === userId && reaction.reaction === 'like'
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
        await axios.delete('http://localhost:3001/reactions', {
          data: {
            userId: userId,
            reviewId: reviewId
          }
        });
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
    <div className="reaction-container">
      <button 
        className={`reaction-button ${hasLiked ? 'active' : ''}`}
        onClick={handleReaction}
        disabled={isLoading || !userId}
        aria-label={hasLiked ? "Unlike" : "Like"}
        title={hasLiked ? "Unlike" : "Like"}
      >
        {hasLiked ? (
          <ThumbUp className="thumb-icon filled" />
        ) : (
          <ThumbUpOutlined className="thumb-icon" />
        )}
      </button>
    </div>
  );
};

export default Reaction;