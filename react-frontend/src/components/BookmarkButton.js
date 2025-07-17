import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import CircularProgress from '@mui/material/CircularProgress';

export default function BookmarkButton({ isBookmarked = false, onToggle }) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    const newState = !bookmarked;
    try {
      const success = await onToggle?.(newState);
      if (success) {
        setBookmarked(newState);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <IconButton
      aria-label="bookmark"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <CircularProgress size={24} />
      ) : bookmarked ? (
        <BookmarkAddedIcon />
      ) : (
        <BookmarkAddOutlinedIcon />
      )}
    </IconButton>
  );
}
