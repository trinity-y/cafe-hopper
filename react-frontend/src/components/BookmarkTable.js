import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import BookmarkButton from './BookmarkButton';

export default function BookmarkTable({ bookmarks, onRemoveBookmark }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="bookmarks table">
        <TableHead>
          <TableRow>
            <TableCell>Bookmark ID</TableCell>
            <TableCell>User ID</TableCell>
            <TableCell>Cafe ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookmarks.map((bookmark) => (
            <TableRow key={bookmark.id}>
              <TableCell>
                <BookmarkButton 
                  isBookmarked={ true }
                  onToggle={async (newState) => {
                    if (!newState) {
                      try {
                        const res = await fetch(`http://localhost:3001/bookmarks/${bookmark.id}`, {
                          method: 'DELETE',
                        });
                        if (!res.ok) throw new Error('Failed to delete bookmark');
                        onRemoveBookmark(bookmark.id); // update parent state
                        return true;
                      } catch (err) {
                        console.error('Error deleting bookmark:', err);
                      }
                    }
                    return false;
                  }}
                /> 
                {bookmark.id} 
              </TableCell>
              <TableCell>{bookmark.uid}</TableCell>
              <TableCell>{bookmark.cid}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

