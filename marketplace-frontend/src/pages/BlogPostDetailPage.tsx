import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Avatar,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { blogService } from '../services/blogService';
import type { BlogPost } from '../types';
import { format } from 'date-fns';

export default function BlogPostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      const data = await blogService.getPost(slug);
      setPost(data);
    } catch (error) {
      setError('Статья не найдена');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Container>
        <Alert severity="error">{error || 'Статья не найдена'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>
          {post.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar>
            {post.author?.name?.charAt(0) || 'A'}
          </Avatar>
          <Box>
            <Typography variant="body1">
              {post.author?.name || 'Автор'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {format(new Date(post.published_at || post.created_at), 'dd MMMM yyyy, HH:mm')}
            </Typography>
          </Box>
        </Box>

        {post.excerpt && (
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            {post.excerpt}
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {post.content}
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Просмотров: {post.views_count}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Лайков: {post.likes_count}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
