import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import BookmarkButton from './BookmarkButton';

export default function BookmarkTable({ bookmarkedCafes, onRemoveBookmark }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="bookmarks table">
        <TableHead>
          <TableRow>
            <TableCell>Cafe Name</TableCell>
            <TableCell>Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookmarkedCafes.map((bookmarkedCafe) => (
            <TableRow key={bookmarkedCafe.bookmarkId}>
              <TableCell>
                <BookmarkButton 
                  isBookmarked={ true }
                  onToggle={async (newState) => {
                    if (!newState) {
                      try {
                        const res = await fetch(`http://localhost:3001/bookmarks/${bookmarkedCafe.bookmarkId}`, {
                          method: 'DELETE',
                        });
                        if (!res.ok) throw new Error('Failed to delete bookmark');
                        onRemoveBookmark(bookmarkedCafe.bookmarkId); // update parent state
                        return true;
                      } catch (err) {
                        console.error('Error deleting bookmark:', err);
                      }
                    }
                    return false;
                  }}
                /> 
                {bookmarkedCafe.name} 
              </TableCell>
              <TableCell>{bookmarkedCafe.rating}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

