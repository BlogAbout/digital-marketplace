import { Chip, type ChipProps, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

interface StatusBadgeProps extends Omit<ChipProps, 'color'> {
  status: string;
  size?: 'small' | 'medium';
}

const statusConfig: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  // Order statuses
  'pending': { label: 'Ожидает', color: 'warning' },
  'paid': { label: 'Оплачен', color: 'info' },
  'completed': { label: 'Завершен', color: 'success' },
  'cancelled': { label: 'Отменен', color: 'error' },
  'refunded': { label: 'Возврат', color: 'default' },

  // Product statuses
  'draft': { label: 'Черновик', color: 'default' },
  'approved': { label: 'Одобрен', color: 'success' },
  'rejected': { label: 'Отклонен', color: 'error' },
  'suspended': { label: 'Приостановлен', color: 'warning' },

  // Ticket statuses
  'open': { label: 'Открыт', color: 'error' },
  'in_progress': { label: 'В работе', color: 'warning' },
  'resolved': { label: 'Решен', color: 'success' },
  'closed': { label: 'Закрыт', color: 'default' },

  // Dispute statuses
  'under_review': { label: 'На рассмотрении', color: 'warning' },
};

export default function StatusBadge({ status, size = 'small', ...props }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, color: 'default' as const };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'inline-block' }}
    >
      <Tooltip title={status}>
        <Chip
          label={config.label}
          color={config.color}
          size={size}
          sx={{ borderRadius: 6, fontWeight: 'medium' }}
          {...props}
        />
      </Tooltip>
    </motion.div>
  );
}
