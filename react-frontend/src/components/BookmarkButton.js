import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';

export default function BookmarkButton({ isBookmarked = false, onToggle }) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  const handleClick = async () => {
    const newState = !bookmarked;

    const success = await onToggle?.(newState);
    if (success) {
      setBookmarked(newState);
    }
  };

  return (
    <IconButton aria-label="bookmark" onClick={handleClick}>
      {bookmarked ? <BookmarkAddedIcon /> : <BookmarkAddOutlinedIcon />}
    </IconButton>
  );
}
