import { Paper, Stack, TextField, FormControl, InputLabel, Select, MenuItem, Button, IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: Array<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
  }>;
  onClear?: () => void;
  showClear?: boolean;
}

export default function FilterBar({
                                    searchPlaceholder = 'Поиск...',
                                    searchValue,
                                    onSearchChange,
                                    filters = [],
                                    onClear,
                                    showClear = true,
                                  }: FilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper sx={{ p: 2, mb: 3, borderRadius: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
          <FilterListIcon color="action" />

          {onSearchChange && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              sx={{ flex: 1, minWidth: 200 }}
            />
          )}

          {filters.map((filter, index) => (
            <FormControl key={index} size="small" sx={{ minWidth: 150 }}>
              <InputLabel>{filter.label}</InputLabel>
              <Select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                label={filter.label}
              >
                <MenuItem value="">Все</MenuItem>
                {filter.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}

          {showClear && onClear && (
            <Tooltip title="Очистить фильтры">
              <IconButton onClick={onClear} size="small">
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Paper>
    </motion.div>
  );
}
