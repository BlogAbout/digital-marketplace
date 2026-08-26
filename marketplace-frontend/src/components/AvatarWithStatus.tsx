import { Avatar, Badge, Tooltip, Box } from '@mui/material';
import type { User } from '../types';

interface AvatarWithStatusProps {
  user: User;
  size?: number;
  showOnline?: boolean;
  showTooltip?: boolean;
}

export default function AvatarWithStatus({
                                           user,
                                           size = 40,
                                           showOnline = true,
                                           showTooltip = true,
                                         }: AvatarWithStatusProps) {
  const isOnline = user.last_active &&
    new Date(user.last_active).getTime() > Date.now() - 5 * 60 * 1000;

  const avatar = (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: 'primary.main',
        fontSize: size * 0.4,
        border: '2px solid white',
      }}
    >
      {user.name.charAt(0)}
    </Avatar>
  );

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      {showOnline ? (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: isOnline ? 'success.main' : 'grey.400',
              width: size * 0.25,
              height: size * 0.25,
              borderRadius: '50%',
              border: '2px solid white',
            },
          }}
        >
          {avatar}
        </Badge>
      ) : (
        avatar
      )}
      {showTooltip && (
        <Tooltip title={user.name}>
          <Box component="span" />
        </Tooltip>
      )}
    </Box>
  );
}
