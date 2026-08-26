import { Box, Typography, Switch, FormControlLabel, Alert } from '@mui/material';
import { usePushNotifications } from '../hooks/usePushNotifications';

export default function PushNotificationToggle() {
  const { isSupported, isSubscribed, subscribe, unsubscribe } = usePushNotifications();

  if (!isSupported) {
    return (
      <Alert severity="info">
        Push уведомления не поддерживаются в этом браузере
      </Alert>
    );
  }

  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={isSubscribed}
            onChange={(e) => {
              if (e.target.checked) {
                subscribe();
              } else {
                unsubscribe();
              }
            }}
          />
        }
        label="Push уведомления"
      />
      <Typography variant="caption" color="text.secondary">
        Получайте уведомления о новых заказах и сообщениях
      </Typography>
    </Box>
  );
}
