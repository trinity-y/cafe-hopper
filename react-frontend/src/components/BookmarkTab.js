import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import BookmarkTable from '../components/BookmarkTable';

const BookmarkTab = () => {
  const [uid, setUid] = useState(null);
  const [bookmarkedCafes, setBookmarkedCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detect current user
  useEffect(() => {
  const auth = getAuth();

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      // get firebase_uid of currently signed in user
      const firebaseUid = user.uid;

      try {
        const res = await fetch("http://localhost:3001/users");
        if (!res.ok) throw new Error("Failed to fetch users");

        const users = await res.json();

        // find user in db with matching firebase_uid
        const matchingUser = users.find(u => u.firebase_uid === firebaseUid);

        if (matchingUser) {
          setUid(matchingUser.id); 
          console.log("Matched internal UID:", matchingUser.id);
        } else {
          console.warn("No matching user found for this Firebase UID");
        }

      } catch (err) {
        console.error("Error fetching users or matching UID:", err);
      }
    } else {
      setUid(null);
      console.log("No user is signed in.");
    }
  });

  return () => unsubscribe();
}, []);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    // get bookmarks for the current user
    const fetchBookmarks = async () => {
      try {
        const res = await fetch(`http://localhost:3001/bookmarks/bookmarked-cafes/${uid}`);
        if (!res.ok) throw new Error('Failed to fetch bookmarks');

        const data = await res.json();
        setBookmarkedCafes(data);
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [uid]);

  const handleRemoveBookmark = (bookmarkId) => {
    setBookmarkedCafes((prev) => prev.filter((b) => b.bookmarkId !== bookmarkId));
  };

  if (loading) return <p>Loading bookmarks...</p>;

  return (
    <BookmarkTable
      bookmarkedCafes={bookmarkedCafes}
      onRemoveBookmark={handleRemoveBookmark}
    />
  );
};

export default BookmarkTab;
