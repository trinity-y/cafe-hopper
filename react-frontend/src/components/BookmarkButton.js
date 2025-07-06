import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';

export default function BookmarkButton() {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <IconButton
      aria-label="bookmark"
      onClick={() => setBookmarked(prev => !prev)}
    >
      {bookmarked ? <BookmarkAddedIcon /> : <BookmarkAddOutlinedIcon />}
    </IconButton>
  );
}
