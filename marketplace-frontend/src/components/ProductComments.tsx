import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  Rating,
  IconButton,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ReplyIcon from '@mui/icons-material/Reply';
import { useAuthStore } from '../stores/authStore';
import { commentService } from '../services/commentService';
import { useWebSocket } from '../hooks/useWebSocket';
import type { ProductComment } from '../types';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import GradientButton from '../components/GradientButton';

interface ProductCommentsProps {
  productId: string;
}

export default function ProductComments({ productId }: ProductCommentsProps) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);

  useWebSocket({
    userId: user?.id,
    onComment: (comment) => {
      if (comment.product_id === productId) {
        setComments((prev) => [comment, ...prev]);
      }
    },
  });

  useEffect(() => {
    loadComments();
  }, [productId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await commentService.getComments(productId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    try {
      const comment = await commentService.addComment(productId, {
        content: newComment,
        rating: rating || undefined,
      });
      setComments((prev) => [comment, ...prev]);
      setNewComment('');
      setRating(null);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleAddReply = async () => {
    if (!replyContent.trim() || !replyingTo || !user) return;

    try {
      const reply = await commentService.addComment(productId, {
        content: replyContent,
        parent_id: replyingTo,
      });
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === replyingTo
            ? { ...comment, replies: [...(comment.replies || []), reply] }
            : comment
        )
      );
      setReplyingTo(null);
      setReplyContent('');
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await commentService.likeComment(commentId);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes_count: comment.likes_count + 1 }
            : comment
        )
      );
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Комментарии ({comments.length})
      </Typography>

      {/* Форма добавления комментария */}
      {user && (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Напишите комментарий..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Rating
              value={rating}
              onChange={(_, value) => setRating(value)}
              size="small"
            />
            <GradientButton
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              startIcon={<SendIcon />}
            >
              Отправить
            </GradientButton>
          </Box>
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Список комментариев */}
      <AnimatePresence>
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" spacing={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {comment.user?.name?.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {comment.user?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(comment.created_at), 'dd.MM.yyyy HH:mm')}
                    </Typography>
                  </Box>
                  {comment.rating && (
                    <Rating value={comment.rating} readOnly size="small" sx={{ mb: 0.5 }} />
                  )}
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {comment.content}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" onClick={() => handleLike(comment.id)}>
                      <ThumbUpIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="caption" color="text.secondary">
                      {comment.likes_count}
                    </Typography>
                    <IconButton size="small" onClick={() => setReplyingTo(comment.id)}>
                      <ReplyIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  {/* Ответы */}
                  {comment.replies?.map((reply) => (
                    <Box key={reply.id} sx={{ mt: 2, ml: 4 }}>
                      <Stack direction="row" spacing={1}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: 'secondary.main' }}>
                          {reply.user?.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="caption" fontWeight="bold">
                            {reply.user?.name}
                          </Typography>
                          <Typography variant="body2">
                            {reply.content}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  ))}

                  {/* Форма ответа */}
                  {replyingTo === comment.id && (
                    <Box sx={{ mt: 1, ml: 4 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Написать ответ..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <Box sx={{ mt: 1 }}>
                        <Button size="small" onClick={handleAddReply}>
                          Ответить
                        </Button>
                        <Button size="small" onClick={() => setReplyingTo(null)}>
                          Отмена
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Stack>
            </Box>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
}
