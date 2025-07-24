import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import BookmarkButton from './BookmarkButton';

const baseUrl = process.env.REACT_APP_ISLOCAL === "true" ? process.env.REACT_APP_LOCAL_API_URL : process.env.REACT_APP_PROD_API_URL;

export default function BookmarkTable({ bookmarkedCafes, onRemoveBookmark }) {
  const [loadingIds, setLoadingIds] = useState([]);

  const handleToggle = async (newState, bookmarkId) => {
    if (loadingIds.includes(bookmarkId)) return false;
    setLoadingIds((prev) => [...prev, bookmarkId]);

    try {
      if (!newState) {
        const res = await fetch(`${baseUrl}/bookmarks/${bookmarkId}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete bookmark');

        onRemoveBookmark(bookmarkId); // update parent state
        return true;
      }
      return false; // re-adding not supported in profile
    } catch (err) {
      console.error('Error deleting bookmark:', err);
      return false;
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== bookmarkId));
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="bookmarks table">
        <TableHead>
          <TableRow>
            <TableCell>☕ Cafe</TableCell>
            <TableCell>Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookmarkedCafes.map((cafe) => (
            <TableRow key={cafe.bookmarkId}>
              <TableCell>
                <BookmarkButton
                  isBookmarked={true}
                  onToggle={(newState) => handleToggle(newState, cafe.bookmarkId)}
                />
                {cafe.name}
              </TableCell>
              <TableCell>{cafe.googleRating}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
