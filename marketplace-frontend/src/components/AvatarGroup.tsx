import { Avatar, AvatarGroup as MuiAvatarGroup, Tooltip } from '@mui/material';
import type { User } from '../types';

interface AvatarGroupProps {
  users: User[];
  max?: number;
}

export default function AvatarGroup({ users, max = 4 }: AvatarGroupProps) {
  return (
    <MuiAvatarGroup max={max} spacing="small">
      {users.map((user) => (
        <Tooltip key={user.id} title={user.name}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 32,
              height: 32,
              fontSize: 14,
            }}
          >
            {user.name.charAt(0)}
          </Avatar>
        </Tooltip>
      ))}
    </MuiAvatarGroup>
  );
}
