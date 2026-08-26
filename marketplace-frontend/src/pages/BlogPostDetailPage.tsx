// src/pages/BlogPostDetailPage.tsx
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Avatar,
  Stack,
  Chip,
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import { blogService } from '../services/blogService';
import type { BlogPost } from '../types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import SkeletonLoader from '../components/SkeletonLoader';
import EnhancedEmptyState from '../components/EnhancedEmptyState';
import AvatarWithStatus from '../components/AvatarWithStatus';
import { useToast } from '../components/ToastProvider';
import ArticleIcon from '@mui/icons-material/Article';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

export default function BlogPostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();

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
      showToast('Ошибка при загрузке статьи', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <SkeletonLoader type="profile" />
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <EnhancedEmptyState
          icon={<ArticleIcon sx={{ fontSize: 80, color: 'primary.main' }} />}
          title="Статья не найдена"
          description="Возможно, статья была удалена или перемещена"
          primaryAction={{
            label: 'Вернуться в блог',
            onClick: () => window.location.href = '/blog',
          }}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper sx={{ p: 4, borderRadius: 6 }}>
          {/* Title */}
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {post.title}
          </Typography>

          {/* Author Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            {post.author && (
              <>
                <AvatarWithStatus user={post.author} size={48} showOnline={false} />
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {post.author.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(post.published_at || post.created_at), 'dd MMMM yyyy, HH:mm')}
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          {/* Stats */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Chip
              icon={<VisibilityIcon />}
              label={`${post.views_count} просмотров`}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 6 }}
            />
            <Chip
              icon={<ThumbUpIcon />}
              label={`${post.likes_count} лайков`}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 6 }}
            />
          </Stack>

          {/* Excerpt */}
          {post.excerpt && (
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              {post.excerpt}
            </Typography>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Content */}
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.8,
              '& img': {
                maxWidth: '100%',
                borderRadius: 3,
                my: 2,
              },
            }}
          >
            {post.content}
          </Typography>

          {/* Back to blog */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Link to="/blog" style={{ textDecoration: 'none' }}>
              <Typography color="primary">
                ← Вернуться в блог
              </Typography>
            </Link>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
}
