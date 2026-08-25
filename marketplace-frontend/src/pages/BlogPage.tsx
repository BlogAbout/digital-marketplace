import { Container, Typography } from '@mui/material';

export default function BlogPage() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Блог
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Здесь скоро появятся статьи и публикации
      </Typography>
    </Container>
  );
}
