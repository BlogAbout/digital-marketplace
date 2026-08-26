import { Fab, Zoom, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  tooltip?: string;
  icon?: React.ReactNode;
  position?: {
    bottom?: number;
    right?: number;
  };
}

export default function FloatingActionButton({
                                               onClick,
                                               tooltip = 'Добавить',
                                               icon = <AddIcon />,
                                               position = { bottom: 24, right: 24 },
                                             }: FloatingActionButtonProps) {
  const [visible, setVisible] = useState(true);

  return (
    <Zoom in={visible}>
      <Tooltip title={tooltip} placement="left">
        <Fab
          color="primary"
          onClick={onClick}
          sx={{
            position: 'fixed',
            bottom: position.bottom,
            right: position.right,
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
            '&:hover': {
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s',
          }}
        >
          {icon}
        </Fab>
      </Tooltip>
    </Zoom>
  );
}
