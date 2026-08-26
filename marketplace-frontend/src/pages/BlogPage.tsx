import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  CircularProgress,
  TextField,
  Pagination,
  Chip,
  Stack,
  Avatar,
  InputAdornment,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { blogService } from '../services/blogService';
import type { BlogPost } from '../types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmptyState from '../components/EmptyState';
import ArticleIcon from '@mui/icons-material/Article';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPosts();
  }, [page, search]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await blogService.getPosts({
        page,
        per_page: 9,
        search: search || undefined,
      });
      setPosts(response.data);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !posts.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Блог
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Полезные статьи и руководства
        </Typography>
        <TextField
          placeholder="Поиск по статьям..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: 500, width: '100%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {posts.length > 0 ? (
        <Grid container spacing={4}>
          {posts.map((post, index) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  component={Link}
                  to={`/blog/${post.slug}`}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    '&:hover': {
                      '& .blog-image': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                >
                  <Box sx={{ overflow: 'hidden' }}>
                    <CardMedia
                      component="div"
                      className="blog-image"
                      sx={{
                        height: 200,
                        bgcolor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.3s ease-in-out',
                      }}
                    >
                      <Typography variant="h1" color="text.secondary" sx={{ fontSize: 80 }}>
                        {post.title.charAt(0)}
                      </Typography>
                    </CardMedia>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        label="Статья"
                        size="small"
                        sx={{ borderRadius: 6 }}
                      />
                      <Chip
                        label={format(new Date(post.published_at || post.created_at), 'dd.MM.yyyy')}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 6 }}
                      />
                    </Stack>

                    <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                      {post.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.excerpt || post.content.substring(0, 150)}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                        {post.author?.name?.charAt(0)}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {post.author?.name}
                      </Typography>
                    </Box>
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      sx={{ textTransform: 'none' }}
                    >
                      Читать далее
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyState
          icon={<ArticleIcon sx={{ fontSize: 80, color: 'text.secondary' }} />}
          title="Статьи не найдены"
          description="Попробуйте изменить поисковый запрос"
        />
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
}
