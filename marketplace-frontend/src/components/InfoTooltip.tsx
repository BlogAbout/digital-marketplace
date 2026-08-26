import { Tooltip, IconButton, Typography, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface InfoTooltipProps {
  title: string;
  description?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export default function InfoTooltip({
                                      title,
                                      description,
                                      placement = 'top',
                                    }: InfoTooltipProps) {
  return (
    <Tooltip
      title={
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" sx={{ maxWidth: 200 }}>
              {description}
            </Typography>
          )}
        </Box>
      }
      placement={placement}
      arrow
    >
      <IconButton size="small">
        <InfoIcon fontSize="small" color="action" />
      </IconButton>
    </Tooltip>
  );
}
