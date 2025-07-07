import React, { useEffect, useState } from 'react';
import BookmarkTable from '../components/BookmarkTable';

const BookmarkTab = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch('http://localhost:3001/bookmarks');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBookmarks(data);
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
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  if (loading) return <p>Loading bookmarks...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <BookmarkTable bookmarks={bookmarks} onRemoveBookmark={handleRemoveBookmark} />
  );
};

export default BookmarkTab;
