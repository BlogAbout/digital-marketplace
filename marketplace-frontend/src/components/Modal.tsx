import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';
import type {ReactNode} from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export default function Modal({
                                open,
                                onClose,
                                title,
                                children,
                                actions,
                                maxWidth = 'sm',
                                fullWidth = true,
                              }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth={maxWidth}
          fullWidth={fullWidth}
          PaperComponent={motion.div}
          PaperProps={{
            initial: { opacity: 0, scale: 0.9, y: 20 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.9, y: 20 },
            transition: { duration: 0.2 },
            style: { borderRadius: 16 },
          }}
        >
          {title && (
            <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                {title}
              </Typography>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
          )}
          <DialogContent>{children}</DialogContent>
          {actions && <DialogActions sx={{ p: 3 }}>{actions}</DialogActions>}
        </Dialog>
      )}
    </AnimatePresence>
  );
}
