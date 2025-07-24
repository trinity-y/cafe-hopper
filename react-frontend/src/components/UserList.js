import React from 'react';
import { List, ListItem, ListItemText, IconButton, ListItemSecondaryAction } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const UserList = ({ users, onAddFriend, addingIds }) => {
  return (
    <List>
      {users.map((user) => (
        <ListItem key={user.id} divider>
          <ListItemText primary={user.username} />
          <ListItemSecondaryAction>
            <IconButton
              disabled={user.isFriend || addingIds.includes(user.id)}
              onClick={() => onAddFriend(user.id)}
              edge="end"
              aria-label="add friend"
            >
              <PersonAddIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default UserList;
