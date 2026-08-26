import { Skeleton, Grid, Card, CardContent, Box } from '@mui/material';

interface SkeletonLoaderProps {
  type?: 'card' | 'list' | 'table' | 'profile';
  count?: number;
}

export default function SkeletonLoader({ type = 'card', count = 6 }: SkeletonLoaderProps) {
  if (type === 'card') {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" height={20} width="60%" sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton variant="text" width={80} height={40} />
                  <Skeleton variant="circular" width={40} height={40} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (type === 'list') {
    return (
      <Box>
        {Array.from({ length: count }).map((_, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, p: 2 }}>
            <Skeleton variant="circular" width={50} height={50} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" height={24} />
              <Skeleton variant="text" height={20} width="80%" />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (type === 'table') {
    return (
      <Box>
        <Skeleton variant="rectangular" height={50} sx={{ mb: 1 }} />
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={40} sx={{ mb: 0.5 }} />
        ))}
      </Box>
    );
  }

  if (type === 'profile') {
    return (
      <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <Skeleton variant="circular" width={120} height={120} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" height={40} width="50%" />
          <Skeleton variant="text" height={20} width="30%" />
          <Skeleton variant="text" height={20} width="40%" sx={{ mt: 2 }} />
        </Box>
      </Box>
    );
  }

  return null;
}
