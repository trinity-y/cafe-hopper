import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import BookmarkTable from './BookmarkTable';
import { useUser } from '../context/userContext';

export default function BookmarkTab() {
  const { userId } = useUser();
  const [bookmarkedCafes, setBookmarkedCafes] = useState([]);

  const fetchBookmarkedCafes = async () => {
    try {
      const res = await fetch(`http://localhost:3001/bookmarks/bookmarked-cafes/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch bookmarked cafes');
      const data = await res.json(); // [{ cid, name, rating, bookmarkId }]
      setBookmarkedCafes(data);
    } catch (err) {
      console.error('Error fetching bookmarked cafes:', err);
    }
  };

  const handleRemoveBookmark = (removedId) => {
    setBookmarkedCafes((prev) =>
      prev.filter((cafe) => cafe.bookmarkId !== removedId)
    );
  };

  useEffect(() => {
    fetchBookmarkedCafes();
  }, [userId]);

  return (
    <Box sx={{ p: 4 }}>
      {bookmarkedCafes.length === 0 ? (
        <p>
          You have no bookmarks yet.
        </p>
      ) : (
        <BookmarkTable
          bookmarkedCafes={bookmarkedCafes}
          onRemoveBookmark={handleRemoveBookmark}
        />
      )}
    </Box>
  );
}
