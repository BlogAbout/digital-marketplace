import { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment, IconButton, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import type { Product } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchProducts(debouncedQuery);
    } else {
      setResults([]);
      setOpen(false);
    }
  }, [debouncedQuery]);

  const searchProducts = async (search: string) => {
    try {
      const response = await productService.getProducts({ search, per_page: 5 });
      setResults(response.data);
      setOpen(true);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSelect = (product: Product) => {
    setQuery('');
    setOpen(false);
    navigate(`/products/${product.id}`);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 600 }}>
      <TextField
        fullWidth
        placeholder="Поиск товаров..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setOpen(true)}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            bgcolor: 'background.paper',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Paper
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                mt: 1,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                overflow: 'hidden',
              }}
            >
              <List sx={{ py: 0 }}>
                {results.map((product) => (
                  <ListItem
                    key={product.id}
                    onClick={() => handleSelect(product)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {product.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={product.name}
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {product.is_free ? 'Бесплатно' : `${product.cost} ${product.currency}`}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
