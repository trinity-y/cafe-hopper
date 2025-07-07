import React, { useEffect, useState } from 'react';
import BookmarkTable from '../components/BookmarkTable';

const BookmarkTab = () => {
  const [bookmarkedCafes, setBookmarkedCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch('http://localhost:3001/bookmarks/bookmarked-cafes/1');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBookmarkedCafes(data);
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = (id) => {
    setBookmarkedCafes((prev) => prev.filter((b) => b.id !== id));
  };

  if (loading) return <p>Loading bookmarks...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <BookmarkTable bookmarkedCafes={bookmarkedCafes} onRemoveBookmark={handleRemoveBookmark} />
  );
};

export default BookmarkTab;
